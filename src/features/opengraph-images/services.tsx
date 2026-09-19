import { t, type Locale } from "../../i18n";
import { OgFrame } from "./frame";

export function CreateServicesImageComponent({
  trainingCount,
  locale = "cs",
}: {
  trainingCount: number;
  locale?: Locale;
}) {
  const years = `${new Date().getFullYear() - 2020}+`;
  const bullets = [
    t(locale, "og.services_bullet_consultation"),
    t(locale, "og.services_bullet_training"),
    t(locale, "og.services_bullet_cooperation"),
  ];

  return (
    <OgFrame
      url="mares.cz/sluzby"
      eyebrow={t(locale, "services.heading")}
      title={`${t(locale, "services_hero.heading")} ${t(locale, "services_hero.heading_accent")}`}
      description={t(locale, "og.services_description")}
      meta={bullets.join(" · ")}
      stats={[
        {
          label: t(locale, "services_hero.years_label"),
          value: `${years} ${t(locale, "services_hero.years_suffix")}`,
        },
        { label: t(locale, "services_hero.projects_label"), value: t(locale, "services_hero.projects") },
        {
          label: t(locale, "services_hero.training_count_label"),
          value: t(locale, "services_hero.training_count", { count: trainingCount }),
        },
      ]}
    />
  );
}
