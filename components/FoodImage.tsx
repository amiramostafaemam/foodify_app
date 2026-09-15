import { Image } from "@/components/CachedImage";
import { images } from "@/constants";
import type { ImageContentFit } from "expo-image";
import { useState } from "react";

interface FoodImageProps {
  /** remote URL string, a local require() number, or nullish for the fallback */
  uri?: string | number | null;
  className?: string;
  contentFit?: ImageContentFit;
}

/**
 * Food image with memory + disk caching, a soft fade-in, and a graceful
 * fallback. Accepts a remote URL or a bundled image.
 *
 * No default background here — many callers (MenuCard's floating cutout,
 * for one) show a transparent-PNG food photo with nothing behind it, and a
 * tinted box would show through as a visible edge around it. Callers that
 * fill a solid rectangular area (PopularMealCard, order rows) add their
 * own `bg-*` in their className for a loading placeholder instead.
 */
const FoodImage = ({
  uri,
  className,
  contentFit = "contain",
}: FoodImageProps) => {
  const [failed, setFailed] = useState(false);

  if (uri == null || failed) {
    return (
      <Image
        source={images.emptyState}
        className={className}
        contentFit={contentFit}
      />
    );
  }

  return (
    <Image
      source={typeof uri === "number" ? uri : { uri }}
      className={className}
      contentFit={contentFit}
      transition={200}
      cachePolicy="memory-disk"
      onError={() => setFailed(true)}
    />
  );
};

export default FoodImage;
