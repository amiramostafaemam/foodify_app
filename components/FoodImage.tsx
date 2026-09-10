import { Image } from "@/components/CachedImage";
import { images } from "@/constants";
import type { ImageContentFit } from "expo-image";
import { useState } from "react";

interface FoodImageProps {
  uri?: string | null;
  className?: string;
  contentFit?: ImageContentFit;
}

/**
 * Remote food image with memory + disk caching, a soft fade-in, and a graceful
 * fallback. expo-image keeps decoded frames warm, so lists stop flashing while
 * scrolling.
 */
const FoodImage = ({
  uri,
  className,
  contentFit = "contain",
}: FoodImageProps) => {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
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
      source={{ uri }}
      className={className}
      contentFit={contentFit}
      transition={200}
      cachePolicy="memory-disk"
      onError={() => setFailed(true)}
    />
  );
};

export default FoodImage;
