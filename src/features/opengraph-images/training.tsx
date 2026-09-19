import { t, type Locale } from "../../i18n";
import { formatDuration, formatPrice } from "../../i18n/formatting";
import { OgFrame } from "./frame";
import { displayUrl } from "../../i18n/routes";
import { bareSlug } from "../../lib/content";

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
  return (
    <OgFrame
      url={displayUrl(`/skoleni/${bareSlug(slug)}`, locale)}
      eyebrow={t(locale, "og.services_bullet_training")}
      title={`${title} ${t(locale, "training_hero.training_suffix")}`}
      description={description}
      icon={image}
      stats={[
        { label: t(locale, "training_hero.duration_label"), value: formatDuration(length, locale) },
        { label: t(locale, "training_hero.price_label"), value: formatPrice(price, locale) },
      ]}
    />
  );
}
