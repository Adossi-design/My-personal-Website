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
  infoLists: InfoList[];
};

export function EducationSection({ copy, education, certifications, infoLists }: EducationProps) {
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

      {infoLists.length > 0 && (
        <div className="grid cols-2" style={{ marginTop: 18 }}>
          {infoLists.map((list) => (
            <div className="card" key={list.id}>
              <div className="skill-head">
                <span className="skill-ico" aria-hidden="true">
                  {list.iconKey}
                </span>{" "}
                {list.title}
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, color: "var(--muted)", fontSize: ".9rem", listStyle: "disc" }}>
                {list.items.map((entry, i) => (
                  <li key={i} style={{ marginBottom: i === list.items.length - 1 ? 0 : 9 }}>
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
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
