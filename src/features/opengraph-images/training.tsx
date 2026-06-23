import { t, type Locale } from "../../i18n";
import { formatDuration, formatPrice } from "../../i18n/formatting";

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

export function CreateTrainingImageComponent({
  slug,
  title,
  description,
  length,
  price,
  image,
  locale = "cs",
}: {
  slug: string;
  title: string;
  description: string;
  length: number;
  price: number;
  image?: string;
  locale?: Locale;
}) {
  const durationLabel = formatDuration(length, locale);
  const priceLabel = formatPrice(price, locale);

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
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {image !== undefined && (
              <img style={{ filter: "invert(100%)" }} width={80} height={80} alt="" src={image} />
            )}
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
              <span style={{ color: "#f54a00" }}>{title}</span>
              <span>{t(locale, "training_hero.training_suffix")}</span>
            </div>
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
            {description}
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
          mares.cz/skoleni/{slug}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        <StatItem value={durationLabel} description={t(locale, "training_hero.duration_label")} />
        <StatItem value={priceLabel} description={t(locale, "training_hero.price_label")} />
      </div>
    </div>
  );
}
