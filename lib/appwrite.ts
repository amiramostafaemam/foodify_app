import { CreateUserParams, SignInParams, User } from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
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
 
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);

export const storage = new Storage(client);

const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) {
      throw new Error("Failed to create user account");
    }
    await signIn({ email, password });

    const avatarUrl = await avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(), //generate a unique ID for the document
      {
        accountId: newAccount.$id,
        name,
        email,
        avatar: avatarUrl,
      }
    );
  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCuurentUser = async (): Promise<User | undefined> => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw new Error("No user is currently logged in");
    }

    const currentUser = await databases.listDocuments<User>(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", [currentAccount.$id])]
    );

    if (!currentUser || currentUser.documents.length === 0) {
      return undefined;
    }

    return currentUser.documents[0] as User;
  } catch (error) {
    throw new Error(error as string);
  }
};
