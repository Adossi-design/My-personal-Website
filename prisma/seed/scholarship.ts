import { PrismaClient } from "@prisma/client";
import { REPO_BASE } from "../../src/config/site";
import { contentBlocks } from "../../src/content/copy";
import { educationItems } from "../../src/content/cv";
import { projects } from "../../src/content/projects";
import { siteSettings } from "../../src/content/settings";
import { slugify } from "../../src/lib/slug";

const prisma = new PrismaClient();

const updatedCopyGroups = new Set(["hero", "journey", "about", "projects", "research", "education", "contact", "nav"]);
const flagshipProjects = projects.filter((project) => project.featuredOrder !== undefined);

async function main() {
  await prisma.$transaction(async (tx) => {
    for (const [sortOrder, block] of contentBlocks.entries()) {
      if (!updatedCopyGroups.has(block.group)) continue;
      await tx.contentBlock.upsert({
        where: { key: block.key },
        update: {
          label: block.label,
          value: block.value,
          type: block.type,
          group: block.group,
          sortOrder,
          defaultValue: block.value,
        },
        create: { ...block, sortOrder, defaultValue: block.value },
      });
    }

    await tx.project.updateMany({
      where: { featured: true },
      data: { featured: false, featuredOrder: null },
    });

    for (const project of flagshipProjects) {
      const data = {
        title: project.title,
        domain: project.domain,
        category: project.category,
        iconKey: project.iconKey,
        shortDescription: project.shortDescription,
        fullDescription: project.fullDescription,
        techStack: project.techStack,
        repoUrl: `${REPO_BASE}${project.repo}`,
        metrics: project.metrics ?? [],
        featured: true,
        featuredOrder: project.featuredOrder,
        ...(project.liveUrl !== undefined ? { liveUrl: project.liveUrl } : {}),
        ...(project.mediaType !== undefined
          ? {
              mediaType: project.mediaType,
              mediaUrl: project.mediaUrl ?? null,
              posterUrl: project.posterUrl ?? null,
              mediaAlt: project.mediaAlt ?? "",
            }
          : {}),
      };

      const result = await tx.project.updateMany({
        where: {
          OR: [{ slug: slugify(project.title) }, { title: project.title }],
        },
        data,
      });
      if (result.count !== 1) throw new Error(`Expected one project row for ${project.title}, found ${result.count}`);
    }

    await tx.siteSettings.update({
      where: { id: "singleton" },
      data: {
        roleTitle: siteSettings.roleTitle,
        availabilityText: siteSettings.availabilityText,
        resumePdfUrl: "/documents/adossi-fred-william-academic-resume.pdf",
        metaTitle: siteSettings.metaTitle,
        metaDescription: siteSettings.metaDescription,
      },
    });

    const cgpa = await tx.heroStat.updateMany({
      where: { label: "CGPA / 5.00" },
      data: { value: "4.14" },
    });
    if (cgpa.count !== 1) throw new Error(`Expected one CGPA statistic, found ${cgpa.count}`);

    const academic = educationItems[0];
    const education = await tx.educationItem.updateMany({
      where: { degree: academic.degree },
      data: { meta: academic.meta, grades: academic.grades, note: academic.note },
    });
    if (education.count !== 1) throw new Error(`Expected one Software Engineering education row, found ${education.count}`);
  }, { maxWait: 10_000, timeout: 60_000 });

  console.log(`Scholarship profile synced: ${flagshipProjects.length} flagship projects and CMS copy updated.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
