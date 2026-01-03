import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[]; // list of customization names
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  const list = await databases.listDocuments(
    appwriteConfig.databaseId,
    collectionId
  );

  await Promise.all(
    list.documents.map((doc) =>
      databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
    )
  );
}

async function clearStorage(): Promise<void> {
  const list = await storage.listFiles(appwriteConfig.bucketId);

  await Promise.all(
    list.files.map((file) =>
      storage.deleteFile(appwriteConfig.bucketId, file.$id)
    )
  );
}

async function uploadImageToStorage(imageUrl: string): Promise<string> {
  try {
    console.log(`[seed] Fetching image from: ${imageUrl}`);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const blob = await response.blob();

    const fileName = imageUrl.split("/").pop() || `file-${Date.now()}.jpg`;
    const fileObj = {
      name: fileName,
      type: blob.type || "image/jpeg",
      size: blob.size,
      uri: imageUrl,
    };

    console.log(`[seed] Uploading image: ${fileName} (${blob.size} bytes)`);
    const file = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      fileObj
    );

    const fileUrl = storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
    const fileUrlString = fileUrl.toString();
    console.log(`[seed] ✓ Image uploaded successfully: ${fileUrlString}`);
    return fileUrlString;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[seed] ✗ Failed to upload image ${imageUrl}:`, errorMessage);
    // Re-throw to let the caller handle it
    throw new Error(`Image upload failed for ${imageUrl}: ${errorMessage}`);
  }
}

async function seed(): Promise<void> {
  try {
    console.log("[seed] Starting database seeding...");

    // 1. Clear all
    console.log("[seed] Step 1: Clearing existing data...");
    await clearAll(appwriteConfig.categoriesCollectionId);
    console.log("[seed] ✓ Cleared categories");
    await clearAll(appwriteConfig.customizationsCollectionId);
    console.log("[seed] ✓ Cleared customizations");
    await clearAll(appwriteConfig.menuCollectionId);
    console.log("[seed] ✓ Cleared menu items");
    await clearAll(appwriteConfig.menuCustomizationsCollectionId);
    console.log("[seed] ✓ Cleared menu customizations");
    await clearStorage();
    console.log("[seed] ✓ Cleared storage");

    // 2. Create Categories
    console.log(
      `[seed] Step 2: Creating ${data.categories.length} categories...`
    );
    const categoryMap: Record<string, string> = {};
    for (let i = 0; i < data.categories.length; i++) {
      const cat = data.categories[i];
      try {
        const doc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.categoriesCollectionId,
          ID.unique(),
          cat
        );
        categoryMap[cat.name] = doc.$id;
        console.log(
          `[seed] ✓ Created category ${i + 1}/${data.categories.length}: ${cat.name}`
        );
      } catch (error) {
        console.error(`[seed] ✗ Failed to create category ${cat.name}:`, error);
        throw error;
      }
    }

    // 3. Create Customizations
    console.log(
      `[seed] Step 3: Creating ${data.customizations.length} customizations...`
    );
    const customizationMap: Record<string, string> = {};
    for (let i = 0; i < data.customizations.length; i++) {
      const cus = data.customizations[i];
      try {
        const doc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.customizationsCollectionId,
          ID.unique(),
          {
            name: cus.name,
            price: cus.price,
            type: cus.type,
          }
        );
        customizationMap[cus.name] = doc.$id;
        console.log(
          `[seed] ✓ Created customization ${i + 1}/${data.customizations.length}: ${cus.name}`
        );
      } catch (error) {
        console.error(
          `[seed] ✗ Failed to create customization ${cus.name}:`,
          error
        );
        throw error;
      }
    }

    // 4. Create Menu Items
    console.log(`[seed] Step 4: Creating ${data.menu.length} menu items...`);
    const menuMap: Record<string, string> = {};
    for (let i = 0; i < data.menu.length; i++) {
      const item = data.menu[i];
      try {
        console.log(
          `[seed] Processing menu item ${i + 1}/${data.menu.length}: ${item.name}`
        );

        // Upload image
        console.log(`[seed] Uploading image for ${item.name}...`);
        const uploadedImage = await uploadImageToStorage(item.image_url);
        console.log(`[seed] ✓ Image uploaded for ${item.name}`);

        // Get category ID
        const categoryId = categoryMap[item.category_name];
        if (!categoryId) {
          throw new Error(
            `Category "${item.category_name}" not found in categoryMap`
          );
        }

        // Create menu item
        const doc = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.menuCollectionId,
          ID.unique(),
          {
            name: item.name,
            description: item.description,
            image_url: uploadedImage,
            price: item.price,
            rating: item.rating,
            calories: item.calories,
            protein: item.protein,
            categories: categoryId,
          }
        );

        menuMap[item.name] = doc.$id;
        console.log(
          `[seed] ✓ Created menu item ${i + 1}/${data.menu.length}: ${item.name}`
        );

        // 5. Create menu_customizations
        console.log(`[seed] Creating customizations for ${item.name}...`);
        for (const cusName of item.customizations) {
          const customizationId = customizationMap[cusName];
          if (!customizationId) {
            console.warn(
              `[seed] Warning: Customization "${cusName}" not found for ${item.name}`
            );
            continue;
          }
          try {
            await databases.createDocument(
              appwriteConfig.databaseId,
              appwriteConfig.menuCustomizationsCollectionId,
              ID.unique(),
              {
                menu: doc.$id,
                customizations: customizationId,
              }
            );
          } catch (error) {
            console.error(
              `[seed] ✗ Failed to create menu customization ${cusName} for ${item.name}:`,
              error
            );
            // Don't throw here, continue with other customizations
          }
        }
        console.log(`[seed] ✓ Created customizations for ${item.name}`);
      } catch (error) {
        console.error(
          `[seed] ✗ Failed to create menu item ${item.name}:`,
          error
        );
        throw error;
      }
    }

    console.log("[seed] ✅ Seeding complete successfully!");
    console.log(
      `[seed] Summary: ${data.categories.length} categories, ${data.customizations.length} customizations, ${data.menu.length} menu items`
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[seed] ❌ Seeding failed:", errorMessage);
    console.error("[seed] Full error:", error);
    throw new Error(`Failed to seed database: ${errorMessage}`);
  }
}

export default seed;
