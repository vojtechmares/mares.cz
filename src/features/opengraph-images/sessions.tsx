import { t, type Locale } from "../../i18n";
import { formatDate, formatSessionCount } from "../../i18n/formatting";
import { OgFrame, type OgStat } from "./frame";

export function CreateSessionsImageComponent({
  sessionCount,
  topicCount,
  nextSessionDate,
  locale = "cs",
}: {
  sessionCount: number;
  topicCount: number;
  nextSessionDate: string | null;
  locale?: Locale;
}) {
  const hasSessions = sessionCount > 0;

  const stats: OgStat[] = [];
  if (hasSessions) {
    stats.push(
      { label: t(locale, "sessions_hero.sessions_upcoming"), value: formatSessionCount(sessionCount, locale) },
      {
        label: t(locale, "sessions_hero.topics_label"),
        value: `${topicCount} ${t(locale, "sessions_hero.topics_suffix")}`,
      },
    );
    if (nextSessionDate) {
      stats.push({
        label: t(locale, "sessions_hero.next_session"),
        value: formatDate(nextSessionDate, locale, { day: "numeric", month: "long" }),
      });
    }
  }

  return (
    <OgFrame
      url="mares.cz/skoleni/verejne-terminy"
      eyebrow={t(locale, "og.services_bullet_training")}
      title={[
        t(locale, "sessions_hero.heading_public"),
        t(locale, "sessions_hero.heading_sessions"),
        t(locale, "sessions_hero.heading_training"),
      ].join(" ")}
      description={hasSessions ? t(locale, "sessions_hero.description") : t(locale, "sessions_hero.no_sessions_text")}
      stats={stats}
    />
  );
}
