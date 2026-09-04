import Link from "next/link";
import type {
  Capability,
  Certification,
  CourseworkItem,
  EducationItem,
  Experience,
  InfoList,
  SkillItem,
  SkillTier,
} from "@prisma/client";
import type { Copy } from "@/lib/queries/content";
import { readGrades } from "@/lib/queries/site";
import { TIER_SEGMENTS } from "@/config/site";

export function JourneySection({ copy }: { copy: Copy }) {
  const milestones = [1, 2, 3, 4].map((index) => ({
    place: copy(`journey.step${index}.place`),
    title: copy(`journey.step${index}.title`),
    body: copy(`journey.step${index}.body`),
  }));

  return (
    <>
      <p className="eyebrow">{copy("journey.eyebrow")}</p>
      <h2 className="section-title">{copy("journey.title")}</h2>
      <p className="section-sub">{copy("journey.subtitle")}</p>

      <ol className="story-path">
        {milestones.map((milestone, index) => (
          <li className="story-stop" key={milestone.place}>
            <span className="story-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="story-place">{milestone.place}</p>
            <h3>{milestone.title}</h3>
            <p>{milestone.body}</p>
          </li>
        ))}
      </ol>

      <div className="story-thesis">
        <span aria-hidden="true">→</span>
        <div>
          <h3>{copy("journey.thesis.title")}</h3>
          <p>{copy("journey.thesis.body")}</p>
        </div>
      </div>
    </>
  );
}

