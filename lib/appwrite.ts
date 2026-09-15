import {
  Category,
  CreateUserParams,
  Customization,
  CustomizationOption,
  GetMenuParams,
  MenuCustomization,
  MenuItem,
  Order,
  Review,
  ReviewData,
  SignInParams,
  UpdateUserParams,
  User,
} from "@/type";
import { Platform } from "react-native";
import {
  Account,
  Avatars,
  Client,
  Databases,
  Functions,
  ID,
  Permission,
  Query,
  Role,
  Storage,
} from "react-native-appwrite";

const requiredEnv = {
  EXPO_PUBLIC_APPWRITE_ENDPOINT: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  EXPO_PUBLIC_APPWRITE_PROJECT_ID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  EXPO_PUBLIC_APPWRITE_DATABASE_ID:
    process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  EXPO_PUBLIC_APPWRITE_BUCKET_ID: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
};

const missing = Object.entries(requiredEnv)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  throw new Error(
    `Missing env vars: ${missing.join(", ")}. Copy .env.example to .env and fill it in.`,
  );
}

export const appwriteConfig = {
  endpoint: requiredEnv.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: requiredEnv.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ?? "com.foodify.app",
  databaseId: requiredEnv.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  bucketId: requiredEnv.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
  userCollectionId: "user",
  categoriesCollectionId: "categories",
  customizationsCollectionId: "customizations",
  menuCollectionId: "menu",
  menuCustomizationsCollectionId: "menu_customizations",
  ordersCollectionId: "orders",
  reviewsCollectionId: "reviews",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client); // 👈 Added
const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    try {
      const sessions = await account.listSessions();
      if (sessions.total > 0) {
        await account.deleteSessions();
      }
    } catch {}

    const newAccount = await account.create(ID.unique(), email, password, name);

    await signIn({ email, password });

    let avatar = "";
    try {
      avatar = avatars.getInitialsURL(name).toString();
    } catch {}

    // Scope this profile document (email, phone, home/work address) to its
    // own account — without this, whatever the `user` collection grants at
    // the collection level (needed for a signed-in user to read/update
    // their own profile at all) would let any authenticated user read or
    // overwrite everyone else's profile by calling the API directly, not
    // just their own. Requires Document Security ON for this collection in
    // the Appwrite console.
    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        email,
        name,
        accountId: newAccount.$id,
        avatar,
      },
      [
        Permission.read(Role.user(newAccount.$id)),
        Permission.update(Role.user(newAccount.$id)),
      ],
    );
  } catch (e: any) {
    throw new Error(e.message || "Failed to create user");
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    try {
      await account.deleteSessions();
    } catch {}

    const session = await account.createEmailPasswordSession(email, password);
    await account.get();

    return session;
  } catch (e: any) {
    throw new Error(e.message || "Failed to sign in");
  }
};

export const signOut = async () => {
  await account.deleteSession("current");
};

const CHECK_EMAIL_FUNCTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_FUNCTION_CHECK_EMAIL_ID;

// A cold Appwrite Function (nobody's called it in a while, so its
// container isn't warm) can take several seconds on its first invocation
// — well worth it for the correctness this check buys, but not worth
// making someone wait indefinitely for. Past this, just proceed as if the
// email exists rather than block the actual password reset on a slow
// cold start; the fast path (a warm function) typically answers in a few
// hundred ms and this timeout never engages.
const CHECK_EMAIL_TIMEOUT_MS = 2500;

/**
 * Whether an account with this email exists — answered by a small Appwrite
 * Function (appwrite/functions/check-email) rather than the client SDK,
 * since listing/searching users needs a privileged key that can never live
 * in the app bundle. If the function isn't deployed yet (no ID configured),
 * takes too long, or the call itself fails, this fails *open* (returns
 * true) so a real password reset is never blocked by an unrelated outage —
 * it only ever gets used to short-circuit the case where the email is
 * definitely not registered.
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  if (!CHECK_EMAIL_FUNCTION_ID) return true;

  const check = async () => {
    const execution = await functions.createExecution(
      CHECK_EMAIL_FUNCTION_ID,
      JSON.stringify({ email }),
      false,
    );
    if (execution.status !== "completed" || !execution.responseBody) {
      return true;
    }
    const result = JSON.parse(execution.responseBody);
    return result.exists !== false;
  };

  const timeout = new Promise<boolean>((resolve) =>
    setTimeout(() => resolve(true), CHECK_EMAIL_TIMEOUT_MS),
  );

  try {
    return await Promise.race([check(), timeout]);
  } catch {
    return true;
  }
};

/**
 * Emails a 6-digit one-time code and returns the userId it was sent for —
 * needed by verifyPasswordResetCode. If `email` already has an account,
 * Appwrite ignores the placeholder ID and sends the code to that account;
 * otherwise it silently creates a brand-new (passwordless) one, which is
 * why callers must gate this behind checkEmailExists.
 */
