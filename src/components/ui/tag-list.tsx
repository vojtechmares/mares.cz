import clsx from "clsx";

import { localizeUrl } from "../../i18n/routes";
import type { Locale } from "../../i18n/types";

type TagListVariant = "default" | "inverse";

type TagListProps = {
  tags: string[];
  variant?: TagListVariant;
  activeTag?: string;
  className?: string;
  locale?: Locale;
};

const variantStyles: Record<TagListVariant, string> = {
  default: "text-zinc-900 underline",
  inverse: "text-zinc-100 underline",
};

export function TagList({ tags, variant = "default", activeTag, className, locale = "cs" }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <span className={className}>
      {tags.map((tag, index) => (
        <span key={tag}>
          <a
            href={localizeUrl(`/blog/tag/${tag}`, locale)}
            className={clsx(variantStyles[variant], tag === activeTag && "font-bold")}
          >
            #{tag}
          </a>
          {index < tags.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}
