import { Image as CachedImage } from "@/components/CachedImage";
import { Dimensions, View } from "react-native";

const { width } = Dimensions.get("window");

/** Shared geometry for the "floating dish over the hero seam" detail layout. */
export const PANEL_H = 235;
const DISH = Math.round(width * 0.66);
export const SHEET_PULL = 28;
const OVERHANG = 118; // how far the dish dips past the seam into the sheet
const DISH_TOP = PANEL_H - SHEET_PULL + OVERHANG - DISH;
/** paddingTop the content sheet needs so text clears the floating dish */
export const CONTENT_PT = OVERHANG + 16;

/**
 * The dish that straddles the warm hero panel and the white sheet. Render it as
 * the LAST child of the detail ScrollView so it paints above the seam and still
 * scrolls away with the hero.
 */
const FloatingDish = ({ uri }: { uri?: string | number | null }) => (
  <View
    pointerEvents="none"
    className="absolute left-0 right-0 items-center"
    style={{ top: DISH_TOP }}
  >
    <View
      style={{
        shadowColor: "#8A5A00",
        shadowOpacity: 0.18,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 16 },
        elevation: 12,
      }}
    >
      <CachedImage
        source={
          typeof uri === "number" ? uri : uri ? { uri } : undefined
        }
        style={{ width: DISH, height: DISH }}
        contentFit="contain"
        transition={250}
        cachePolicy="memory-disk"
      />
    </View>
  </View>
);

export default FloatingDish;
