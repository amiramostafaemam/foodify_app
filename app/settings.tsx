import { useColors } from "@/hooks/useColors";
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
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
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

const THEMES: { mode: ThemeMode; label: string; icon: LucideIcon }[] = [
  { mode: "light", label: "Light", icon: Sun },
  { mode: "dark", label: "Dark", icon: Moon },
  { mode: "system", label: "Match system", icon: Monitor },
];

const LANGS: { lang: Language; label: string; hint?: string }[] = [
  { lang: "en", label: "English" },
  { lang: "ar", label: "العربية", hint: "Full translation coming soon" },
];

const Settings = () => {
  const c = useColors();
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
        <Text className="h3-bold text-content">Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Appearance">
          {THEMES.map((t, i) => (
            <OptionRow
              key={t.mode}
              icon={t.icon}
              label={t.label}
              selected={mode === t.mode}
              onPress={() => setMode(t.mode)}
              last={i === THEMES.length - 1}
            />
          ))}
        </Section>

        <Section title="Language">
          {LANGS.map((l, i) => (
            <OptionRow
              key={l.lang}
              label={l.label}
              hint={l.hint}
              selected={language === l.lang}
              onPress={() => setLanguage(l.lang)}
              last={i === LANGS.length - 1}
            />
          ))}
        </Section>

        <Text className="mt-8 text-center font-quicksand-medium text-xs text-muted">
          Foodify · v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