export const requestPasswordResetCode = async (
  email: string,
): Promise<string> => {
  try {
    const token = await account.createEmailToken(ID.unique(), email);
    return token.userId;
  } catch (e: any) {
    throw new Error(e.message || "Failed to send the reset code");
  }
};

// Redeems the emailed code as a real session, so completePasswordReset can
// change the password without needing the (forgotten) old one.
export const verifyPasswordResetCode = async (
  userId: string,
  code: string,
) => {
  try {
    try {
      await account.deleteSessions();
    } catch {}
    await account.createSession({ userId, secret: code });
  } catch (e: any) {
    throw new Error(e.message || "That code is invalid or has expired");
  }
};

// Must run right after verifyPasswordResetCode, while its session is still
// active — there's no old password to re-verify with here.
export const completePasswordReset = async (newPassword: string) => {
  try {
    await account.updatePassword({ password: newPassword });
  } catch (e: any) {
    throw new Error(e.message || "Failed to update password");
  }
};

// Drops the session verifyPasswordResetCode created, for when the user
// abandons the flow before actually setting a new password.
export const abandonPasswordReset = async () => {
  try {
    await account.deleteSession("current");
  } catch {
    // no active session to clean up
  }
};

// Changing the password while already signed in — no email/redirect flow
// needed, just the current session + the old password for re-verification.
export const updateUserPassword = async (
  newPassword: string,
  oldPassword: string,
) => {
  try {
    await account.updatePassword({ password: newPassword, oldPassword });
  } catch (e: any) {
    throw new Error(e.message || "Failed to update password");
  }
};

export type UploadFile = {
  uri: string;
  name: string;
  type: string;
  size: number;
};

/**
 * Uploads an image to the storage bucket and returns a public view URL.
 * Keep files under 5 MB (Appwrite's single-request limit) — the picker already
 * compresses avatars well below that.
 *
 * Why XHR and not `storage.createFile`: Expo SDK 54+ replaces the global
 * `fetch` with a winter-runtime version that can't serialise React Native's
 * `{ uri }` FormData file parts ("Unsupported FormDataPart implementation"),
 * which is exactly how the Appwrite SDK sends files. XMLHttpRequest uses the
 * native networking stack, which handles `{ uri }` parts and automatically
 * carries the Appwrite session cookie set at login.
 *
 * The `permissions[]` grants public read so `<Image>` can load the URL without
 * a session — this needs "File Security" ON for the bucket (otherwise the
 * bucket itself must grant Read to "Any").
 */
export const uploadImage = async (file: UploadFile): Promise<string> => {
  const form = new FormData();
  form.append("fileId", ID.unique());
  form.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);
  form.append("permissions[]", Permission.read(Role.any()));

  const url = `${appwriteConfig.endpoint}/storage/buckets/${appwriteConfig.bucketId}/files`;

  const responseText = await new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.withCredentials = true;
    xhr.setRequestHeader("X-Appwrite-Project", appwriteConfig.projectId);
    xhr.setRequestHeader("X-Appwrite-Response-Format", "1.8.0");
    xhr.setRequestHeader(
      "Origin",
      `appwrite-${Platform.OS}://${appwriteConfig.platform}`,
    );
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.responseText);
        return;
      }
      let message = `HTTP ${xhr.status}`;
      try {
        message = JSON.parse(xhr.responseText).message || message;
      } catch {
        // response wasn't JSON — keep the status code
      }
      reject(new Error(`Appwrite rejected the upload: ${message}`));
    };
    xhr.onerror = () =>
      reject(new Error("Network error while uploading the image."));
    xhr.send(form);
  });

  const uploaded = JSON.parse(responseText) as { $id: string };
  // getFileView now fetches the file's raw bytes (returns Promise<ArrayBuffer>)
  // in this SDK version — getFileViewURL is the one that just builds the
  // view URL synchronously, which is what we actually want to store.
  return storage
    .getFileViewURL(appwriteConfig.bucketId, uploaded.$id)
    .toString();
};

/** Same auto-generated initials avatar used at sign-up — reused to "remove"
 * a custom photo (Appwrite's avatar attribute requires a valid URL, so it
 * can't just be cleared to an empty string). */
