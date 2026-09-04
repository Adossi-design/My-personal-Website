import { BlockType } from "@prisma/client";

// Every piece of prose the public site renders, keyed by the path the renderer asks for.
export type SeedBlock = {
  key: string;
  label: string;
  value: string;
  type: BlockType;
  group: string;
};

export const contentBlocks: SeedBlock[] = [
  // ---------------------------------------------------------------- hero
  {
    key: "hero.headline.lead",
    label: "Hero headline, first line",
    value: "AI Research Engineer",
    type: BlockType.TEXT,
    group: "hero",
  },
  {
    key: "hero.headline.joiner",
    label: "Hero headline, joining word",
    value: "in",
    type: BlockType.TEXT,
    group: "hero",
  },
  {
    key: "hero.headline.highlight",
    label: "Hero headline, gradient line",
    value: "the making",
    type: BlockType.TEXT,
    group: "hero",
  },
  {
    key: "hero.lede",
    label: "Hero lede",
    value:
      "I investigate meaningful problems and turn research into responsible, reliable AI systems, with a particular interest in healthcare and agriculture across African contexts.",
    type: BlockType.TEXTAREA,
    group: "hero",
  },
  {
    key: "hero.body",
    label: "Hero paragraph",
    value:
      "I am a Software Engineering student from Chad, studying in Rwanda and building toward a career that combines the curiosity and rigour of research with the practical discipline of engineering. I begin with the people affected, test ideas honestly, and work to carry useful findings beyond a notebook into systems that can operate in the real world.",
    type: BlockType.TEXTAREA,
    group: "hero",
  },
  {
    key: "hero.cta.primary",
    label: "Hero primary button",
    value: "Explore my research direction",
    type: BlockType.TEXT,
    group: "hero",
  },
  {
    key: "hero.cta.secondary",
    label: "Hero projects button",
    value: "View projects",
    type: BlockType.TEXT,
    group: "hero",
  },
  {
    key: "hero.cta.tertiary",
    label: "Hero academic profile button",
    value: "Academic profile",
    type: BlockType.TEXT,
    group: "hero",
  },

  // ---------------------------------------------------------------- journey
  {
    key: "journey.eyebrow",
    label: "Journey eyebrow",
    value: "The path behind the work",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.title",
    label: "Journey heading",
    value: "A journey shaped by applied knowledge",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.subtitle",
    label: "Journey introduction",
    value:
      "The problems I want to investigate are connected to places, people, and experiences that taught me what technology can change—and what it cannot solve without listening first.",
    type: BlockType.TEXTAREA,
    group: "journey",
  },
  {
    key: "journey.step1.place",
    label: "Journey step 1 place",
    value: "N'Djamena, Chad · Foundation",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step1.title",
    label: "Journey step 1 title",
    value: "Watching knowledge change a family's circumstances",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step1.body",
    label: "Journey step 1 body",
    value:
      "My father used his software knowledge to solve a supermarket's financial-management problem. The opportunity that followed changed our family and taught me that education becomes powerful when it is made useful to others.",
    type: BlockType.TEXTAREA,
    group: "journey",
  },
  {
    key: "journey.step2.place",
    label: "Journey step 2 place",
    value: "Moundou, Chad · 2019–2023",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step2.title",
    label: "Journey step 2 title",
    value: "Learning agricultural problems before designing solutions",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step2.body",
    label: "Journey step 2 body",
    value:
      "Four years of farm work showed me how disease, weather, missing records, and limited information shape a farmer's decisions. Food security became a lived question rather than an abstract technology theme.",
    type: BlockType.TEXTAREA,
    group: "journey",
  },
  {
    key: "journey.step3.place",
    label: "Journey step 3 place",
    value: "Kigali, Rwanda · 2024–Present",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step3.title",
    label: "Journey step 3 title",
    value: "Building the engineering foundation",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step3.body",
    label: "Journey step 3 body",
    value:
      "At African Leadership University, and through internships, field research, and client work, I learned to connect models with interfaces, APIs, databases, deployment, evaluation, and the people expected to use the result.",
    type: BlockType.TEXTAREA,
    group: "journey",
  },
  {
    key: "journey.step4.place",
    label: "Journey step 4 place",
    value: "Chad · Cameroon · Rwanda",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step4.title",
    label: "Journey step 4 title",
    value: "Growing by helping others grow",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step4.body",
    label: "Journey step 4 body",
    value:
      "The AI Study Lab grew from twelve to more than thirty participants across three countries. Redesigning it around how members actually learned reinforced a principle I bring to research: listen to reality, especially when it challenges the first solution.",
    type: BlockType.TEXTAREA,
    group: "journey",
  },
  {
    key: "journey.thesis.title",
    label: "Journey conclusion title",
    value: "The direction",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.thesis.body",
    label: "Journey conclusion body",
    value:
      "Become an AI Research Engineer who can investigate meaningful African problems rigorously, translate validated research into dependable systems, and eventually build an institution that enables others to do the same.",
    type: BlockType.TEXTAREA,
    group: "journey",
  },

  // ---------------------------------------------------------------- about
  { key: "about.eyebrow", label: "About eyebrow", value: "About", type: BlockType.TEXT, group: "about" },
  {
    key: "about.title",
    label: "About heading",
    value: "I begin with the problem, not the technology",
    type: BlockType.TEXT,
    group: "about",
  },
  {
    key: "about.subtitle",
    label: "About subheading",
    value:
      "A model or application matters only when the problem is understood, the evidence is honest, and the result is useful to the people it was intended to serve.",
    type: BlockType.TEXTAREA,
    group: "about",
  },
  {
    key: "about.body1",
    label: "About paragraph 1",
    value:
      "I am **Adossi Fred William**, a Software Engineering student at African Leadership University and an aspiring AI Research Engineer. For each project, I ask who experiences the problem, why existing approaches fall short, and what evidence would show that a proposed solution is actually useful.",
    type: BlockType.MARKDOWN,
    group: "about",
  },
  {
    key: "about.body2",
    label: "About paragraph 2, behind Read more",
    value:
      "My strongest interests are responsible and resource-efficient AI for healthcare and agriculture. Both fields have shown me why a strong benchmark is not the same as real-world impact: useful systems must account for uncertainty, local data, human expertise, connectivity, affordability, safety, and the consequences of being wrong.",
    type: BlockType.MARKDOWN,
    group: "about",
  },
  {
    key: "about.body3",
    label: "About paragraph 3, behind Read more",
    value:
      "Programming languages, frameworks, and models remain important tools, but they are not the story by themselves. I want my work to connect careful questions, reproducible experiments, transparent limitations, thoughtful engineering, and evaluation with the people a system claims it can help.",
    type: BlockType.MARKDOWN,
    group: "about",
  },
  {
    key: "about.readMore",
    label: "About Read more label",
    value: "Read more",
    type: BlockType.TEXT,
    group: "about",
  },
  {
    key: "about.domains.eyebrow",
    label: "Domains strip eyebrow",
    value: "Domains I have built in",
    type: BlockType.TEXT,
    group: "about",
  },

  // ---------------------------------------------------------------- what I do
  { key: "what.eyebrow", label: "What I do eyebrow", value: "What I do", type: BlockType.TEXT, group: "what" },
  {
    key: "what.title",
    label: "What I do heading",
    value: "Engineering that runs the whole way through",
    type: BlockType.TEXT,
    group: "what",
  },
  {
    key: "what.subtitle",
    label: "What I do subheading",
    value:
      "I work across the entire lifecycle of a product, from shaping its architecture and writing the code through to deploying it in a way that can genuinely scale.",
    type: BlockType.TEXTAREA,
    group: "what",
  },

  // ---------------------------------------------------------------- skills
  { key: "skills.eyebrow", label: "Skills eyebrow", value: "Toolkit", type: BlockType.TEXT, group: "skills" },
  {
    key: "skills.title",
    label: "Skills heading",
    value: "Technical skills",
    type: BlockType.TEXT,
    group: "skills",
  },
  {
    key: "skills.subtitle",
    label: "Skills subheading",
    value:
      "I have grouped these by how far I have actually taken each one, from tools I have shipped to real users, through the ones I have built and evaluated inside projects, to the ones I am actively learning right now.",
    type: BlockType.TEXTAREA,
    group: "skills",
  },

  // ---------------------------------------------------------------- projects
  { key: "projects.eyebrow", label: "Projects eyebrow", value: "Portfolio", type: BlockType.TEXT, group: "projects" },
  {
    key: "projects.title",
    label: "Projects heading, homepage",
    value: "Selected projects",
    type: BlockType.TEXT,
    group: "projects",
  },
  {
    key: "projects.subtitle",
    label: "Projects subheading, homepage",
    value:
      "These case studies begin with the problem and the people a solution is intended to serve, then separate technical evidence, current limitations, intended impact, and the next question still worth investigating.",
    type: BlockType.TEXTAREA,
    group: "projects",
  },
  {
    key: "projects.viewAll",
    label: "View all projects button",
    value: "View all projects",
    type: BlockType.TEXT,
    group: "projects",
  },
  {
    key: "projects.index.title",
    label: "Projects heading, index page",
    value: "Every project",
    type: BlockType.TEXT,
    group: "projects",
  },
  {
    key: "projects.index.subtitle",
    label: "Projects subheading, index page",
    value:
      "The wider engineering record across machine learning, mobile, full-stack, backend, and cloud work. The six flagship projects include deeper, evidence-led case studies; the rest document the foundation beneath them.",
    type: BlockType.TEXTAREA,
    group: "projects",
  },
  {
    key: "projects.coursework.title",
    label: "Coursework card heading",
    value: "Coursework and foundations",
    type: BlockType.TEXT,
    group: "projects",
  },
  {
    key: "projects.coursework.body",
    label: "Coursework card paragraph",
    value:
      "Beyond the projects I have chosen to feature, my GitHub keeps the fuller record of my engineering training at ALU, which reaches into areas such as DevOps, shell scripting, back-end and front-end work, regular expressions, and lower-level programming, and each item below opens its own repository.",
    type: BlockType.TEXTAREA,
    group: "projects",
  },

  // ---------------------------------------------------------------- research and future vision
  {
    key: "research.eyebrow",
    label: "Research eyebrow",
    value: "Research direction",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.title",
    label: "Research heading",
    value: "From meaningful questions to systems that work",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.subtitle",
    label: "Research introduction",
    value:
      "My goal is to become an AI Research Engineer, combining the curiosity and rigour of a researcher with the practical discipline of an engineer to investigate important problems and translate validated ideas into responsible, reliable systems.",
    type: BlockType.TEXTAREA,
    group: "research",
  },
  {
    key: "research.pillar.problem.title",
    label: "Problem-first pillar title",
    value: "Begin with the problem",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.pillar.problem.body",
    label: "Problem-first pillar body",
    value:
      "Understand who is affected, listen to the realities around them, and ask which questions are genuinely worth investigating before choosing a technology.",
    type: BlockType.TEXTAREA,
    group: "research",
  },
  {
    key: "research.pillar.rigour.title",
    label: "Rigour pillar title",
    value: "Investigate with rigour",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.pillar.rigour.body",
    label: "Rigour pillar body",
    value:
      "Design careful experiments, evaluate uncertainty and failure, compare approaches honestly, and make the evidence reproducible rather than chasing an impressive result alone.",
    type: BlockType.TEXTAREA,
    group: "research",
  },
  {
    key: "research.pillar.translation.title",
    label: "Translation pillar title",
    value: "Engineer for real use",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.pillar.translation.body",
    label: "Translation pillar body",
    value:
      "Turn sound research into accessible software that can operate reliably within the constraints of the people and environments it is intended to serve.",
    type: BlockType.TEXTAREA,
    group: "research",
  },
  {
    key: "research.vision.kicker",
    label: "Future vision label",
    value: "Long-term vision",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.vision.title",
    label: "Future vision heading",
    value: "Beral Research & Technology Institute",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.vision.body",
    label: "Future vision body",
    value:
      "I hope to establish BRTI as an African research and technology organisation where researchers, AI and software engineers, healthcare professionals, agricultural experts, entrepreneurs, and communities investigate real challenges together and transform rigorous research into practical solutions.",
    type: BlockType.TEXTAREA,
    group: "research",
  },
  {
    key: "research.vision.focus1",
    label: "Future focus 1",
    value: "Responsible AI",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.vision.focus2",
    label: "Future focus 2",
    value: "Healthcare",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.vision.focus3",
    label: "Future focus 3",
    value: "Agriculture",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.vision.focus4",
    label: "Future focus 4",
    value: "Research capacity",
    type: BlockType.TEXT,
    group: "research",
  },

  // ---------------------------------------------------------------- experience
  { key: "experience.eyebrow", label: "Experience eyebrow", value: "Journey", type: BlockType.TEXT, group: "experience" },
  {
    key: "experience.title",
    label: "Experience heading",
    value: "Professional experience",
    type: BlockType.TEXT,
    group: "experience",
  },
  {
    key: "experience.subtitle",
    label: "Experience subheading",
    value:
      "A path that has carried me through machine learning, data work, field research, and the delivery of real products for real clients.",
    type: BlockType.TEXTAREA,
    group: "experience",
  },

  // ---------------------------------------------------------------- education
  { key: "education.eyebrow", label: "Education eyebrow", value: "Learning", type: BlockType.TEXT, group: "education" },
  {
    key: "education.title",
    label: "Education heading",
    value: "Education and certifications",
    type: BlockType.TEXT,
    group: "education",
  },
  {
    key: "education.subtitle",
    label: "Education subheading",
    value:
      "A foundation of formal study at university, supported by a habit of continuously learning on my own.",
    type: BlockType.TEXTAREA,
    group: "education",
  },
  {
    key: "education.certifications.title",
    label: "Certifications card heading",
    value: "Certifications",
    type: BlockType.TEXT,
    group: "education",
  },
  {
    key: "education.profileCta",
    label: "Academic profile button",
    value: "View academic profile",
    type: BlockType.TEXT,
    group: "education",
  },
  {
    key: "education.transcriptCta",
    label: "Transcript button",
    value: "View unofficial transcript",
    type: BlockType.TEXT,
    group: "education",
  },

  // ---------------------------------------------------------------- contact
  { key: "contact.eyebrow", label: "Contact eyebrow", value: "Get in touch", type: BlockType.TEXT, group: "contact" },
  {
    key: "contact.heading",
    label: "Contact heading",
    value: "Let us investigate a problem worth solving",
    type: BlockType.TEXT,
    group: "contact",
  },
  {
    key: "contact.body",
    label: "Contact paragraph",
    value:
      "I welcome conversations with researchers, scholarship programmes, engineers, healthcare and agricultural professionals, and communities working on responsible AI. If you are investigating a meaningful problem—or can help challenge one of my assumptions—I would be glad to learn from you and explore what rigorous collaboration could make possible.",
    type: BlockType.TEXTAREA,
    group: "contact",
  },

  // ---------------------------------------------------------------- footer
  {
    key: "footer.text",
    label: "Footer line, after the year and name",
    value: "Software Engineer and Machine Learning Engineer · Kigali, Rwanda",
    type: BlockType.TEXT,
    group: "footer",
  },

  // ---------------------------------------------------------------- navigation
  { key: "nav.about", label: "Nav label, About", value: "About", type: BlockType.TEXT, group: "nav" },
  { key: "nav.journey", label: "Nav label, Journey", value: "Journey", type: BlockType.TEXT, group: "nav" },
  { key: "nav.what", label: "Nav label, What I Do", value: "What I Do", type: BlockType.TEXT, group: "nav" },
  { key: "nav.skills", label: "Nav label, Skills", value: "Skills", type: BlockType.TEXT, group: "nav" },
  { key: "nav.projects", label: "Nav label, Projects", value: "Projects", type: BlockType.TEXT, group: "nav" },
  { key: "nav.research", label: "Nav label, Research", value: "Research", type: BlockType.TEXT, group: "nav" },
  { key: "nav.experience", label: "Nav label, Experience", value: "Experience", type: BlockType.TEXT, group: "nav" },
  { key: "nav.contact", label: "Nav label, Contact", value: "Contact", type: BlockType.TEXT, group: "nav" },
];
