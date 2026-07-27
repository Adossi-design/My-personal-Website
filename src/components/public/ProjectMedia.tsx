import Image from "next/image";
import { MediaType } from "@prisma/client";
import { parseEmbed } from "@/lib/media";
import { CardVideo } from "./CardVideo";

export type MediaFields = {
  mediaType: MediaType;
  mediaUrl: string | null;
  posterUrl: string | null;
  mediaAlt: string;
  iconKey: string;
  title: string;
};

// Cards sit in a three-column grid, so this is the widest one ever renders.
const CARD_SIZES = "(max-width: 980px) 100vw, 380px";
const DETAIL_SIZES = "(max-width: 980px) 100vw, 1120px";

// The card slot: 16:9, never a broken image box and never an empty gap.
export function CardMedia({ project }: { project: MediaFields }) {
  const { mediaType, mediaUrl, posterUrl, mediaAlt, iconKey, title } = project;

  if (mediaType === MediaType.IMAGE && mediaUrl) {
    return (
      <div className="proj-media">
        <Image src={mediaUrl} alt={mediaAlt || title} fill sizes={CARD_SIZES} />
      </div>
    );
  }

  if (mediaType === MediaType.VIDEO && mediaUrl) {
    return (
      <div className="proj-media">
        <CardVideo src={mediaUrl} poster={posterUrl} label={mediaAlt || title} />
        <span className="proj-media__badge">Video</span>
      </div>
    );
  }

  if (mediaType === MediaType.VIDEO_EMBED && mediaUrl) {
    const embed = parseEmbed(mediaUrl);
    const still = posterUrl ?? embed?.thumbnailUrl ?? null;
    // A grid of autoplaying iframes is far too heavy, so the card shows the still
    // frame and the detail page carries the real player.
    return (
      <div className={still ? "proj-media" : "proj-media proj-media--empty"}>
        {still ? (
          <Image src={still} alt={mediaAlt || title} fill sizes={CARD_SIZES} />
        ) : (
          <span aria-hidden="true">{iconKey}</span>
        )}
        <span className="proj-media__badge">Video</span>
      </div>
    );
  }

  return (
    <div className="proj-media proj-media--empty" role="img" aria-label={`${title}, no preview image yet`}>
      <span aria-hidden="true">{iconKey}</span>
    </div>
  );
}

// The detail slot: same sources, but video gets real controls here.
export function DetailMedia({ project }: { project: MediaFields }) {
  const { mediaType, mediaUrl, posterUrl, mediaAlt, iconKey, title } = project;

  if (mediaType === MediaType.IMAGE && mediaUrl) {
    return (
      <div className="detail-media">
        <Image src={mediaUrl} alt={mediaAlt || title} fill priority sizes={DETAIL_SIZES} />
      </div>
    );
  }

  if (mediaType === MediaType.VIDEO && mediaUrl) {
    return (
      <div className="detail-media">
        <video src={mediaUrl} poster={posterUrl ?? undefined} controls preload="metadata" playsInline />
      </div>
    );
  }

  if (mediaType === MediaType.VIDEO_EMBED && mediaUrl) {
    const embed = parseEmbed(mediaUrl);
    if (!embed) return null;
    return (
      <div className="detail-media">
        <iframe
          src={embed.embedUrl}
          title={mediaAlt || title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="detail-media proj-media--empty" role="img" aria-label={`${title}, no preview image yet`}>
      <span aria-hidden="true" style={{ fontSize: "3rem" }}>
        {iconKey}
      </span>
    </div>
  );
}
