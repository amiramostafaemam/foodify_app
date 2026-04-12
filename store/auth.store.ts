// // // store/auth.store.ts
// // import {
// //   account,
// //   signIn as appwriteSignIn,
// //   signOut as appwriteSignOut,
// //   updateUser as appwriteUpdateUser,
// //   getCurrentUser,
// // } from "@/lib/appwrite";
// // import { User } from "@/type";
// // import { create } from "zustand";

// // type AuthState = {
// //   isAuthenticated: boolean;
// //   user: User | null;
// //   isLoading: boolean;

// //   setIsAuthenticated: (value: boolean) => void;
// //   setUser: (user: User | null) => void;
// //   setLoading: (loading: boolean) => void;

// //   login: (email: string, password: string) => Promise<void>;
// //   logout: () => Promise<void>;
// //   fetchAuthenticatedUser: () => Promise<void>;
// //   updateUserProfile: (data: {
// //     name?: string;
// //     phone?: string;
// //     address_home?: string;
// //     address_work?: string;
// //     avatar?: string;
// //   }) => Promise<User>;
// // };

// // const useAuthStore = create<AuthState>((set, get) => ({
// //   isAuthenticated: false,
// //   user: null,
// //   isLoading: true,

// //   setIsAuthenticated: (value) => set({ isAuthenticated: value }),
// //   setUser: (user) => set({ user }),
// //   setLoading: (loading) => set({ isLoading: loading }),

// //   login: async (email: string, password: string) => {
// //     set({ isLoading: true });
// //     try {
// //       const session = await appwriteSignIn({ email, password });

// //       if (!session) {
// //         throw new Error("Failed to create session");
// //       }

// //       const user = await getCurrentUser();

// //       if (user) {
// //         set({
// //           isAuthenticated: true,
// //           user,
// //           isLoading: false,
// //         });
// //       } else {
// //         throw new Error("Failed to get user data");
// //       }
// //     } catch (error: any) {
// //       console.log("Login error:", error);
// //       set({ isAuthenticated: false, user: null, isLoading: false });
// //       throw error;
// //     }
// //   },

// //   logout: async () => {
// //     try {
// //       await appwriteSignOut();
// //       set({ isAuthenticated: false, user: null });
// //     } catch (error) {
// //       console.log("Logout error:", error);
// //       set({ isAuthenticated: false, user: null });
// //     }
// //   },

// //   fetchAuthenticatedUser: async () => {
// //     set({ isLoading: true });

// //     try {
// //       const user = await getCurrentUser();
// //       if (user) {
// //         set({ isAuthenticated: true, user });
// //       } else {
// //         set({ isAuthenticated: false, user: null });
// //       }
// //     } catch (error) {
// //       console.log("Fetch user error:", error);
// //       try {
// //         await account.deleteSession("current");
// //       } catch (e) {
// //         console.log("Session cleanup error");
// //       }
// //       set({ user: null, isAuthenticated: false });
// //     } finally {
// //       set({ isLoading: false });
// //     }
// //   },

// //   updateUserProfile: async (data) => {
// //     const { user } = get();

// //     if (!user?.$id) {
// //       throw new Error("User not found");
// //     }

// //     try {
// //       const updatedUser = await appwriteUpdateUser({
// //         userId: user.$id,
// //         ...data,
// //       });

// //       set({ user: updatedUser });

// //       return updatedUser;
// //     } catch (error: any) {
// //       console.log("Update profile error:", error);
// //       throw error;
// //     }
// //   },
// // }));

// // export default useAuthStore;
// import {
//   account,
//   signIn as appwriteSignIn,
//   signOut as appwriteSignOut,
//   updateUser as appwriteUpdateUser,
//   getCurrentUser,
// } from "@/lib/appwrite";
// import { User } from "@/type";
// import { create } from "zustand";

// type AuthState = {
//   isAuthenticated: boolean;
//   user: User | null;
//   isLoading: boolean;

//   setIsAuthenticated: (value: boolean) => void;
//   setUser: (user: User | null) => void;
//   setLoading: (loading: boolean) => void;

//   login: (email: string, password: string) => Promise<User>;
//   logout: () => Promise<void>;
//   fetchAuthenticatedUser: () => Promise<void>;
//   updateUserProfile: (data: {
//     name?: string;
//     phone?: string;
//     address_home?: string;
//     address_work?: string;
//     avatar?: string;
//   }) => Promise<User>;
//   completeLogin: (user: User) => void; // ✅ أضفنا الـ type هنا
// };