export function CapabilitiesSection({ copy, capabilities }: { copy: Copy; capabilities: Capability[] }) {
  return (
    <>
      <p className="eyebrow">{copy("what.eyebrow")}</p>
      <h2 className="section-title">{copy("what.title")}</h2>
      <p className="section-sub">{copy("what.subtitle")}</p>
      <div className="grid cols-3">
        {capabilities.map((item) => (
          <div className="card do-card" key={item.id}>
            <div className="skill-head">
              <span className="skill-ico" aria-hidden="true">
                {item.iconKey}
              </span>{" "}
              {item.title}
            </div>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

type TierWithItems = SkillTier & { items: SkillItem[] };

export function SkillsSection({ copy, tiers }: { copy: Copy; tiers: TierWithItems[] }) {
  return (
    <>
      <p className="eyebrow">{copy("skills.eyebrow")}</p>
      <h2 className="section-title">{copy("skills.title")}</h2>
      <p className="section-sub">{copy("skills.subtitle")}</p>

      {tiers.map((tier) => {
        const filled = Math.max(0, Math.min(TIER_SEGMENTS, tier.level));
        return (
          <div className="tier" key={tier.id}>
            <div className="tier-head">
              <h3>{tier.name}</h3>
              <span>{tier.subtitle}</span>
            </div>
            <div className="tier-bar" aria-hidden="true">
              {Array.from({ length: TIER_SEGMENTS }, (_, i) => (
                <i key={i} className={i < filled ? "on" : undefined} />
              ))}
            </div>
            <div className="tier-chips">
              {tier.items.map((item) => (
                <span className="tier-chip" key={item.id}>
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

export function ResearchVisionSection({ copy }: { copy: Copy }) {
  const pillars = [
    {
      number: "01",
      title: copy("research.pillar.problem.title"),
      body: copy("research.pillar.problem.body"),
    },
    {
      number: "02",
      title: copy("research.pillar.rigour.title"),
      body: copy("research.pillar.rigour.body"),
    },
    {
      number: "03",
      title: copy("research.pillar.translation.title"),
      body: copy("research.pillar.translation.body"),
    },
  ];

  return (
    <>
      <p className="eyebrow">{copy("research.eyebrow")}</p>
      <h2 className="section-title">{copy("research.title")}</h2>
      <p className="section-sub">{copy("research.subtitle")}</p>

      <div className="research-pillars">
        {pillars.map((pillar) => (
          <article className="research-pillar" key={pillar.number}>
            <span className="research-number" aria-hidden="true">
              {pillar.number}
            </span>
            <h3>{pillar.title}</h3>
            <p>{pillar.body}</p>
          </article>
        ))}
      </div>

      <div className="vision-card">
        <div className="vision-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
          <b>BRTI</b>
        </div>
        <div className="vision-copy">
          <p className="vision-kicker">{copy("research.vision.kicker")}</p>
          <h3>{copy("research.vision.title")}</h3>
          <p>{copy("research.vision.body")}</p>
          <div className="vision-fields" aria-label="Future areas of focus">
            <span>{copy("research.vision.focus1")}</span>
            <span>{copy("research.vision.focus2")}</span>
            <span>{copy("research.vision.focus3")}</span>
            <span>{copy("research.vision.focus4")}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export function PersonalSection({ copy, infoLists }: { copy: Copy; infoLists: InfoList[] }) {
  return (
    <>
      <p className="eyebrow">{copy("personal.eyebrow")}</p>
      <h2 className="section-title">{copy("personal.title")}</h2>
      <p className="section-sub">{copy("personal.subtitle")}</p>

      <div className="grid cols-2 personal-grid">
        {infoLists.map((list) => (
          <div className="card" key={list.id}>
            <div className="skill-head">
              <span className="skill-ico" aria-hidden="true">
                {list.iconKey}
              </span>{" "}
              {list.title}
            </div>
            <ul className="personal-list">
              {list.items.map((entry, index) => (
                <li key={index}>{entry}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export function ExperienceSection({ copy, experience }: { copy: Copy; experience: Experience[] }) {
  return (
    <>
      <p className="eyebrow">{copy("experience.eyebrow")}</p>
      <h2 className="section-title">{copy("experience.title")}</h2>
      <p className="section-sub">{copy("experience.subtitle")}</p>
      <div className="timeline">
        {experience.map((item) => (
          <div className="tl-item" key={item.id}>
            <div className="tl-top">
              <div>
                <span className="tl-role">{item.role}</span> {"·"} <span className="tl-org">{item.organisation}</span>
              </div>
              <span className="tl-date">
                {item.period}
                {item.location ? ` · ${item.location}` : ""}
              </span>
            </div>
            <ul>
              {item.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

type EducationProps = {
  copy: Copy;
  education: EducationItem[];
  certifications: Certification[];
};

export function EducationSection({ copy, education, certifications }: EducationProps) {
  return (
    <>
      <p className="eyebrow">{copy("education.eyebrow")}</p>
      <h2 className="section-title">{copy("education.title")}</h2>
      <p className="section-sub">{copy("education.subtitle")}</p>

      <div className="grid cols-2">
        {education.map((item) => {
          const grades = readGrades(item.grades);
          return (
            <div className="card" key={item.id}>
              <div className="edu-card">
                <span className="edu-ico" aria-hidden="true">
                  {item.iconKey}
                </span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 4px", fontFamily: "var(--display)", fontSize: "1.06rem" }}>{item.degree}</h3>
                  <p style={{ margin: 0, color: "var(--brand)", fontWeight: 600 }}>{item.institution}</p>
                  <p style={{ margin: "6px 0 0", color: "var(--muted)", fontSize: ".88rem" }}>{item.meta}</p>
                  {grades.length > 0 && (
                    <ul className="grade-list">
                      {grades.map((grade) => (
                        <li key={grade.course}>
                          <span>{grade.course}</span>
                          <span className="grade-num">{grade.score}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.note && (
                    <p style={{ margin: "10px 0 0", color: "var(--muted)", fontSize: ".82rem" }}>{item.note}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div className="card">
          <div className="skill-head">
            <span className="skill-ico" aria-hidden="true">
              {"📜"}
            </span>{" "}
            {copy("education.certifications.title")}
          </div>
          <ul className="cert-list">
            {certifications.map((cert) => (
              <li key={cert.id}>
                <div>
                  {cert.name}
                  <div className="who">
                    {cert.issuer}
                    {cert.credentialId ? `, certificate no. ${cert.credentialId}` : ""}
                  </div>
                </div>
                <span className="cert-date">{cert.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="academic-cta-row">
        <Link className="btn btn--primary" href="/academic-profile">
          {copy("education.profileCta")}
        </Link>
        <a
          className="btn btn--ghost"
          href="/documents/adossi-fred-william-unofficial-transcript.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy("education.transcriptCta")}
        </a>
      </div>
    </>
  );
}

export function CourseworkCard({
  copy,
  coursework,
  repoBase,
}: {
  copy: Copy;
  coursework: CourseworkItem[];
  repoBase: string;
}) {
  if (coursework.length === 0) return null;
  return (
    <div className="card" style={{ marginTop: 26 }}>
      <div className="skill-head">
        <span className="skill-ico" aria-hidden="true">
          {"📚"}
        </span>{" "}
        {copy("projects.coursework.title")}
      </div>
      <p style={{ color: "var(--muted)", margin: "0 0 14px", fontSize: ".9rem", lineHeight: 1.6 }}>
        {copy("projects.coursework.body")}
      </p>
      <div className="tags">
        {coursework.map((item) => (
          <a
            className="tag"
            key={item.id}
            href={`${repoBase}${item.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            {item.name}
          </a>
        ))}
      </div>
    </div>
  );
}

export function ContactSection({ copy, settings }: { copy: Copy; settings: { email: string; phone: string; githubUrl: string; linkedinUrl: string } }) {
  return (
    <div className="contact-card">
      <p className="eyebrow" style={{ justifyContent: "center" }}>
        {copy("contact.eyebrow")}
      </p>
      <h2>{copy("contact.heading")}</h2>
      <p>{copy("contact.body")}</p>
      <div className="contact-links">
        <a className="btn btn--primary" href={`mailto:${settings.email}`}>
          {settings.email}
        </a>
        <a className="btn btn--ghost" href={`tel:${settings.phone.replace(/\s+/g, "")}`}>
          {settings.phone}
        </a>
        <a className="btn btn--ghost" href={settings.githubUrl} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a className="btn btn--ghost" href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>
    </div>
  );
}
