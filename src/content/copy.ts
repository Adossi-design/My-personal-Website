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
    value: "Software Engineer",
    type: BlockType.TEXT,
    group: "hero",
  },
  {
    key: "hero.headline.joiner",
    label: "Hero headline, joining word",
    value: "and",
    type: BlockType.TEXT,
    group: "hero",
  },
  {
    key: "hero.headline.highlight",
    label: "Hero headline, gradient line",
    value: "Machine Learning Engineer",
    type: BlockType.TEXT,
    group: "hero",
  },
  {
    key: "hero.lede",
    label: "Hero lede",
    value:
      "I build software systems that are dependable enough to run in production and intelligent enough to make a real difference for the people who use them.",
    type: BlockType.TEXTAREA,
    group: "hero",
  },
  {
    key: "hero.body",
    label: "Hero paragraph",
    value:
      "My work brings together software engineering, machine learning, and modern cloud technology, which lets me take an idea all the way through to a working system people can rely on. Whether a project calls for a trained machine learning model, a backend built to grow alongside its users, or a mobile and web experience, I enjoy turning something complicated into a product that feels effortless to use.",
    type: BlockType.TEXTAREA,
    group: "hero",
  },
  {
    key: "hero.cta.primary",
    label: "Hero primary button",
    value: "View my work",
    type: BlockType.TEXT,
    group: "hero",
  },
  {
    key: "hero.cta.secondary",
    label: "Hero GitHub button",
    value: "GitHub",
    type: BlockType.TEXT,
    group: "hero",
  },
  {
    key: "hero.cta.tertiary",
    label: "Hero contact button",
    value: "Contact",
    type: BlockType.TEXT,
    group: "hero",
  },

  // ---------------------------------------------------------------- about
  { key: "about.eyebrow", label: "About eyebrow", value: "About", type: BlockType.TEXT, group: "about" },
  {
    key: "about.title",
    label: "About heading",
    value: "I specialise in building software",
    type: BlockType.TEXT,
    group: "about",
  },
  {
    key: "about.subtitle",
    label: "About subheading",
    value:
      "What defines my work is not the industry it happens to serve, but the care and craft that go into how the software itself is engineered.",
    type: BlockType.TEXTAREA,
    group: "about",
  },
  {
    key: "about.body1",
    label: "About paragraph 1",
    value:
      "I am **Adossi Fred William**, a Software Engineering student at African Leadership University, and a great deal of my energy goes into machine learning, full-stack development, backend engineering, and mobile development. What I enjoy most is taking a difficult technical problem and working through it patiently until it becomes software that ordinary people can pick up and use without having to think about what is happening underneath.",
    type: BlockType.MARKDOWN,
    group: "about",
  },
  {
    key: "about.body2",
    label: "About paragraph 2, behind Read more",
    value:
      "For me, software engineering has always meant a good deal more than writing code, because the harder and far more rewarding part is designing systems that can grow, that remain easy to maintain as the years pass, and that genuinely solve a problem worth solving. I try to pair thoughtful architecture with machine learning that has been tested against reality, so that the products I build hold up on a technical level while still being useful to the person sitting on the other side of the screen. The work gathered here reflects that range, moving from healthcare systems and financial technology platforms to developer collaboration tools, analytics dashboards, mobile applications, prediction models, agricultural technology, and web applications that are ready for production.",
    type: BlockType.MARKDOWN,
    group: "about",
  },
  {
    key: "about.body3",
    label: "About paragraph 3, behind Read more",
    value:
      "Whatever the domain happens to be, whether it is healthcare, finance, education, agriculture, productivity, or tooling for other developers, my approach does not really change, because I still begin by designing the right architecture, I still care deeply about writing code that stays clean and maintainable, and I still measure the result by whether it can be deployed at scale and whether it makes a real difference for the people it was built for.",
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
      "Selected from more than forty public repositories, these span machine learning, mobile, full-stack, backend, and cloud work, and each card links straight to its source code. Press More on any card to read the full story.",
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
      "The full record, spanning machine learning, mobile, full-stack, backend, and cloud work. Filter by category, and open any card to read the full story behind it.",
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

  // ---------------------------------------------------------------- contact
  { key: "contact.eyebrow", label: "Contact eyebrow", value: "Get in touch", type: BlockType.TEXT, group: "contact" },
  {
    key: "contact.heading",
    label: "Contact heading",
    value: "Let us build something intelligent and lasting",
    type: BlockType.TEXT,
    group: "contact",
  },
  {
    key: "contact.body",
    label: "Contact paragraph",
    value:
      "What keeps me engaged is the chance to build software that is intelligent, that can scale gracefully, and that leaves a lasting mark, and I try to create technology that answers the problems in front of us now while remaining ready for the ones that are still to come. If you are working on something ambitious, or you are putting together a team that wants to build software which genuinely endures, I would be very glad to hear from you and to be part of it.",
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
  { key: "nav.what", label: "Nav label, What I Do", value: "What I Do", type: BlockType.TEXT, group: "nav" },
  { key: "nav.skills", label: "Nav label, Skills", value: "Skills", type: BlockType.TEXT, group: "nav" },
  { key: "nav.projects", label: "Nav label, Projects", value: "Projects", type: BlockType.TEXT, group: "nav" },
  { key: "nav.experience", label: "Nav label, Experience", value: "Experience", type: BlockType.TEXT, group: "nav" },
  { key: "nav.contact", label: "Nav label, Contact", value: "Contact", type: BlockType.TEXT, group: "nav" },
];
