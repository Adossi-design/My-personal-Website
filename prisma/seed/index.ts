import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { uniqueSlug } from "../../src/lib/slug";
import { REPO_BASE } from "../../src/config/site";
import { DEFAULT_MEDIA_TYPE, projects } from "../../src/content/projects";
import { contentBlocks } from "../../src/content/copy";
import { certifications, educationItems, experience } from "../../src/content/cv";
import { capabilities, domains, skillTiers } from "../../src/content/skills";
import { courseworkItems, heroStats, infoLists, siteSettings } from "../../src/content/settings";

const prisma = new PrismaClient();

const BCRYPT_COST = 12;

// Fails loudly rather than letting Postgres truncate or reject a card line mid-run.
function assertShortDescriptions() {
  const tooLong = projects.filter((p) => p.shortDescription.length > 180);
  if (tooLong.length > 0) {
    throw new Error(
      `shortDescription over 180 chars: ${tooLong.map((p) => `${p.title} (${p.shortDescription.length})`).join(", ")}`,
    );
  }
}

async function seedProjects() {
  const taken = new Set<string>();
  for (const [index, p] of projects.entries()) {
    const slug = uniqueSlug(p.title, taken);
    taken.add(slug);
    const data = {
      title: p.title,
      domain: p.domain,
      category: p.category,
      iconKey: p.iconKey,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription,
      mediaType: DEFAULT_MEDIA_TYPE,
      mediaAlt: "",
      techStack: p.techStack,
      repoUrl: `${REPO_BASE}${p.repo}`,
      liveUrl: p.liveUrl ?? null,
      metrics: p.metrics ?? [],
      featured: p.featuredOrder !== undefined,
      featuredOrder: p.featuredOrder ?? null,
      published: true,
      sortOrder: index,
    };
    await prisma.project.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  }
  return taken.size;
}

async function seedContent() {
  for (const [index, block] of contentBlocks.entries()) {
    await prisma.contentBlock.upsert({
      where: { key: block.key },
      // Only the label, type, grouping and seeded original are refreshed, so a
      // re-run never overwrites copy that has since been edited in the admin.
      update: {
        label: block.label,
        type: block.type,
        group: block.group,
        sortOrder: index,
        defaultValue: block.value,
      },
      create: {
        key: block.key,
        label: block.label,
        value: block.value,
        type: block.type,
        group: block.group,
        sortOrder: index,
        defaultValue: block.value,
      },
    });
  }
  return contentBlocks.length;
}

async function seedExperience() {
  await prisma.experience.deleteMany();
  for (const [index, e] of experience.entries()) {
    await prisma.experience.create({ data: { ...e, sortOrder: index } });
  }
  return experience.length;
}

async function seedEducation() {
  await prisma.educationItem.deleteMany();
  for (const [index, e] of educationItems.entries()) {
    await prisma.educationItem.create({ data: { ...e, sortOrder: index } });
  }
  await prisma.certification.deleteMany();
  for (const [index, c] of certifications.entries()) {
    await prisma.certification.create({ data: { ...c, sortOrder: index } });
  }
  return { education: educationItems.length, certs: certifications.length };
}

async function seedSkills() {
  await prisma.skillTier.deleteMany();
  let itemCount = 0;
  for (const [index, tier] of skillTiers.entries()) {
    await prisma.skillTier.create({
      data: {
        name: tier.name,
        subtitle: tier.subtitle,
        level: tier.level,
        sortOrder: index,
        items: {
          create: tier.items.map((name, i) => ({ name, sortOrder: i })),
        },
      },
    });
    itemCount += tier.items.length;
  }
  return { tiers: skillTiers.length, items: itemCount };
}

async function seedCards() {
  await prisma.capability.deleteMany();
  for (const [index, c] of capabilities.entries()) {
    await prisma.capability.create({ data: { ...c, sortOrder: index } });
  }
  await prisma.domain.deleteMany();
  for (const [index, d] of domains.entries()) {
    await prisma.domain.create({ data: { ...d, sortOrder: index } });
  }
  await prisma.heroStat.deleteMany();
  for (const [index, s] of heroStats.entries()) {
    await prisma.heroStat.create({ data: { ...s, sortOrder: index } });
  }
  await prisma.courseworkItem.deleteMany();
  for (const [index, c] of courseworkItems.entries()) {
    await prisma.courseworkItem.create({ data: { ...c, sortOrder: index } });
  }
  await prisma.infoList.deleteMany();
  for (const [index, l] of infoLists.entries()) {
    await prisma.infoList.create({ data: { ...l, sortOrder: index } });
  }
  return {
    capabilities: capabilities.length,
    domains: domains.length,
    stats: heroStats.length,
    coursework: courseworkItems.length,
    infoLists: infoLists.length,
  };
}

async function seedSettings() {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", ...siteSettings },
  });
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!email || !password) {
    console.warn("  admin user skipped, set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    return null;
  }
  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters");
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);
  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { hashedPassword, name },
    create: { email: email.toLowerCase(), hashedPassword, name },
  });
  return user.email;
}

async function main() {
  console.log("Seeding database");
  assertShortDescriptions();

  const projectCount = await seedProjects();
  console.log(`  projects: ${projectCount}`);

  const blockCount = await seedContent();
  console.log(`  content blocks: ${blockCount}`);

  const expCount = await seedExperience();
  console.log(`  experience: ${expCount}`);

  const edu = await seedEducation();
  console.log(`  education: ${edu.education}, certifications: ${edu.certs}`);

  const skills = await seedSkills();
  console.log(`  skill tiers: ${skills.tiers}, skill items: ${skills.items}`);

  const cards = await seedCards();
  console.log(
    `  capabilities: ${cards.capabilities}, domains: ${cards.domains}, hero stats: ${cards.stats}, coursework: ${cards.coursework}, info lists: ${cards.infoLists}`,
  );

  await seedSettings();
  console.log("  site settings: 1");

  const adminEmail = await seedAdmin();
  if (adminEmail) console.log(`  admin user: ${adminEmail}`);

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
