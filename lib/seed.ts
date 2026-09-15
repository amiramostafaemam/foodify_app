import { ID, Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "./appwrite";
import dummyData from "./data";

interface Category {
  name: string;
  name_ar?: string;
  description: string;
  description_ar?: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
  name: string;
  name_ar?: string;
  description: string;
  description_ar?: string;
  image_url: string; // raw URL, not storage
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[];
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
  const list = await databases.listDocuments(
    appwriteConfig.databaseId,
    collectionId,
  );

  await Promise.all(
    list.documents.map((doc) =>
      databases.deleteDocument(
        appwriteConfig.databaseId,
        collectionId,
        doc.$id,
      ),
    ),
  );
}

async function seed(): Promise<void> {
  // 1. Clear collections
  await clearAll(appwriteConfig.categoriesCollectionId);
  await clearAll(appwriteConfig.customizationsCollectionId);
  await clearAll(appwriteConfig.menuCollectionId);
  await clearAll(appwriteConfig.menuCustomizationsCollectionId);

  // 2. Create Categories
  const categoryMap: Record<string, string> = {};
  for (const cat of data.categories) {
    const doc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId,
      ID.unique(),
      cat,
    );
    categoryMap[cat.name] = doc.$id;
  }
  console.log("✅ Categories seeded");

  // 3. Create Customizations
  const customizationMap: Record<string, string> = {};
  for (const cus of data.customizations) {
    const doc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.customizationsCollectionId,
      ID.unique(),
      {
        name: cus.name,
        price: cus.price,
        type: cus.type,
      },
    );
    customizationMap[cus.name] = doc.$id;
  }
  console.log("✅ Customizations seeded");

  // 4. Create Menu Items
  const menuMap: Record<string, string> = {};
  for (const item of data.menu) {
    const doc = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      ID.unique(),
      {
        name: item.name,
        name_ar: item.name_ar,
        description: item.description,
        description_ar: item.description_ar,
        image_url: item.image_url, // store RAW url directly
        price: item.price,
        rating: item.rating,
        calories: item.calories,
        protein: item.protein,
        categories: [categoryMap[item.category_name]],
      },
    );

    menuMap[item.name] = doc.$id;

    // 5. Create Menu_Customizations
    for (const cusName of item.customizations) {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.menuCustomizationsCollectionId,
        ID.unique(),
        {
          menu: doc.$id,
          customization: customizationMap[cusName],
        },
      );
    }
  }

  console.log("🎉 Seeding complete!");
}

/**
 * Adds/refreshes name_ar & description_ar on *existing* categories/menu
 * documents, matched by their current English name — unlike `seed()`, this
 * never deletes or recreates anything, so document IDs stay put and nothing
 * that already references them (reviews' menuItemId, a device's cached
 * favorites) gets orphaned. Safe to run any time lib/data.ts's Arabic
 * copy changes; skips any document whose name doesn't match a known entry.
 */
export async function backfillArabicNames(): Promise<void> {
  const categories = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.categoriesCollectionId,
    [Query.limit(500)],
  );
  for (const doc of categories.documents) {
    const match = data.categories.find((c) => c.name === doc.name);
    if (!match?.name_ar) continue;
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId,
      doc.$id,
      { name_ar: match.name_ar, description_ar: match.description_ar },
    );
  }
  console.log(`✅ Categories: backfilled ${categories.documents.length}`);

  const menu = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.menuCollectionId,
    [Query.limit(500)],
  );
  for (const doc of menu.documents) {
    const match = data.menu.find((m) => m.name === doc.name);
    if (!match?.name_ar) continue;
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      doc.$id,
      { name_ar: match.name_ar, description_ar: match.description_ar },
    );
  }
  console.log(`✅ Menu: backfilled ${menu.documents.length}`);
}

export default seed;
