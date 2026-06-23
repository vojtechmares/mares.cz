import { t, type Locale } from "../../i18n";
import { formatDate, formatSessionCount } from "../../i18n/formatting";

interface StatItemProps {
  value: string;
  description: string;
}

function StatItem({ value, description }: StatItemProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderLeft: "3px solid #f54a00",
        paddingLeft: "1.5rem",
      }}
    >
      <span
        style={{
          fontFamily: "Inter",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "#ffffff",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "Inter",
          fontSize: "1rem",
          color: "#a3a3a3",
          marginTop: "0.25rem",
        }}
      >
        {description}
      </span>
    </div>
  );
}

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
  const formattedDate = nextSessionDate ? formatDate(nextSessionDate, locale, { day: "numeric", month: "long" }) : null;

  const hasStats = sessionCount > 0;

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#171717",
        padding: "3.5rem 4rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxWidth: "540px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: 700,
              fontFamily: "IBM Plex Sans",
              fontSize: "3.5rem",
              color: "#ffffff",
              lineHeight: 1.15,
            }}
          >
            <span>
              {t(locale, "sessions_hero.heading_public")}&nbsp;
              <span style={{ color: "#f54a00" }}>{t(locale, "sessions_hero.heading_sessions")}</span>
            </span>
            <span>{t(locale, "sessions_hero.heading_training")}</span>
          </div>
          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "1.25rem",
              lineHeight: 1.6,
              fontFamily: "Inter",
              color: "#a3a3a3",
            }}
          >
            {hasStats ? t(locale, "sessions_hero.description") : t(locale, "sessions_hero.no_sessions_text")}
          </p>
        </div>
        <p
          style={{
            fontSize: "1.25rem",
            fontWeight: 400,
            fontFamily: "Inter",
            color: "#737373",
            marginBottom: 0,
          }}
        >
          mares.cz/skoleni/verejne-terminy
        </p>
      </div>
      {hasStats && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          <StatItem
            value={formatSessionCount(sessionCount, locale)}
            description={t(locale, "sessions_hero.sessions_upcoming")}
          />
          <StatItem
            value={`${topicCount} ${t(locale, "sessions_hero.topics_suffix")}`}
            description={t(locale, "sessions_hero.topics_label")}
          />
          {formattedDate && <StatItem value={formattedDate} description={t(locale, "sessions_hero.next_session")} />}
        </div>
      )}
    </div>
  );
}
