import type { Metadata } from "next";
import { AcademicProfileActions } from "@/components/public/AcademicProfileActions";
import { Markdown } from "@/components/public/Markdown";
import { getCopy } from "@/lib/queries/content";
import { getFeaturedProjects } from "@/lib/queries/projects";
import {
  getCertifications,
  getEducation,
  getExperience,
  getInfoLists,
  getSettings,
  getSkillTiers,
  readGrades,
} from "@/lib/queries/site";
import { siteUrl } from "@/lib/env";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `Profile | ${settings.name}`;
  const description = `${settings.name}'s background, experience, projects, education, skills, interests, and future direction.`;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl()}/academic-profile` },
    openGraph: { title, description, url: `${siteUrl()}/academic-profile` },
  };
}

export default async function AcademicProfilePage() {
  const [copy, settings, education, experience, certifications, infoLists, skillTiers, projects] = await Promise.all([
    getCopy(),
    getSettings(),
    getEducation(),
    getExperience(),
    getCertifications(),
    getInfoLists(),
    getSkillTiers(),
    getFeaturedProjects(),
  ]);

  const about = [copy("about.body1"), copy("about.body2"), copy("about.body3")].join("\n\n");

  return (
    <main id="top" className="academic-page">
      <section className="academic-shell journey-section" data-tone="education">
        <header className="academic-header">
          <div>
            <p className="eyebrow">Personal and professional profile</p>
            <h1>{settings.name}</h1>
            <p className="academic-role">{settings.roleTitle}</p>
            <p className="academic-contact">
              {settings.location} · <a href={`mailto:${settings.email}`}>{settings.email}</a> ·{" "}
              <a href={settings.linkedinUrl}>LinkedIn</a> · <a href={settings.githubUrl}>GitHub</a>
            </p>
          </div>
          <AcademicProfileActions />
        </header>

        <div className="academic-lead">
          <p>{copy("hero.lede")}</p>
          <p>{copy("hero.body")}</p>
        </div>

        <div className="academic-grid">
          <div className="academic-main">
            <section className="academic-block academic-about">
              <h2>About me</h2>
              <Markdown>{about}</Markdown>
            </section>

            <section className="academic-block">
              <h2>Selected projects</h2>
              <div className="academic-projects">
                {projects.map((project) => (
                  <article key={project.id}>
                    <h3>{project.title}</h3>
                    <p className="academic-highlight">{project.domain}</p>
                    <p>{project.shortDescription}</p>
                    <a href={`/projects/${project.slug}`}>Read the project story →</a>
                  </article>
                ))}
              </div>
            </section>

            <section className="academic-block">
              <h2>Experience</h2>
              <div className="academic-experience">
                {experience.map((item) => (
                  <article key={item.id}>
                    <div className="academic-row">
                      <div>
                        <h3>{item.role}</h3>
                        <p className="academic-highlight">{item.organisation}</p>
                      </div>
                      <span>{item.period}</span>
                    </div>
                    <ul>
                      {item.bullets.map((bullet, index) => (
                        <li key={index}>{bullet}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section className="academic-block">
              <h2>Education</h2>
              {education.map((item) => {
                const grades = readGrades(item.grades);
                return (
                  <article key={item.id}>
                    <div className="academic-row">
                      <div>
                        <h3>{item.degree}</h3>
                        <p className="academic-highlight">{item.institution}</p>
                      </div>
                      <span>{item.period}</span>
                    </div>
                    <p>{item.meta}</p>
                    <div className="academic-grades">
                      {grades.map((grade) => (
                        <span key={grade.course}>
                          {grade.course} <b>{grade.score}%</b>
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="academic-block">
              <h2>Current direction and long-term vision</h2>
              <h3>{copy("research.title")}</h3>
              <p>{copy("research.subtitle")}</p>
              <h3>{copy("research.vision.title")}</h3>
              <p>{copy("research.vision.body")}</p>
              <div className="academic-grades">
                {[1, 2, 3, 4].map((index) => (
                  <span key={index}>{copy(`research.vision.focus${index}`)}</span>
                ))}
              </div>
            </section>
          </div>

          <aside className="academic-side">
            <section className="academic-block">
              <h2>At a glance</h2>
              <ul>
                <li>Software engineering is my professional foundation.</li>
                <li>Machine learning is an area where I have built growing project experience.</li>
                <li>AI engineering and research are the direction I am working toward.</li>
                <li>Healthcare, agriculture, and education are the areas I care about most.</li>
              </ul>
            </section>

            {infoLists.map((list) => (
              <section className="academic-block" key={list.id}>
                <h2>{list.title}</h2>
                <ul>
                  {list.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="academic-block">
              <h2>Technical skills</h2>
              {skillTiers.map((tier) => (
                <div className="academic-skills" key={tier.id}>
                  <h3>{tier.name}</h3>
                  <p>{tier.items.map((item) => item.name).join(" · ")}</p>
                </div>
              ))}
            </section>

            <section className="academic-block">
              <h2>Selected certifications</h2>
              <ul className="academic-certs">
                {certifications.map((cert) => (
                  <li key={cert.id}>
                    <b>{cert.name}</b>
                    <span>{cert.issuer} · {cert.date}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="academic-block academic-proof">
              <h2>Academic record</h2>
              <strong>4.14 / 5.00</strong>
              <p>Current CGPA</p>
              <strong>380 / 380</strong>
              <p>Attempted credits earned</p>
              <a href="/documents/adossi-fred-william-unofficial-transcript.pdf" target="_blank" rel="noopener noreferrer">
                View unofficial ALU transcript →
              </a>
              <small>Transcript printed 27 August 2026.</small>
            </section>

            <section className="academic-block academic-reference">
              <h2>Documents and references</h2>
              <p>My résumé, transcript, project source code, and demonstrations are linked throughout this website.</p>
              <p className="no-print">Professional or academic references can be shared when they are needed.</p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
