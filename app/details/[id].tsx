import AppModal from "@/components/AppModal";
import { Image as CachedImage } from "@/components/CachedImage";
import DetailHero from "@/components/DetailHero";
import FloatingDish, {
  CONTENT_PT,
  PANEL_H,
  SHEET_PULL,
} from "@/components/FloatingDish";
import ReviewModal from "@/components/ReviewModal";
import StarRating from "@/components/StarRating";
import Toast from "@/components/Toast";
import { getCustomizationImage } from "@/constants";
import {
  deleteReview,
  getMenuCustomizations,
  getMenuItemById,
  getMenuItemReviews,
  getMyReviewForItem,
  submitReview,
} from "@/lib/appwrite";
import { useLocalize, useLocalizeCustomization, useT } from "@/lib/i18n";
import useAppwrite from "@/lib/useAppwrite";
import useAuthStore from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import {
  CartCustomization,
  CustomizationOption,
  MenuItem,
  Review,
} from "@/type";
import cn from "clsx";
import { router, useLocalSearchParams } from "expo-router";
import {
  Check,
  Clock,
  Dumbbell,
  Flame,
  LogIn,
  Minus,
  Pencil,
  Plus,
  ShoppingBag,
  Star,
  Trash2,
  type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const fetchMenuItem = ({ menuId }: { menuId: string }) =>
  getMenuItemById(menuId);
const fetchCustomizations = ({ menuId }: { menuId: string }) =>
  getMenuCustomizations(menuId);
const fetchReviews = ({ menuId }: { menuId: string }) =>
  getMenuItemReviews(menuId);
const fetchMyReview = ({ menuId, userId }: { menuId: string; userId: string }) =>
  getMyReviewForItem(menuId, userId);

const categoryName = (item: MenuItem, loc: (en: string, ar?: string | null) => string) =>
  typeof item.categories === "object" && item.categories
    ? loc(item.categories.name, item.categories.name_ar)
    : "";

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <View className="flex-1 items-center rounded-2xl bg-primary/5 py-3.5">
    <Icon size={17} color="#FE8C00" />
    <Text className="mt-1.5 font-quicksand-bold text-sm text-content">
      {value}
    </Text>
    <Text className="font-quicksand-medium text-[11px] text-muted">
      {label}
    </Text>
  </View>
);

const AddonCard = ({
  option,
  selected,
  onToggle,
}: {
  option: CustomizationOption;
  selected: boolean;
  onToggle: () => void;
}) => {
  const image = getCustomizationImage(option.name);
  const locName = useLocalizeCustomization();
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.85}
      className={cn(
        "w-[116px] rounded-[20px] p-3",
        selected ? "bg-primary/10" : "bg-surface",
      )}
    >
      <View className="items-center">
        <View className="relative h-16 w-16 items-center justify-center">
          {image ? (
            <CachedImage
              source={image}
              className="h-16 w-16"
              contentFit="contain"
            />
          ) : (
            <View className="h-12 w-12 rounded-full bg-primary/10" />
          )}
          {selected ? (
            <View className="absolute -right-1.5 -top-1.5 h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-primary">
              <Check size={11} color="#fff" strokeWidth={3.5} />
            </View>
          ) : null}
        </View>
      </View>
      <Text
        className="mt-2.5 text-center font-quicksand-semibold text-[13px] text-content"
        numberOfLines={1}
      >
        {locName(option.name)}
      </Text>
      <Text className="mt-0.5 text-center font-quicksand-bold text-xs text-primary">
        +${option.price.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
};

const AddonRow = ({
  title,
  data,
  isSelected,
  onToggle,
}: {
  title: string;
  data: CustomizationOption[];
  isSelected: (id: string) => boolean;
  onToggle: (o: CustomizationOption) => void;
}) => (
  <View className="mt-7">
    <Text className="h3-bold mb-3 text-content">{title}</Text>
    <FlatList
      data={data}
      horizontal
      keyExtractor={(o) => o.id}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="w-3" />}
      renderItem={({ item }) => (
        <AddonCard
          option={item}
          selected={isSelected(item.id)}
          onToggle={() => onToggle(item)}
        />
      )}
    />
  </View>
);

