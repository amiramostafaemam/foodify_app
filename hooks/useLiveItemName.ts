import { getOfferById } from "@/constants/offers.constants";
import { getMenuItemById } from "@/lib/appwrite";
import { useLocalize, useT } from "@/lib/i18n";
import { useEffect, useState } from "react";

/**
 * A cart/favorite/order-item row only ever stores a frozen name snapshot
 * from whenever it was added — display that as a fallback, but re-derive
 * the real name live from the current app language instead of trusting
 * it, otherwise an item added in one language stays stuck in that
 * language forever (offers have a full translation table; menu items
 * come from Appwrite, so re-fetch the live doc for name/name_ar). Shared
 * by the cart, favorites, and order-details screens so all three follow
 * the same rule.
 */
export const useLiveItemName = (id: string, fallbackName: string) => {
  const tr = useT();
  const loc = useLocalize();
  const isOffer = !!getOfferById(id);

  const [menuNames, setMenuNames] = useState<{ name: string; name_ar?: string } | null>(
    null,
  );
  useEffect(() => {
    if (isOffer) return;
    let cancelled = false;
    getMenuItemById(id)
      .then((doc) => {
        if (!cancelled) setMenuNames({ name: doc.name, name_ar: doc.name_ar });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isOffer, id]);

  if (isOffer) {
    return tr(`offerData.${id}.title` as Parameters<typeof tr>[0]);
  }
  return menuNames ? loc(menuNames.name, menuNames.name_ar) : fallbackName;
};
