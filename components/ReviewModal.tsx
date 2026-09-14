import StarRating from "@/components/StarRating";
import { useColors } from "@/hooks/useColors";
import { useT } from "@/lib/i18n";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

interface Props {
  visible: boolean;
  initialRating?: number;
  initialComment?: string;
  isEditing: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

const ReviewModal = ({
  visible,
  initialRating = 0,
  initialComment = "",
  isEditing,
  submitting,
  onClose,
  onSubmit,
}: Props) => {
  const tr = useT();
  const c = useColors();
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState("");

  // Reset to whatever's being edited (or a blank form) each time the modal
  // opens — adjusting state during render when a prop changes, rather than
  // in an effect, per React's guidance for this exact pattern.
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setRating(initialRating);
      setComment(initialComment);
      setError("");
    }
  }

  const submit = () => {
    if (rating < 1) {
      setError(tr("details.ratingRequired"));
      return;
    }
    setError("");
    onSubmit(rating, comment.trim());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-[380px] rounded-[28px] bg-elevated p-6 shadow-2xl">
            <Text className="text-center font-quicksand-bold text-xl text-content">
              {isEditing ? tr("details.editReview") : tr("details.writeReview")}
            </Text>

            <Text className="mt-5 text-center font-quicksand-semibold text-sm text-muted">
              {tr("details.yourRating")}
            </Text>
            <View className="mt-2.5 items-center">
              <StarRating rating={rating} size={30} onChange={setRating} />
            </View>

            <TextInput
              value={comment}
              onChangeText={setComment}
              placeholder={tr("details.reviewPlaceholder")}
              placeholderTextColor={c.muted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="mt-5 rounded-2xl bg-surface px-4 py-3.5 font-quicksand-medium text-base text-content"
              style={{ minHeight: 90 }}
            />

            {error ? (
              <Text className="mt-2.5 self-start font-quicksand-medium text-sm text-error">
                {error}
              </Text>
            ) : null}

            <View className="mt-5 gap-2.5">
              <TouchableOpacity
                onPress={submit}
                disabled={submitting}
                activeOpacity={0.9}
                className="items-center rounded-full bg-primary py-4"
                style={submitting ? { opacity: 0.7 } : undefined}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="font-quicksand-bold text-base text-white">
                    {isEditing
                      ? tr("details.updateReview")
                      : tr("details.submitReview")}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.9}
                className="items-center rounded-full bg-surface py-4"
              >
                <Text className="font-quicksand-bold text-base text-content">
                  {tr("common.cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReviewModal;
