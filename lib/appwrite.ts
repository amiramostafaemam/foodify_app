// lib/appwrite.ts
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
import {
  Account,
  Avatars,
  Client,
  Databases,
  Functions,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  platform: "com.amira.foodify",
  databaseId: "69481a45003716bfd6c4",
  bucketId: "69497c37000a13628bac",
  userCollectionId: "user",
  categoriesCollectionId: "categories",
  customizationsCollectionId: "customizations",
  menuCollectionId: "menu",
  menuCustomizationsCollectionId: "menu_customizations",
  ordersCollectionId: "orders",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
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

export const getCurrentUser = async (): Promise<User | undefined> => {
  const acc = await account.get();

  const res = await databases.listDocuments<User>(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("accountId", acc.$id)],
  );

  return res.documents[0];
};

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

  return res.documents;
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
    price: doc.customization_price,
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
  return await databases.getDocument<MenuItem>(
    appwriteConfig.databaseId,
    appwriteConfig.menuCollectionId,
    menuId,
  );
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
