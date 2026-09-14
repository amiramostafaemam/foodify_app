import AppModal from "@/components/AppModal";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { useColors } from "@/hooks/useColors";
import { updateUserPassword } from "@/lib/appwrite";
import { t, useT } from "@/lib/i18n";
import { Language, useLanguageStore } from "@/store/language.store";
import { ThemeMode, useThemeStore } from "@/store/theme.store";
import cn from "clsx";
import { router } from "expo-router";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CircleCheck,
  Lock,
  Monitor,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const getPasswordErrorMessage = (error: unknown): string => {
  const message =
    (error as Error)?.message?.toLowerCase() || String(error).toLowerCase();
  if (
    message.includes("invalid credentials") ||
    message.includes("invalid_credentials")
  ) {
    return t("edit.errCurrentPasswordWrong");
  }
  if (message.includes("password_policy") || message.includes("at least")) {
    return t("auth.errPasswordLen");
  }
  if (message.includes("network") || message.includes("failed to fetch")) {
    return t("auth.errNetwork");
  }
  return (error as Error)?.message || t("auth.errGeneric");
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <View className="mt-6">
    <Text className="mb-2 px-1 font-quicksand-bold text-[13px] uppercase tracking-wide text-muted">
      {title}
    </Text>
    <View className="overflow-hidden rounded-2xl bg-surface">{children}</View>
  </View>
);

const OptionRow = ({
  icon: Icon,
  label,
  hint,
  selected,
  onPress,
  last,
}: {
  icon?: LucideIcon;
  label: string;
  hint?: string;
  selected: boolean;
  onPress: () => void;
  last?: boolean;
}) => {
  const c = useColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={cn(
        "flex-row items-center gap-3 px-4 py-4",
        !last && "border-b border-line/10",
      )}
    >
      {Icon ? <Icon size={19} color={c.muted} /> : null}
      <View className="flex-1">
        <Text className="paragraph-semibold text-content">{label}</Text>
        {hint ? (
          <Text className="body-regular mt-0.5 text-muted">{hint}</Text>
        ) : null}
      </View>
      {selected ? (
        <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
          <Check size={14} color="#fff" strokeWidth={3} />
        </View>
      ) : (
        <View className="h-6 w-6 rounded-full border-2 border-line/20" />
      )}
    </TouchableOpacity>
  );
};

const THEMES: { mode: ThemeMode; key: "settings.light" | "settings.dark" | "settings.system"; icon: LucideIcon }[] =
  [
    { mode: "light", key: "settings.light", icon: Sun },
    { mode: "dark", key: "settings.dark", icon: Moon },
    { mode: "system", key: "settings.system", icon: Monitor },
  ];

const LANGS: { lang: Language; label: string }[] = [
  { lang: "en", label: "English" },
  { lang: "ar", label: "العربية" },
];

const ChangePasswordSection = () => {
  const tr = useT();
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const submit = async () => {
    setError("");
    const { current, next, confirm } = form;

    if (!current || !next || !confirm) {
      setError(tr("edit.errFillPasswordFields"));
      return;
    }
    if (next.length < 8) {
      setError(tr("auth.errPasswordLen"));
      return;
    }
    if (next !== confirm) {
      setError(tr("auth.errPasswordMismatch"));
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUserPassword(next, current);
      setForm({ current: "", next: "", confirm: "" });
      setExpanded(false);
      setShowSuccess(true);
    } catch (e) {
      setError(getPasswordErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Section title={tr("settings.account")}>
        <TouchableOpacity
          onPress={() => setExpanded((v) => !v)}
          activeOpacity={0.7}
          className="flex-row items-center gap-3 px-4 py-4"
        >
          <Lock size={19} color="#878787" />
          <Text className="paragraph-semibold flex-1 text-content">
            {tr("edit.changePassword")}
          </Text>
          {expanded ? (
            <ChevronUp size={18} color="#878787" />
          ) : (
            <ChevronDown size={18} color="#878787" />
          )}
        </TouchableOpacity>

        {expanded ? (
          <View className="gap-4 border-t border-line/10 px-4 py-4">
            <CustomInput
              label={tr("edit.currentPassword")}
              placeholder={tr("edit.enterCurrentPassword")}
              value={form.current}
              onChangeText={(current) =>
                setForm((prev) => ({ ...prev, current }))
              }
              secureTextEntry
            />
            <CustomInput
              label={tr("edit.newPassword")}
              placeholder={tr("auth.min8")}
              value={form.next}
              onChangeText={(next) => setForm((prev) => ({ ...prev, next }))}
              secureTextEntry
            />
            <CustomInput
              label={tr("edit.confirmNewPassword")}
              placeholder={tr("auth.enterConfirmPassword")}
              value={form.confirm}
              onChangeText={(confirm) =>
                setForm((prev) => ({ ...prev, confirm }))
              }
              secureTextEntry
            />

            {error ? (
              <Text className="font-quicksand-medium text-sm text-error">
                {error}
              </Text>
            ) : null}

            <CustomButton
              title={tr("edit.updatePassword")}
              onPress={submit}
              isLoading={isSubmitting}
            />
          </View>
        ) : null}
      </Section>

      <AppModal
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        tone="success"
        icon={CircleCheck}
        title={tr("edit.passwordUpdated")}
        message={tr("edit.passwordUpdatedMsg")}
        primary={{ label: tr("auth.resetDone"), onPress: () => setShowSuccess(false) }}
      />
    </>
  );
};

const Settings = () => {
  const c = useColors();
  const tr = useT();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top"]}>
      <View className="flex-row items-center gap-2 px-5 pb-2 pt-2">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={10}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface"
        >
          <ChevronLeft size={22} color={c.content} />
        </TouchableOpacity>
        <Text className="h3-bold text-content">{tr("settings.title")}</Text>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
      >
        <Section title={tr("settings.appearance")}>
          {THEMES.map((th, i) => (
            <OptionRow
              key={th.mode}
              icon={th.icon}
              label={tr(th.key)}
              selected={mode === th.mode}
              onPress={() => setMode(th.mode)}
              last={i === THEMES.length - 1}
            />
          ))}
        </Section>

        <Section title={tr("settings.language")}>
          {LANGS.map((l, i) => (
            <OptionRow
              key={l.lang}
              label={l.label}
              selected={language === l.lang}
              onPress={() => setLanguage(l.lang)}
              last={i === LANGS.length - 1}
            />
          ))}
        </Section>

        <Text className="mt-3 px-1 font-quicksand-medium text-xs leading-[1.5] text-muted">
          {tr("settings.restartHint")}
        </Text>

        <ChangePasswordSection />

        <Text className="mt-8 text-center font-quicksand-medium text-xs text-muted">
          Foodify · v1.0.0
        </Text>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Settings;
