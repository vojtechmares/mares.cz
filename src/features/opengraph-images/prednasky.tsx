import { t, type Locale } from "../../i18n";
import { OgFrame } from "./frame";

export function CreatePrednaskyImageComponent({
  talkCount,
  eventCount,
  yearsOfSpeaking,
  locale = "cs",
}: {
  talkCount: number;
  eventCount: number;
  yearsOfSpeaking: number;
  locale?: Locale;
}) {
  return (
    <OgFrame
      url="mares.cz/prednasky"
      eyebrow={t(locale, "talks.eyebrow")}
      title={`${t(locale, "talks.heading")} ${t(locale, "talks.heading_accent")}`}
      description={t(locale, "talks.description")}
      stats={[
        { label: t(locale, "talks.talk_count_label"), value: t(locale, "talks.talk_count", { count: talkCount }) },
        { label: t(locale, "talks.event_count_label"), value: t(locale, "talks.event_count", { count: eventCount }) },
        {
          label: t(locale, "talks.years_count_label"),
          value: t(locale, "talks.years_count", { count: yearsOfSpeaking }),
        },
      ]}
    />
  );
}