export const getInitialsAvatarUrl = (name: string): string => {
  try {
    return avatars.getInitialsURL(name).toString();
  } catch {
    return "";
  }
};

export const getCurrentUser = async (): Promise<User | undefined> => {
  const acc = await account.get();

  const res = await databases.listDocuments<User>(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("accountId", acc.$id)],
  );

  return res.documents[0];
};

/**
 * The seed data points at Vecteezy "large_2x" previews (~3 MB each). Their
 * "small" thumbnails are the same image at ~40 KB — swap the path so lists load
 * fast without re-seeding.
 */
const optimizeImageUrl = (url: string): string =>
  url
    .replace("/system/resources/previews/", "/system/resources/thumbnails/")
    .replace(/\/large(_2x)?\//, "/small/");

const withOptimizedImage = (item: MenuItem): MenuItem => ({
  ...item,
  image_url: item.image_url ? optimizeImageUrl(item.image_url) : item.image_url,
});

export const getMenu = async ({
  category,
  query,
}: GetMenuParams): Promise<MenuItem[]> => {
  const queries = [Query.limit(100)];

  if (category) queries.push(Query.equal("categories", category));
  if (query) queries.push(Query.search("name", query));

  const res = await databases.listDocuments<MenuItem>(
    appwriteConfig.databaseId,
    appwriteConfig.menuCollectionId,
    queries,
  );

  return res.documents.map(withOptimizedImage);
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await databases.listDocuments<Category>(
    appwriteConfig.databaseId,
    appwriteConfig.categoriesCollectionId,
    [Query.limit(100)],
  );

  return res.documents;
};

export const updateUser = async ({
  userId,
  ...data
}: UpdateUserParams): Promise<User> => {
  const res = await databases.updateDocument<User>(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    userId,
    data,
  );

  return res;
};

export const getAllCustomizations = async (
  query?: string,
): Promise<Customization[]> => {
  const queries = [Query.orderAsc("name"), Query.limit(500)];

  if (query) {
    queries.push(Query.search("name", query));
  }

  const res = await databases.listDocuments<Customization>(
    appwriteConfig.databaseId,
    appwriteConfig.customizationsCollectionId,
    queries,
  );

  return res.documents;
};

export const getMenuCustomizations = async (
  menuId: string,
  query?: string,
): Promise<CustomizationOption[]> => {
  const queries = [
    Query.equal("menu", menuId),
    Query.orderAsc("customization_name"),
    Query.limit(500),
  ];

  if (query) {
    queries.push(Query.search("customization_name", query));
  }

  const res = await databases.listDocuments<MenuCustomization>(
    appwriteConfig.databaseId,
    appwriteConfig.menuCustomizationsCollectionId,
    queries,
  );

  return res.documents.map((doc) => ({
    id: doc.$id,
    name: doc.customization_name,
    // Seed data stores add-on prices in cents (e.g. 25 = $0.25).
    price: doc.customization_price / 100,
    type: doc.customization_type,
  }));
};

export const addCustomizationToMenu = async (
  menuId: string,
  customizationId: string,
): Promise<MenuCustomization> => {
  const customization = await databases.getDocument<Customization>(
    appwriteConfig.databaseId,
    appwriteConfig.customizationsCollectionId,
    customizationId,
  );

  const res = await databases.createDocument<MenuCustomization>(
    appwriteConfig.databaseId,
    appwriteConfig.menuCustomizationsCollectionId,
    ID.unique(),
    {
      menu: menuId,
      customization: {
        $id: customization.$id,
        name: customization.name,
        price: customization.price,
        type: customization.type,
      },
      customization_name: customization.name,
      customization_price: customization.price,
      customization_type: customization.type,
    },
  );

  return res;
};

export const removeCustomizationFromMenu = async (
  menuCustomizationId: string,
): Promise<void> => {
  await databases.deleteDocument(
    appwriteConfig.databaseId,
    appwriteConfig.menuCustomizationsCollectionId,
    menuCustomizationId,
  );
};

export const getMenuItemById = async (menuId: string): Promise<MenuItem> => {
  const item = await databases.getDocument<MenuItem>(
    appwriteConfig.databaseId,
    appwriteConfig.menuCollectionId,
    menuId,
  );
  return withOptimizedImage(item);
};

export const getCategoryById = async (
  categoryId: string,
): Promise<Category> => {
  return await databases.getDocument<Category>(
    appwriteConfig.databaseId,
    appwriteConfig.categoriesCollectionId,
    categoryId,
  );
};

export const createOrder = async (orderData: {
  userId: string;
  items: string;
  totalAmount: number;
  deliveryFee: number;
  discount: number;
  finalAmount: number;
  paymentIntentId: string;
  paymentStatus: string;
  orderStatus: string;
  deliveryAddress?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}) => {
  try {
    // Scope read access to the buyer alone — without this, whatever the
    // `orders` collection grants at the collection level (needed for list/
    // read to work at all for signed-in users) would let any authenticated
    // user read every order's name/email/phone/address by calling the API
    // directly, not just their own. No update/delete permission is granted
    // here on purpose: nothing in the app lets a buyer edit an order after
    // placing it, and granting it would let a client tamper with its own
    // paymentStatus/finalAmount. Requires Document Security ON for this
    // collection in the Appwrite console.
    const acc = await account.get();
    const order = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      ID.unique(),
      orderData,
      [Permission.read(Role.user(acc.$id))],
    );
    return order;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create order");
  }
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  try {
    const order = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      orderId,
    );
    return order as unknown as Order;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch order");
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const orders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ],
    );
    return orders.documents as unknown as Order[];
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch orders");
  }
};

