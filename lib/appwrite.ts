import {
  Category,
  CreateUserParams,
  Customization,
  CustomizationOption,
  GetMenuParams,
  MenuCustomization,
  MenuItem,
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
  return storage
    .getFileView(appwriteConfig.bucketId, uploaded.$id)
    .toString();
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
    const order = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      ID.unique(),
      orderData,
    );
    return order;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create order");
  }
};

export const getUserOrders = async (userId: string) => {
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
    return orders.documents;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch orders");
  }
};
