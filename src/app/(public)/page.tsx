import Link from "next/link";
import { Hero } from "@/components/public/Hero";
import { AboutSection } from "@/components/public/AboutSection";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Reveal } from "@/components/public/Reveal";
import {
  CapabilitiesSection,
  ContactSection,
  CourseworkCard,
  EducationSection,
  ExperienceSection,
  JourneySection,
  PersonalSection,
  ResearchVisionSection,
  SkillsSection,
} from "@/components/public/Sections";
import { getCopy } from "@/lib/queries/content";
import { getFeaturedProjects } from "@/lib/queries/projects";
import {
  getCapabilities,
  getCertifications,
  getCoursework,
  getDomains,
  getEducation,
  getExperience,
  getHeroStats,
  getInfoLists,
  getSettings,
  getSkillTiers,
} from "@/lib/queries/site";
import { REPO_BASE } from "@/config/site";

// Statically rendered and busted by revalidatePath on every admin save, with an
// hourly refresh as a safety net if a revalidate call is ever missed.
export const revalidate = 3600;

export default async function HomePage() {
  const [
    copy,
    settings,
    stats,
    domains,
    capabilities,
    tiers,
    featured,
    experience,
    education,
    certifications,
    infoLists,
    coursework,
  ] = await Promise.all([
    getCopy(),
    getSettings(),
    getHeroStats(),
    getDomains(),
    getCapabilities(),
    getSkillTiers(),
    getFeaturedProjects(),
    getExperience(),
    getEducation(),
    getCertifications(),
    getInfoLists(),
    getCoursework(),
  ]);

  return (
    <main id="top">
      <Hero copy={copy} settings={settings} stats={stats} />

      <section id="about" className="journey-section" data-tone="about">
        <Reveal className="wrap">
          <AboutSection
            eyebrow={copy("about.eyebrow")}
            title={copy("about.title")}
            subtitle={copy("about.subtitle")}
            body1={copy("about.body1")}
            body2={copy("about.body2")}
            body3={copy("about.body3")}
            readMoreLabel={copy("about.readMore")}
            domainsEyebrow={copy("about.domains.eyebrow")}
            domains={domains}
          />
        </Reveal>
      </section>

      <section id="what" className="journey-section" data-tone="what">
        <Reveal className="wrap">
          <CapabilitiesSection copy={copy} capabilities={capabilities} />
        </Reveal>
      </section>

      <section id="journey" className="journey-section story-section" data-tone="journey">
        <Reveal className="wrap">
          <JourneySection copy={copy} />
        </Reveal>
      </section>

      <section id="projects" className="journey-section" data-tone="projects">
        <Reveal className="wrap">
          <p className="eyebrow">{copy("projects.eyebrow")}</p>
          <h2 className="section-title">{copy("projects.title")}</h2>
          <p className="section-sub">{copy("projects.subtitle")}</p>

          {featured.length > 0 ? (
            <div className="grid cols-3">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p className="empty-note">
              No projects are featured yet. Star up to six in the admin and they will appear here.
            </p>
          )}

          <div className="center-row">
            <Link className="btn btn--primary" href="/projects">
              {copy("projects.viewAll")}
            </Link>
          </div>

          <CourseworkCard copy={copy} coursework={coursework} repoBase={REPO_BASE} />
        </Reveal>
      </section>

      <section id="experience" className="journey-section" data-tone="experience">
        <Reveal className="wrap">
          <ExperienceSection copy={copy} experience={experience} />
        </Reveal>
      </section>

      <section id="skills" className="journey-section" data-tone="skills">
        <Reveal className="wrap">
          <SkillsSection copy={copy} tiers={tiers} />
        </Reveal>
      </section>

      <section id="personal" className="journey-section" data-tone="about">
        <Reveal className="wrap">
          <PersonalSection copy={copy} infoLists={infoLists} />
        </Reveal>
      </section>

      <section id="research" className="journey-section research-section" data-tone="research">
        <Reveal className="wrap">
          <ResearchVisionSection copy={copy} />
        </Reveal>
      </section>

      <section id="education" className="journey-section" data-tone="education">
        <Reveal className="wrap">
          <EducationSection
            copy={copy}
            education={education}
            certifications={certifications}
          />
        </Reveal>
      </section>

      <section id="contact" className="journey-section" data-tone="contact">
        <Reveal className="wrap">
          <ContactSection copy={copy} settings={settings} />
        </Reveal>
      </section>
    </main>
  );
}
