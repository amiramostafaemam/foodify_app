import { Models } from "react-native-appwrite";

export interface MenuItem extends Models.Document {
  name: string;
  price: number;
  image_url: string;
  description: string;
  calories: number;
  protein: number;
  rating: number;
  type: string;
  categories: Category | string;
}

export interface Category extends Models.Document {
  name: string;
  description: string;
}

export interface User extends Models.Document {
  name: string;
  email: string;
  avatar: string;
  accountId: string;
  phone?: string;
  address_home?: string;
  address_work?: string;
}

export interface CartCustomization {
  id: string;
  name: string;
  price: number;
  type: string;
}

export interface CartItemType {
  cartItemId: string; // ⭐ Unique ID لكل cart item
  id: string; // menu item id
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  customizations?: CartCustomization[];
}

export interface CartStore {
  items: CartItemType[];
  addItem: (item: Omit<CartItemType, "quantity">) => void;
  removeItem: (cartItemId: string) => void;
  increaseQty: (cartItemId: string) => void;
  decreaseQty: (cartItemId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

interface TabBarIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}

interface PaymentInfoStripeProps {
  label: string;
  value: string;
  labelStyle?: string;
  valueStyle?: string;
}

interface CustomButtonProps {
  onPress?: () => void;
  title?: string;
  style?: string;
  leftIcon?: React.ReactNode;
  textStyle?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

interface CustomHeaderProps {
  title?: string;
  style?: string;
}

interface CustomInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

interface ProfileFieldProps {
  label: string;
  value: string;
  icon: ImageSourcePropType;
}

interface CreateUserParams {
  email: string;
  password: string;
  name: string;
}

interface SignInParams {
  email: string;
  password: string;
}

export interface GetMenuParams {
  category?: string;
  query?: string;
  limit?: number;
  [key: string]: string | number | undefined;
}

export type GetMenuParamsStrict = {
  [K in keyof GetMenuParams]: Exclude<GetMenuParams[K], undefined>;
};

export interface UpdateUserParams {
  userId: string;
  name?: string;
  phone?: string;
  address_home?: string;
  address_work?: string;
  avatar?: string;
}

export interface Customization extends Models.Document {
  name: string;
  price: number;
  type: "topping" | "side";
  menu: string;
  customization: string;
}

export interface MenuCustomization extends Models.Document {
  menu: string;
  customization: {
    $id: string;
    name: string;
    price: number;
    type: "topping" | "side";
  };
  customization_name: string;
  customization_price: number;
  customization_type: "topping" | "side";
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  type: "topping" | "side";
}

export type PaymentMethod = "card" | "cash";

export interface OrderData {
  userId: string;
  items: string; // JSON stringified cart items
  totalAmount: number;
  deliveryFee: number;
  discount: number;
  finalAmount: number;
  paymentIntentId: string;
  paymentStatus: "pending" | "succeeded" | "failed" | "cash_on_delivery";
  orderStatus:
    | "pending"
    | "confirmed"
    | "preparing"
    | "on_the_way"
    | "delivered"
    | "cancelled";
  deliveryAddress?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}
