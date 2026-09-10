import { useCartStore } from "@/store/cart.store";
import {
  House,
  Search,
  ShoppingBag,
  User,
  type LucideIcon,
} from "lucide-react-native";
import { useEffect } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  Text,
  useAnimatedValue,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRIMARY = "#FE8C00";
const INACTIVE = "#9AA0A6";

const TABS: Record<string, { label: string; Icon: LucideIcon }> = {
  index: { label: "Home", Icon: House },
  search: { label: "Search", Icon: Search },
  cart: { label: "Cart", Icon: ShoppingBag },
  profile: { label: "Profile", Icon: User },
};

const MARGIN = 22;
const BAR_W = Dimensions.get("window").width - MARGIN * 2;
const BAR_H = 56;
const BUBBLE = 44;
const BUBBLE_RISE = 16; // how far the bubble pokes above the bar

/** Bottom padding a tab screen should reserve so content clears the bar. */
export const TAB_BAR_SPACE = BAR_H + BUBBLE_RISE + 24;

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (event: {
      type: "tabPress";
      target: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

const CartBadge = ({ color }: { color: string }) => {
  const count = useCartStore((s) => s.getTotalItems());
  if (count === 0) return null;
  return (
    <View
      className="absolute -right-2 -top-1 h-4 min-w-4 items-center justify-center rounded-full px-1"
      style={{ backgroundColor: color }}
    >
      <Text className="font-quicksand-bold text-[9px] text-white">
        {count > 9 ? "9+" : count}
      </Text>
    </View>
  );
};

const FloatingTabBar = ({ state, navigation }: TabBarProps) => {
  const insets = useSafeAreaInsets();
  const tabs = state.routes.filter((r) => TABS[r.name]);
  const tabW = BAR_W / tabs.length;

  const bubbleLeft = (i: number) => tabW * i + tabW / 2 - BUBBLE / 2;
  const translateX = useAnimatedValue(bubbleLeft(state.index));

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: bubbleLeft(state.index),
      useNativeDriver: true,
      damping: 16,
      stiffness: 170,
      mass: 0.9,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index, tabW]);

  const ActiveIcon = TABS[tabs[state.index]?.name]?.Icon ?? House;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: MARGIN,
        right: MARGIN,
        bottom: Math.max(insets.bottom, 10),
        height: BAR_H + BUBBLE_RISE,
      }}
    >
      {/* Bar */}
      <View
        className="absolute inset-x-0 bottom-0 flex-row rounded-full bg-white"
        style={{
          height: BAR_H,
          shadowColor: "#8A6A3A",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 18,
          elevation: 12,
        }}
      >
        {tabs.map((route, i) => {
          const { label } = TABS[route.name];
          const { Icon } = TABS[route.name];
          const focused = state.index === i;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className="flex-1 items-center justify-center"
            >
              <View className="h-5 items-center justify-center">
                {!focused && (
                  <View className="relative">
                    <Icon size={19} color={INACTIVE} strokeWidth={2} />
                    {route.name === "cart" && <CartBadge color={PRIMARY} />}
                  </View>
                )}
              </View>
              <Text
                className="mt-0.5 font-quicksand-semibold text-[10px]"
                style={{ color: focused ? PRIMARY : INACTIVE }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Floating active bubble */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: BUBBLE,
          height: BUBBLE,
          borderRadius: BUBBLE / 2,
          backgroundColor: PRIMARY,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 3.5,
          borderColor: "#FFFFFF",
          transform: [{ translateX }],
          shadowColor: PRIMARY,
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.33,
          shadowRadius: 9,
          elevation: 20,
        }}
      >
        <ActiveIcon size={19} color="#fff" strokeWidth={2.4} />
      </Animated.View>
    </View>
  );
};

export default FloatingTabBar;
