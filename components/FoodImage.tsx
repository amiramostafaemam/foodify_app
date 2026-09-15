import { Image } from "@/components/CachedImage";
import { images } from "@/constants";
import cn from "clsx";
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
 * Always carries a faint tinted background (not just the callers that
 * happened to add one) so a remote image that hasn't loaded yet — the
 * first time it's ever seen, before it's disk-cached — reads as "loading"
 * rather than a blank/empty gap while its request is in flight.
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
        className={cn("bg-primary/5", className)}
        contentFit={contentFit}
      />
    );
  }

  return (
    <Image
      source={typeof uri === "number" ? uri : { uri }}
      className={cn("bg-primary/5", className)}
      contentFit={contentFit}
      transition={200}
      cachePolicy="memory-disk"
      onError={() => setFailed(true)}
    />
  );
};

export default FoodImage;
