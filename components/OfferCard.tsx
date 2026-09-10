// components/OfferCard.tsx
import { Offer } from "@/constants/offers.constants";
import cn from "clsx";
import { router } from "expo-router";
import { Fragment } from "react";
import { Image, Pressable, Text, View } from "react-native";

interface OfferCardProps {
  offer: Offer;
  index: number;
}

const OfferCard = ({ offer, index }: OfferCardProps) => {
  const isEven = index % 2 === 0;

  const handlePress = () => {
    router.push({
      pathname: "/offer-details/[id]",
      params: { id: offer.id },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className={cn("offer-card", isEven ? "flex-row-reverse" : "flex-row")}
      style={{ backgroundColor: offer.color }}
      android_ripple={{ color: "#ffff22" }}
    >
      {({ pressed }) => (
        <Fragment>
          <View className={"h-full w-1/2"}>
            <Image
              source={offer.image}
              className="size-full "
              resizeMode={"contain"}
            />
          </View>
          <View className={cn("offer-card__info", isEven ? "pl-10" : "pr-10")}>
            <Text className="h1-bold text-white ">{offer.title}</Text>

            {/* Discount Badge */}
            <View className="self-start rounded-full bg-white/20 px-4  py-2">
              <Text className="small-bold text-white">
                {offer.discount} % OFF
              </Text>
            </View>
          </View>
        </Fragment>
      )}
    </Pressable>
  );
};

export default OfferCard;