export const getMenuItemReviews = async (
  menuItemId: string,
): Promise<Review[]> => {
  try {
    const reviews = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reviewsCollectionId,
      [
        Query.equal("menuItemId", menuItemId),
        Query.orderDesc("$createdAt"),
        Query.limit(100),
      ],
    );
    return reviews.documents as unknown as Review[];
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch reviews");
  }
};

/** Recomputes a menu item's average rating from its live reviews and writes
 * it back to the item, so cards elsewhere (home, search, bestsellers) that
 * read `item.rating` directly — rather than averaging reviews themselves —
 * stay in sync with what the details page shows. Best-effort: a menu item a
 * regular user can't update, or a transient failure, shouldn't block the
 * review action itself, so failures here are swallowed. If every review has
 * just been deleted, the item's rating is left as-is rather than reset. */
const syncMenuItemRating = async (menuItemId: string) => {
  try {
    const reviews = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reviewsCollectionId,
      [Query.equal("menuItemId", menuItemId), Query.limit(100)],
    );
    if (reviews.documents.length === 0) return;

    const average =
      reviews.documents.reduce(
        (sum, r: any) => sum + (r.rating as number),
        0,
      ) / reviews.documents.length;

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      menuItemId,
      { rating: average },
    );
  } catch {
    // Best-effort sync — the review itself already succeeded.
  }
};

/** Whether the signed-in user already reviewed this item — lets the UI
 * offer "edit your review" instead of a second, duplicate one. */
export const getMyReviewForItem = async (
  menuItemId: string,
  userId: string,
): Promise<Review | null> => {
  try {
    const result = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reviewsCollectionId,
      [
        Query.equal("menuItemId", menuItemId),
        Query.equal("userId", userId),
        Query.limit(1),
      ],
    );
    return (result.documents[0] as unknown as Review) ?? null;
  } catch {
    return null;
  }
};

/** Creates a new review, or updates the caller's existing one for the same
 * item — either way there's at most one review per user per item. New
 * documents grant the author update/delete rights on their own review
 * (the collection has Document Security on, everyone else only gets the
 * collection-level read("any")). */
export const submitReview = async (
  data: ReviewData,
  existingReviewId?: string,
): Promise<Review> => {
  try {
    if (existingReviewId) {
      // Refresh the userName/userAvatar snapshot too, not just rating/comment
      // — otherwise a review edited after a profile-picture change (or one
      // written before userAvatar existed as a column) keeps showing stale
      // or missing reviewer info forever.
      const updated = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.reviewsCollectionId,
        existingReviewId,
        {
          rating: data.rating,
          comment: data.comment,
          userName: data.userName,
          userAvatar: data.userAvatar,
        },
      );
      await syncMenuItemRating(data.menuItemId);
      return updated as unknown as Review;
    }

    // `data.userId` is the profile document ID (used for querying reviews),
    // not the Appwrite Auth account ID — Role.user() needs the latter, or
    // Appwrite rejects the permission ("Permissions must be one of...").
    const acc = await account.get();

    const created = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reviewsCollectionId,
      ID.unique(),
      data,
      [
        Permission.update(Role.user(acc.$id)),
        Permission.delete(Role.user(acc.$id)),
      ],
    );
    await syncMenuItemRating(data.menuItemId);
    return created as unknown as Review;
  } catch (error: any) {
    throw new Error(error.message || "Failed to submit review");
  }
};

export const deleteReview = async (reviewId: string, menuItemId: string) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reviewsCollectionId,
      reviewId,
    );
    await syncMenuItemRating(menuItemId);
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete review");
  }
};