// const useAuthStore = create<AuthState>((set, get) => ({
//   isAuthenticated: false,
//   user: null,
//   isLoading: true,

//   setIsAuthenticated: (value) => set({ isAuthenticated: value }),
//   setUser: (user) => set({ user }),
//   setLoading: (loading) => set({ isLoading: loading }),

//   login: async (email: string, password: string) => {
//     set({ isLoading: true });
//     try {
//       const session = await appwriteSignIn({ email, password });

//       if (!session) {
//         throw new Error("Failed to create session");
//       }

//       const user = await getCurrentUser();

//       if (!user) {
//         throw new Error("Failed to get user data");
//       }

//       // ✅ بنرجع الـ user بس من غير ما نحدث الـ state
//       set({ isLoading: false });
//       return user;
//     } catch (error: any) {
//       console.log("Login error:", error);
//       set({ isLoading: false });
//       throw error;
//     }
//   },

//   // ✅ دالة جديدة لتحديث الـ authentication state بعد عرض الـ success
//   completeLogin: (user: User) => {
//     set({
//       isAuthenticated: true,
//       user,
//     });
//   },

//   logout: async () => {
//     try {
//       await appwriteSignOut();
//       set({ isAuthenticated: false, user: null });
//     } catch (error) {
//       console.log("Logout error:", error);
//       set({ isAuthenticated: false, user: null });
//     }
//   },

//   fetchAuthenticatedUser: async () => {
//     set({ isLoading: true });

//     try {
//       const user = await getCurrentUser();
//       if (user) {
//         set({ isAuthenticated: true, user });
//       } else {
//         set({ isAuthenticated: false, user: null });
//       }
//     } catch (error) {
//       console.log("Fetch user error:", error);
//       try {
//         await account.deleteSession("current");
//       } catch (e) {
//         console.log("Session cleanup error");
//       }
//       set({ user: null, isAuthenticated: false });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   updateUserProfile: async (data) => {
//     const { user } = get();

//     if (!user?.$id) {
//       throw new Error("User not found");
//     }

//     try {
//       const updatedUser = await appwriteUpdateUser({
//         userId: user.$id,
//         ...data,
//       });

//       set({ user: updatedUser });

//       return updatedUser;
//     } catch (error: any) {
//       console.log("Update profile error:", error);
//       throw error;
//     }
//   },
// }));

// export default useAuthStore;
import {
  account,
  signIn as appwriteSignIn,
  signOut as appwriteSignOut,
  updateUser as appwriteUpdateUser,
  getCurrentUser,
} from "@/lib/appwrite";
import { User } from "@/type";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  login: (email: string, password: string) => Promise<User>;
  completeLogin: (user: User) => void;
  logout: () => Promise<void>;
  fetchAuthenticatedUser: () => Promise<void>;
  updateUserProfile: (data: {
    name?: string;
    phone?: string;
    address_home?: string;
    address_work?: string;
    avatar?: string;
  }) => Promise<User>;
};

const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),

  login: async (email: string, password: string) => {
    try {
      const session = await appwriteSignIn({ email, password });

      if (!session) {
        throw new Error("Failed to create session");
      }

      const user = await getCurrentUser();

      if (!user) {
        throw new Error("Failed to get user data");
      }

      // ✅ بنرجع الـ user بس من غير ما نحدث الـ state
      return user;
    } catch (error: any) {
      console.log("Login error:", error);
      throw error;
    }
  },

  // ✅ دالة جديدة لتحديث الـ authentication state بعد عرض الـ success
  completeLogin: (user: User) => {
    set({
      isAuthenticated: true,
      user,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      await appwriteSignOut();
      set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.log("Logout error:", error);
      set({ isAuthenticated: false, user: null });
    }
  },

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });

    try {
      const user = await getCurrentUser();
      if (user) {
        set({ isAuthenticated: true, user });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      console.log("Fetch user error:", error);
      try {
        await account.deleteSession("current");
      } catch (e) {
        console.log("Session cleanup error");
      }
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserProfile: async (data) => {
    const { user } = get();

    if (!user?.$id) {
      throw new Error("User not found");
    }

    try {
      const updatedUser = await appwriteUpdateUser({
        userId: user.$id,
        ...data,
      });

      set({ user: updatedUser });

      return updatedUser;
    } catch (error: any) {
      console.log("Update profile error:", error);
      throw error;
    }
  },
}));

export default useAuthStore;