const ReviewRow = ({
  review,
  isMine,
  onEdit,
  onDelete,
}: {
  review: Review;
  isMine: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <View className="rounded-2xl bg-surface p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="paragraph-semibold text-content">
            {review.userName}
          </Text>
          <View className="mt-1 flex-row items-center gap-2">
            <StarRating rating={review.rating} size={13} />
            <Text className="body-regular text-muted">
              {new Date(review.$createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        {isMine ? (
          <View className="flex-row gap-3">
            <TouchableOpacity onPress={onEdit} hitSlop={8}>
              <Pencil size={16} color="#9AA0A6" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete} hitSlop={8}>
              <Trash2 size={16} color="#F14141" />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      {review.comment ? (
        <Text className="paragraph-medium mt-2.5 leading-[1.6] text-content">
          {review.comment}
        </Text>
      ) : null}
    </View>
  );
};

const Details = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);
  const tr = useT();
  const loc = useLocalize();

  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<CartCustomization[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [isFirstItem, setIsFirstItem] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const { data: item, loading } = useAppwrite<MenuItem, { menuId: string }>({
    fn: fetchMenuItem,
    params: { menuId: id! },
  });
  const { data: customizations } = useAppwrite<
    CustomizationOption[],
    { menuId: string }
  >({ fn: fetchCustomizations, params: { menuId: id! } });
  const { data: reviews, refetch: refetchReviews } = useAppwrite<
    Review[],
    { menuId: string }
  >({ fn: fetchReviews, params: { menuId: id! } });
  const { data: myReview, refetch: refetchMyReview } = useAppwrite<
    Review | null,
    { menuId: string; userId: string }
  >({
    fn: fetchMyReview,
    params: { menuId: id!, userId: user?.$id ?? "" },
    skip: !user,
  });

  if (loading || !item) {
    return (
      <SafeAreaView className="flex-center h-full bg-canvas">
        <ActivityIndicator size="large" color="#FE8C00" />
      </SafeAreaView>
    );
  }

  const toppings = customizations?.filter((c) => c.type === "topping") ?? [];
  const sides = customizations?.filter((c) => c.type === "side") ?? [];
  const name = loc(item.name, item.name_ar);
  const description = loc(item.description, item.description_ar);
  const reviewCount = reviews?.length ?? 0;
  const avgRating =
    reviewCount > 0
      ? reviews!.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : (item.rating ?? 4.5);

  const openReviewModal = () => {
    if (!user) {
      setShowSignInPrompt(true);
      return;
    }
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!user) return;
    setSubmittingReview(true);
    try {
      await submitReview(
        {
          menuItemId: item.$id,
          userId: user.$id,
          userName: user.name,
          rating,
          comment,
        },
        myReview?.$id,
      );
      setShowReviewModal(false);
      await Promise.all([refetchReviews(), refetchMyReview()]);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!myReview) return;
    setShowDeleteConfirm(false);
    await deleteReview(myReview.$id);
    await Promise.all([refetchReviews(), refetchMyReview()]);
  };

  const isSelected = (cid: string) => selected.some((c) => c.id === cid);
  const toggle = (o: CustomizationOption) =>
    setSelected((prev) =>
      prev.some((c) => c.id === o.id)
        ? prev.filter((c) => c.id !== o.id)
        : [
            // Store the raw (English) name, not localized — it needs to be
            // re-translated at display time so it still follows the
            // language if it changes after this item is in the cart.
            ...prev,
            { id: o.id, name: o.name, price: o.price, type: o.type },
          ],
    );

  const extras = selected.reduce((sum, c) => sum + c.price, 0);
  const total = (item.price + extras) * quantity;

  const handleAddToCart = () => {
    const isCartEmpty = useCartStore.getState().items.length === 0;
    addItem(
      {
        id: item.$id,
        name,
        price: item.price,
        image_url: item.image_url,
        customizations: selected,
      },
      quantity,
    );
    setIsFirstItem(isCartEmpty);
    setShowToast(true);
  };

  return (
    <>
      <View className="flex-1 bg-canvas">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
        >
          <DetailHero
            mode="product"
            height={PANEL_H}
            favorite={{
              id: item.$id,
              kind: "menu",
              name,
              image: item.image_url,
              price: item.price,
            }}
          />

          <View
            className="rounded-t-[30px] bg-card px-5"
            style={{ marginTop: -SHEET_PULL, paddingTop: CONTENT_PT }}
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="h1-bold text-content">{name}</Text>
                {categoryName(item, loc) ? (
                  <Text className="body-medium mt-0.5 text-muted">
                    {categoryName(item, loc)}
                  </Text>
                ) : null}
              </View>
              <View className="flex-row items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1">
                <Star size={13} color="#FFC738" fill="#FFC738" />
                <Text className="font-quicksand-bold text-xs text-content">
                  {avgRating.toFixed(1)}
                </Text>
              </View>
            </View>

            <Text className="h2-bold mt-2 text-primary">
              ${item.price.toFixed(2)}
            </Text>

            <View className="mt-4 flex-row gap-2.5">
              <StatCard
                icon={Flame}
                label={tr("details.calories")}
                value={`${item.calories}`}
              />
              <StatCard
                icon={Dumbbell}
                label={tr("details.protein")}
                value={`${item.protein}g`}
              />
              <StatCard
                icon={Clock}
                label={tr("common.delivery")}
                value={tr("details.deliveryTime")}
              />
            </View>

            <Text className="h3-bold mt-7 text-content">
              {tr("details.aboutMeal")}
            </Text>
            <Text className="paragraph-medium mt-2 leading-[1.7] text-muted">
              {description || tr("details.defaultDesc")}
            </Text>

            {toppings.length > 0 && (
              <AddonRow
                title={tr("details.addToppings")}
                data={toppings}
                isSelected={isSelected}
                onToggle={toggle}
              />
            )}
            {sides.length > 0 && (
              <AddonRow
                title={tr("details.addSides")}
                data={sides}
                isSelected={isSelected}
                onToggle={toggle}
              />
            )}

            <View className="mt-7">
              <View className="flex-row items-center justify-between">
                <Text className="h3-bold text-content">
                  {reviewCount > 0
                    ? tr("details.reviewsN", { n: reviewCount })
                    : tr("details.reviews")}
                </Text>
                {!myReview ? (
                  <TouchableOpacity onPress={openReviewModal} hitSlop={8}>
                    <Text className="paragraph-bold text-primary">
                      {tr("details.writeReview")}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {reviewCount === 0 ? (
                <View className="mt-3 items-center rounded-2xl bg-surface px-5 py-8">
                  <Text className="paragraph-semibold text-content">
                    {tr("details.noReviews")}
                  </Text>
                  <Text className="body-regular mt-1 text-center text-muted">
                    {tr("details.noReviewsHint")}
                  </Text>
                </View>
              ) : (
                <View className="mt-3 gap-2.5">
                  {reviews!.map((r) => (
                    <ReviewRow
                      key={r.$id}
                      review={r}
                      isMine={r.$id === myReview?.$id}
                      onEdit={() => setShowReviewModal(true)}
                      onDelete={() => setShowDeleteConfirm(true)}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>

          <FloatingDish uri={item.image_url} />
        </ScrollView>

        {/* Sticky bottom bar */}
        <View
          className="absolute inset-x-0 bottom-0 bg-elevated px-5 pt-3"
          style={{
            paddingBottom: Math.max(insets.bottom, 14) + 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.07,
            shadowRadius: 12,
            elevation: 16,
          }}
        >
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-3 rounded-full bg-primary/5 px-3 py-2.5">
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                hitSlop={6}
              >
                <Minus size={16} color="#FE8C00" strokeWidth={2.5} />
              </TouchableOpacity>
              <Text className="w-4 text-center font-quicksand-bold text-base text-content">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity((q) => q + 1)}
                hitSlop={6}
              >
                <Plus size={16} color="#FE8C00" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleAddToCart}
              activeOpacity={0.9}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-primary py-4"
            >
              <ShoppingBag size={17} color="#fff" />
              <Text className="font-quicksand-bold text-base text-white">
                {tr("details.addToCartTotal", { amount: total.toFixed(2) })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Toast
        visible={showToast}
        onClose={() => setShowToast(false)}
        isFirstItem={isFirstItem}
      />

      <ReviewModal
        visible={showReviewModal}
        isEditing={!!myReview}
        initialRating={myReview?.rating}
        initialComment={myReview?.comment}
        submitting={submittingReview}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmitReview}
      />

      <AppModal
        visible={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        tone="error"
        icon={Trash2}
        title={tr("details.deleteReviewTitle")}
        message={tr("details.deleteReviewMsg")}
        primary={{ label: tr("details.deleteReview"), onPress: handleDeleteReview }}
        secondary={{
          label: tr("common.cancel"),
          onPress: () => setShowDeleteConfirm(false),
        }}
      />

      <AppModal
        visible={showSignInPrompt}
        onClose={() => setShowSignInPrompt(false)}
        tone="primary"
        icon={LogIn}
        title={tr("details.signInToReviewTitle")}
        message={tr("details.signInToReviewMsg")}
        primary={{
          label: tr("auth.signIn"),
          onPress: () => {
            setShowSignInPrompt(false);
            router.push("/sign-in");
          },
        }}
        secondary={{
          label: tr("common.cancel"),
          onPress: () => setShowSignInPrompt(false),
        }}
      />
    </>
  );
};

export default Details;
