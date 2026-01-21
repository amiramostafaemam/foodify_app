import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { TabBarIconProps } from "@/type";
import cn from "clsx";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
  <View className="tab-icon">
    <Image
      source={icon}
      className="size-7"
      resizeMode="contain"
      tintColor={focused ? "#FE8C00" : "#5D5F6D"}
    />
    <Text
      className={cn(
        "text-xs font-bold",
        focused ? "text-primary" : "text-gray-200"
      )}
    >
      {title}
    </Text>
  </View>
);

// Cart Tab Icon مع Badge
const CartTabIcon = ({ focused }: { focused: boolean }) => {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <View className="tab-icon">
      <View className="relative">
        <Image
          source={images.bag}
          className="size-7"
          resizeMode="contain"
          tintColor={focused ? "#FE8C00" : "#5D5F6D"}
        />
        {totalItems > 0 && (
          <View className="cart-badge -right-2 -top-2">
            <Text className="small-bold text-white">{totalItems}</Text>
          </View>
        )}
      </View>
      <Text
        className={cn(
          "text-xs font-bold",
          focused ? "text-primary" : "text-gray-200"
        )}
      >
        Cart
      </Text>
    </View>
  );
};

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          marginHorizontal: 20,
          height: 80,
          position: "absolute",
          bottom: 40,
          backgroundColor: "white",
          shadowColor: "#1a1a1a",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={images.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={images.search} title="Search" />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => <CartTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              icon={images.person}
              title="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
}
