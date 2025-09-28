import clsx from "clsx";
import type { Training } from "../../interfaces/training";

export function Logo({ training }: { training: Training }) {
    let imageURL = training.logo?.formats.small?.url;

    if (imageURL === undefined) {
        imageURL = training.logo?.formats.thumbnail?.url;
    }

    if (imageURL === undefined) {
        // using SVG icon as fallback
        imageURL = training.icon?.url;
    }

    if (imageURL === undefined) {
        return <></>;
    }

    return (
        <img
            src={imageURL}
            alt=""
            width="100"
            height="100"
            className={clsx(
                "h-32 w-auto",
                imageURL.endsWith(".svg") ? "invert" : ""
            )}
        />
    );
}
