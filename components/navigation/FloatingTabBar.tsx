import { useColors } from "@/hooks/useColors";
import { useT } from "@/lib/i18n";
import { useCartStore } from "@/store/cart.store";
import { useLanguageStore } from "@/store/language.store";
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

const TABS: Record<
  string,
  { labelKey: "tab.home" | "tab.search" | "tab.cart" | "tab.profile"; Icon: LucideIcon }
> = {
  index: { labelKey: "tab.home", Icon: House },
  search: { labelKey: "tab.search", Icon: Search },
  cart: { labelKey: "tab.cart", Icon: ShoppingBag },
  profile: { labelKey: "tab.profile", Icon: User },
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
  const c = useColors();
  const tr = useT();
  const isArabic = useLanguageStore((s) => s.language === "ar");
  const tabs = state.routes.filter((r) => TABS[r.name]);
  // Mirror the bar for Arabic — Home ends up on the right, like a real RTL
  // nav bar — driven by our own reliable language state rather than
  // I18nManager.isRTL (which needs a full app restart to change and is
  // unreliable in Expo Go, so it can't be trusted for this).
  const renderTabs = isArabic ? [...tabs].reverse() : tabs;
  const tabW = BAR_W / tabs.length;

  // Physical slot (0 = leftmost) of the currently focused tab, matching
  // whichever order renderTabs put it in.
  const visualIndex = isArabic ? tabs.length - 1 - state.index : state.index;

  const bubbleLeft = (i: number) => tabW * i + tabW / 2 - BUBBLE / 2;
  const translateX = useAnimatedValue(bubbleLeft(visualIndex));

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: bubbleLeft(visualIndex),
      useNativeDriver: true,
      damping: 16,
      stiffness: 170,
      mass: 0.9,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visualIndex, tabW]);

  const ActiveIcon = TABS[tabs[state.index]?.name]?.Icon ?? House;

  return (
    <View
      pointerEvents="box-none"
      // Force this whole subtree's *coordinate system* to stay LTR always
      // (regardless of language or the flaky I18nManager.isRTL flag) — the
      // Arabic mirror above is done ourselves by reversing renderTabs and
      // remapping the bubble's target index, so the underlying `left` /
      // translateX math must never itself flip or the two would fight.
      style={{
        position: "absolute",
        left: MARGIN,
        right: MARGIN,
        bottom: Math.max(insets.bottom, 10),
        height: BAR_H + BUBBLE_RISE,
        direction: "ltr",
      }}
    >
      {/* Bar */}
      <View
        className="absolute inset-x-0 bottom-0 flex-row rounded-full border border-line/10 bg-elevated"
        style={{
          height: BAR_H,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.14,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        {renderTabs.map((route) => {
          const { labelKey, Icon } = TABS[route.name];
          const focused = state.index === tabs.indexOf(route);

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
                {tr(labelKey)}
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
          borderColor: c.card,
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
