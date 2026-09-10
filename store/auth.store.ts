import {
  account,
  signIn as appwriteSignIn,
  signOut as appwriteSignOut,
  updateUser as appwriteUpdateUser,
  getCurrentUser,
} from "@/lib/appwrite";
import { User } from "@/type";
import { create } from "zustand";

type UpdateProfileData = {
  name?: string;
  phone?: string;
  address_home?: string;
  address_work?: string;
  avatar?: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<User>;
  completeLogin: (user: User) => void;
  logout: () => Promise<void>;
  fetchAuthenticatedUser: () => Promise<void>;
  updateUserProfile: (data: UpdateProfileData) => Promise<User>;
};

const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  // Signs in and returns the user without flipping auth state yet, so the
  // caller can show a success screen before navigating into the app.
  login: async (email, password) => {
    const session = await appwriteSignIn({ email, password });
    if (!session) throw new Error("Failed to create session");

    const user = await getCurrentUser();
    if (!user) throw new Error("Failed to get user data");

    return user;
  },

  completeLogin: (user) => {
    set({ isAuthenticated: true, user, isLoading: false });
  },

  logout: async () => {
    try {
      await appwriteSignOut();
    } finally {
      set({ isAuthenticated: false, user: null });
    }
  },

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();
      set(
        user
          ? { isAuthenticated: true, user }
          : { isAuthenticated: false, user: null },
      );
    } catch {
      try {
        await account.deleteSession("current");
      } catch {
        // no active session to clean up
      }
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserProfile: async (data) => {
    const { user } = get();
    if (!user?.$id) throw new Error("User not found");

    const updatedUser = await appwriteUpdateUser({ userId: user.$id, ...data });
    set({ user: updatedUser });
    return updatedUser;
  },
}));

export default useAuthStore;
