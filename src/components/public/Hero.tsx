import type { HeroStat } from "@prisma/client";
import type { Copy } from "@/lib/queries/content";
import type { Settings } from "@/lib/queries/site";

type Props = { copy: Copy; settings: Settings; stats: HeroStat[] };

export function Hero({ copy, settings, stats }: Props) {
  const photo = settings.heroPhotoUrl ?? "/assets/profile.jpg";

  return (
    <section className="hero">
      <div
        className="hero__photo"
        role="img"
        aria-label={`Portrait of ${settings.name}`}
        style={{ backgroundImage: `url("${photo}")` }}
      />
      <div className="hero__scrim" />
      <div className="hero__grid" />

      <div className="shell">
        <div className="hero__inner">
          {settings.availabilityOn && settings.availabilityText && (
            <p className="pill rise d1">
              <span className="dot" aria-hidden="true" />
              {settings.availabilityText}
            </p>
          )}

          <h1 className="rise d2">
            {copy("hero.headline.lead")} <span className="grad">{copy("hero.headline.joiner")}</span>{" "}
            <span className="break grad">{copy("hero.headline.highlight")}</span>
          </h1>

          <p className="lede rise d3">{copy("hero.lede")}</p>
          <p className="body rise d4">{copy("hero.body")}</p>

          <div className="actions rise d5">
            <a className="btn btn--primary" href="#projects">
              {copy("hero.cta.primary")}
            </a>
            <a className="btn btn--ghost" href={settings.githubUrl} target="_blank" rel="noopener noreferrer">
              {copy("hero.cta.secondary")}
            </a>
            <a className="btn btn--ghost" href="#contact">
              {copy("hero.cta.tertiary")}
            </a>
          </div>

          {stats.length > 0 && (
            <dl className="stats rise d6">
              {stats.map((stat) => (
                <div className="stat" key={stat.id}>
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}
