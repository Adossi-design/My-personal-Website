import type { HeroStat } from "@prisma/client";
import type { Copy } from "@/lib/queries/content";
import type { Settings } from "@/lib/queries/site";

type Props = { copy: Copy; settings: Settings; stats: HeroStat[] };

export function Hero({ copy, settings, stats }: Props) {
  const photo = settings.heroPhotoUrl ?? "/assets/profile.jpg";

  return (
    <section className="hero" data-tone="hero">
      <div className="shell">
        <div className="hero__layout">
          <div className="hero__inner">
            <p className="hero__discipline rise d1">Software engineering · Machine learning · AI research</p>
            <p className="hero__intro rise d2">{copy("hero.headline.lead")}</p>
            <h1 className="rise d3">
              {copy("hero.headline.joiner")} <span className="grad">{copy("hero.headline.highlight")}.</span>
            </h1>

            <p className="lede rise d4">{copy("hero.lede")}</p>
            <p className="body rise d4">{copy("hero.body")}</p>

            {settings.availabilityOn && settings.availabilityText && (
              <p className="pill rise d5">
                <span className="dot" aria-hidden="true" />
                {settings.availabilityText}
              </p>
            )}

            <div className="actions rise d5">
              <a className="btn btn--primary" href="#projects">
                {copy("hero.cta.secondary")}
              </a>
              <a className="btn btn--ghost" href="/academic-profile">
                {copy("hero.cta.tertiary")}
              </a>
            </div>
          </div>

          <figure className="hero__visual rise d4">
            <div
              className="hero__photo"
              role="img"
              aria-label={`Portrait of ${settings.name}`}
              style={{ backgroundImage: `url("${photo}")` }}
            />
            <figcaption>
              <span>Based in</span>
              <strong>{settings.location}</strong>
            </figcaption>
          </figure>
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
    </section>
  );
}
