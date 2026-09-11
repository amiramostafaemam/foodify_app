import { useColors } from "@/hooks/useColors";
import { useT } from "@/lib/i18n";
import { Language, useLanguageStore } from "@/store/language.store";
import { ThemeMode, useThemeStore } from "@/store/theme.store";
import cn from "clsx";
import { router } from "expo-router";
import {
  Check,
  ChevronLeft,
  Monitor,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react-native";
import { type ReactNode } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
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

        <Text className="mt-8 text-center font-quicksand-medium text-xs text-muted">
          Foodify · v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
