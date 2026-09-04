import { PrismaClient } from "@prisma/client";
import { REPO_BASE } from "../../src/config/site";
import { contentBlocks } from "../../src/content/copy";
import { educationItems, experience } from "../../src/content/cv";
import { DEFAULT_MEDIA_TYPE, projects } from "../../src/content/projects";
import { capabilities, domains, skillTiers } from "../../src/content/skills";
import { heroStats, infoLists, siteSettings } from "../../src/content/settings";
import { slugify } from "../../src/lib/slug";

const prisma = new PrismaClient();

function expectOne(label: string, count: number) {
  if (count !== 1) throw new Error(`Expected one ${label} row, found ${count}`);
}

async function main() {
  const tooLong = projects.filter((project) => project.shortDescription.length > 180);
  if (tooLong.length > 0) {
    throw new Error(`Project summaries over 180 characters: ${tooLong.map((project) => project.title).join(", ")}`);
  }

  await prisma.$transaction(
    async (tx) => {
      for (const [sortOrder, block] of contentBlocks.entries()) {
        await tx.contentBlock.upsert({
          where: { key: block.key },
          update: { ...block, sortOrder, defaultValue: block.value },
          create: { ...block, sortOrder, defaultValue: block.value },
        });
      }

      for (const [sortOrder, project] of projects.entries()) {
        const result = await tx.project.updateMany({
          where: { OR: [{ slug: slugify(project.title) }, { title: project.title }] },
          data: {
            title: project.title,
            domain: project.domain,
            category: project.category,
            iconKey: project.iconKey,
            shortDescription: project.shortDescription,
            fullDescription: project.fullDescription,
            techStack: project.techStack,
            repoUrl: `${REPO_BASE}${project.repo}`,
            liveUrl: project.liveUrl ?? null,
            metrics: project.metrics ?? [],
            mediaType: project.mediaType ?? DEFAULT_MEDIA_TYPE,
            mediaUrl: project.mediaUrl ?? null,
            posterUrl: project.posterUrl ?? null,
            mediaAlt: project.mediaAlt ?? "",
            featured: project.featuredOrder !== undefined,
            featuredOrder: project.featuredOrder ?? null,
            published: true,
            sortOrder,
          },
        });
        expectOne(`project for ${project.title}`, result.count);
      }

      for (const [sortOrder, item] of experience.entries()) {
        const result = await tx.experience.updateMany({
          where: { sortOrder },
          data: { ...item },
        });
        expectOne(`experience at position ${sortOrder}`, result.count);
      }

      for (const [sortOrder, item] of capabilities.entries()) {
        const result = await tx.capability.updateMany({
          where: { sortOrder },
          data: { ...item },
        });
        expectOne(`capability at position ${sortOrder}`, result.count);
      }

      for (const [sortOrder, item] of domains.entries()) {
        const result = await tx.domain.updateMany({
          where: { sortOrder },
          data: { ...item },
        });
        expectOne(`interest at position ${sortOrder}`, result.count);
      }

      for (const [sortOrder, item] of skillTiers.entries()) {
        const result = await tx.skillTier.updateMany({
          where: { sortOrder },
          data: { name: item.name, subtitle: item.subtitle, level: item.level },
        });
        expectOne(`skill tier at position ${sortOrder}`, result.count);
      }

      for (const [sortOrder, item] of infoLists.entries()) {
        const result = await tx.infoList.updateMany({
          where: { sortOrder },
          data: { ...item },
        });
        expectOne(`personal information card at position ${sortOrder}`, result.count);
      }

      for (const [sortOrder, item] of heroStats.entries()) {
        const result = await tx.heroStat.updateMany({
          where: { sortOrder },
          data: { ...item },
        });
        expectOne(`hero statistic at position ${sortOrder}`, result.count);
      }

      const academic = educationItems[0];
      const educationResult = await tx.educationItem.updateMany({
        where: { sortOrder: 0 },
        data: {
          degree: academic.degree,
          institution: academic.institution,
          period: academic.period,
          iconKey: academic.iconKey,
          meta: academic.meta,
          grades: academic.grades,
          note: academic.note,
        },
      });
      expectOne("education", educationResult.count);

      await tx.siteSettings.update({
        where: { id: "singleton" },
        data: {
          roleTitle: siteSettings.roleTitle,
          availabilityText: siteSettings.availabilityText,
          metaTitle: siteSettings.metaTitle,
          metaDescription: siteSettings.metaDescription,
        },
      });
    },
    { maxWait: 10_000, timeout: 60_000 },
  );

  console.log(`Personal site profile synced: ${projects.length} projects, ${contentBlocks.length} copy blocks, and supporting profile data updated.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
