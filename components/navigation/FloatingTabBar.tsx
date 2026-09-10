import { useCartStore } from "@/store/cart.store";
import {
  House,
  Search,
  ShoppingBag,
  User,
  type LucideIcon,
} from "lucide-react-native";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const PRIMARY = "#FE8C00";
const INACTIVE = "#9A9A9A";

const TABS: Record<string, { label: string; Icon: LucideIcon }> = {
  index: { label: "Home", Icon: House },
  search: { label: "Search", Icon: Search },
  cart: { label: "Cart", Icon: ShoppingBag },
  profile: { label: "Profile", Icon: User },
};

const MARGIN = 20;
const BAR_W = Dimensions.get("window").width - MARGIN * 2;
const BAR_H = 66;
const RADIUS = 26;
const PAD = 16; // space above the bar for the notch + dot
const NOTCH_W = 58;
const NOTCH_D = 9;

/** Bottom padding a tab screen should reserve so content clears the bar. */
export const TAB_BAR_SPACE = PAD + BAR_H + 28;

// Structural slice of @react-navigation's BottomTabBarProps — just what we read.
type TabBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: {
    emit: (event: {
      type: "tabPress";
      target: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};

/** Rounded bar with a smooth concave notch dipping into the top edge at `cx`. */
const buildBarPath = (cx: number) => {
  "worklet";
  const h = PAD + BAR_H;
  const half = NOTCH_W / 2;
  const l = cx - half;
  const r = cx + half;
  return (
    `M ${RADIUS} ${PAD}` +
    `L ${l} ${PAD}` +
    `C ${l + half * 0.35} ${PAD} ${cx - half * 0.55} ${PAD + NOTCH_D} ${cx} ${PAD + NOTCH_D}` +
    `C ${cx + half * 0.55} ${PAD + NOTCH_D} ${r - half * 0.35} ${PAD} ${r} ${PAD}` +
    `L ${BAR_W - RADIUS} ${PAD}` +
    `Q ${BAR_W} ${PAD} ${BAR_W} ${PAD + RADIUS}` +
    `L ${BAR_W} ${h - RADIUS}` +
    `Q ${BAR_W} ${h} ${BAR_W - RADIUS} ${h}` +
    `L ${RADIUS} ${h}` +
    `Q 0 ${h} 0 ${h - RADIUS}` +
    `L 0 ${PAD + RADIUS}` +
    `Q 0 ${PAD} ${RADIUS} ${PAD}` +
    "Z"
  );
};

const CartBadge = () => {
  const count = useCartStore((s) => s.getTotalItems());
  if (count === 0) return null;
  return (
    <View className="absolute -right-2.5 -top-1.5 h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1">
      <Text className="font-quicksand-bold text-[9px] text-white">
        {count > 9 ? "9+" : count}
      </Text>
    </View>
  );
};

const FloatingTabBar = ({ state, navigation }: TabBarProps) => {
  const insets = useSafeAreaInsets();
  const tabW = BAR_W / state.routes.length;
  const activeIndex = state.index;
  const targetCx = tabW * activeIndex + tabW / 2;

  const cx = useDerivedValue(
    () => withSpring(targetCx, { damping: 18, stiffness: 160 }),
    [targetCx],
  );

  const pathProps = useAnimatedProps(() => ({ d: buildBarPath(cx.value) }));
  const dotProps = useAnimatedProps(() => ({ cx: cx.value }));

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: MARGIN,
        right: MARGIN,
        bottom: Math.max(insets.bottom, 12),
      }}
    >
      <Svg
        width={BAR_W}
        height={PAD + BAR_H}
        style={{
          position: "absolute",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 14,
          elevation: 10,
        }}
      >
        <AnimatedPath animatedProps={pathProps} fill="#FFFFFF" />
        <AnimatedCircle
          animatedProps={dotProps}
          cy={PAD - 3}
          r={4}
          fill={PRIMARY}
        />
      </Svg>

      <View
        style={{ height: PAD + BAR_H, paddingTop: PAD }}
        className="flex-row"
      >
        {state.routes.map((route, i) => {
          const tab = TABS[route.name];
          if (!tab) return null;
          const focused = state.index === i;
          const { Icon } = tab;

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
              className="flex-1 items-center justify-center gap-1"
            >
              <View
                className="relative"
                style={{ marginTop: focused ? -4 : 0 }}
              >
                <Icon
                  size={22}
                  color={focused ? PRIMARY : INACTIVE}
                  strokeWidth={focused ? 2.4 : 2}
                />
                {route.name === "cart" && <CartBadge />}
              </View>
              <Text
                className="font-quicksand-medium text-[11px]"
                style={{ color: focused ? PRIMARY : INACTIVE }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default FloatingTabBar;
