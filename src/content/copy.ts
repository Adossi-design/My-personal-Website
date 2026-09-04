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
    value: "Hello, I am Adossi.",
    type: BlockType.TEXT,
    group: "hero",
  },
  {
    key: "hero.headline.joiner",
    label: "Hero headline, joining word",
    value: "I build",
    type: BlockType.TEXT,
    group: "hero",
  },
  {
    key: "hero.headline.highlight",
    label: "Hero headline, gradient line",
    value: "meaningful technology",
    type: BlockType.TEXT,
    group: "hero",
  },
  {
    key: "hero.lede",
    label: "Hero lede",
    value:
      "I am a Software Engineering student, developer, and machine learning enthusiast from Chad, currently based in Kigali, Rwanda.",
    type: BlockType.TEXTAREA,
    group: "hero",
  },
  {
    key: "hero.body",
    label: "Hero paragraph",
    value:
      "Software engineering is my foundation. I use it to build useful products, explore machine learning, and grow toward a career that combines AI engineering with research. I care most about healthcare, agriculture, and education, but I am always curious about problems where technology can make everyday life better.",
    type: BlockType.TEXTAREA,
    group: "hero",
  },
  {
    key: "hero.cta.primary",
    label: "Hero primary button",
    value: "Get to know me",
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
    label: "Hero full profile button",
    value: "Full profile",
    type: BlockType.TEXT,
    group: "hero",
  },

  // ---------------------------------------------------------------- journey
  {
    key: "journey.eyebrow",
    label: "Journey eyebrow",
    value: "My journey",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.title",
    label: "Journey heading",
    value: "How I got here",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.subtitle",
    label: "Journey introduction",
    value:
      "My path has moved through family, farming, university, client work, machine learning, and community leadership. Each part has shaped the way I think about people and technology.",
    type: BlockType.TEXTAREA,
    group: "journey",
  },
  {
    key: "journey.step1.place",
    label: "Journey step 1 place",
    value: "N'Djamena, Chad · Early influence",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step1.title",
    label: "Journey step 1 title",
    value: "My first example of useful software",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step1.body",
    label: "Journey step 1 body",
    value:
      "I saw my father use his software knowledge to solve a financial management problem for a supermarket. The opportunity that followed helped our family and gave me an early example of how a practical skill can create real change.",
    type: BlockType.TEXTAREA,
    group: "journey",
  },
  {
    key: "journey.step2.place",
    label: "Journey step 2 place",
    value: "Moundou, Chad · 2019 to 2023",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step2.title",
    label: "Journey step 2 title",
    value: "Learning from farm work",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step2.body",
    label: "Journey step 2 body",
    value:
      "I spent four years working across family farm sites. I prepared land, operated tractors, harvested crops, and worked with local farmers. That experience is why agriculture is personal to me, not just a technology topic.",
    type: BlockType.TEXTAREA,
    group: "journey",
  },
  {
    key: "journey.step3.place",
    label: "Journey step 3 place",
    value: "Kigali, Rwanda · 2024 to present",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step3.title",
    label: "Journey step 3 title",
    value: "Studying, building, and finding my direction",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step3.body",
    label: "Journey step 3 body",
    value:
      "At African Leadership University, I found a strong foundation in software engineering. Internships, field research, and client projects then helped me move beyond coursework and learn how to take an idea from a conversation to a working product.",
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
    value: "Learning through community",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.step4.body",
    label: "Journey step 4 body",
    value:
      "I started the AI Study Lab to learn with other students. It grew from twelve to more than thirty participants across three countries. Mentoring students and listening to how they actually learn has made me more patient, practical, and open to changing my approach.",
    type: BlockType.TEXTAREA,
    group: "journey",
  },
  {
    key: "journey.thesis.title",
    label: "Journey conclusion title",
    value: "What connects these experiences",
    type: BlockType.TEXT,
    group: "journey",
  },
  {
    key: "journey.thesis.body",
    label: "Journey conclusion body",
    value:
      "I enjoy understanding how things work, building useful systems, and helping people grow. Today I am developing as a software engineer and machine learning practitioner. Over time, I want to become an AI Research Engineer who can study important problems and turn good research into practical tools.",
    type: BlockType.TEXTAREA,
    group: "journey",
  },

  // ---------------------------------------------------------------- about
  { key: "about.eyebrow", label: "About eyebrow", value: "About me", type: BlockType.TEXT, group: "about" },
  {
    key: "about.title",
    label: "About heading",
    value: "A student, builder, and lifelong learner",
    type: BlockType.TEXT,
    group: "about",
  },
  {
    key: "about.subtitle",
    label: "About subheading",
    value:
      "I am curious, practical, and ambitious about what technology can do. I also believe good work starts with listening, learning, and being honest about what still needs to improve.",
    type: BlockType.TEXTAREA,
    group: "about",
  },
  {
    key: "about.body1",
    label: "About paragraph 1",
    value:
      "I am **Adossi Fred William**, a Software Engineering student at African Leadership University. I am from Chad and now live in Kigali, Rwanda. I enjoy turning ideas into software, exploring machine learning, working with clients, and learning from people whose experiences are different from mine.",
    type: BlockType.MARKDOWN,
    group: "about",
  },
  {
    key: "about.body2",
    label: "About paragraph 2, behind Read more",
    value:
      "Healthcare and agriculture are the two areas I care about most. Agriculture connects to my own years of farm work, while healthcare has made me think carefully about access, safety, and the responsibility that comes with building tools people may depend on. Education matters to me too because learning changed my own possibilities, and I now enjoy helping other students find theirs.",
    type: BlockType.MARKDOWN,
    group: "about",
  },
  {
    key: "about.body3",
    label: "About paragraph 3, behind Read more",
    value:
      "Outside code, I enjoy basketball, strength training, drawing, public speaking, and entrepreneurship. The values I try to bring into my work are curiosity, consistency, honesty, respect for people, and the willingness to keep improving instead of pretending that a first version is perfect.",
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
    value: "What I care about",
    type: BlockType.TEXT,
    group: "about",
  },

  // ---------------------------------------------------------------- what I do
  { key: "what.eyebrow", label: "What I do eyebrow", value: "What I do", type: BlockType.TEXT, group: "what" },
  {
    key: "what.title",
    label: "What I do heading",
    value: "What I do and how I contribute",
    type: BlockType.TEXT,
    group: "what",
  },
  {
    key: "what.subtitle",
    label: "What I do subheading",
    value:
      "Software engineering is my base, but I enjoy working across products, data, machine learning, and people. These are the areas where I have built the most experience so far.",
    type: BlockType.TEXTAREA,
    group: "what",
  },

  // ---------------------------------------------------------------- skills
  { key: "skills.eyebrow", label: "Skills eyebrow", value: "Skills", type: BlockType.TEXT, group: "skills" },
  {
    key: "skills.title",
    label: "Skills heading",
    value: "Tools I use and skills I am growing",
    type: BlockType.TEXT,
    group: "skills",
  },
  {
    key: "skills.subtitle",
    label: "Skills subheading",
    value:
      "I have grouped these by experience. Some have been used in client work or deployed projects, some in coursework and experiments, and others are still part of what I am learning now.",
    type: BlockType.TEXTAREA,
    group: "skills",
  },

  // ---------------------------------------------------------------- projects
  { key: "projects.eyebrow", label: "Projects eyebrow", value: "My work", type: BlockType.TEXT, group: "projects" },
  {
    key: "projects.title",
    label: "Projects heading, homepage",
    value: "Things I have built",
    type: BlockType.TEXT,
    group: "projects",
  },
  {
    key: "projects.subtitle",
    label: "Projects subheading, homepage",
    value:
      "Each project started with a problem, a question, or something I wanted to understand better. I explain the reason behind the work first, then share what I built, what I learned, and where the idea could go next.",
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
    value: "Projects, experiments, and learning",
    type: BlockType.TEXT,
    group: "projects",
  },
  {
    key: "projects.index.subtitle",
    label: "Projects subheading, index page",
    value:
      "This is the wider record of what I have built while learning software engineering, mobile development, backend systems, machine learning, and AI. Some are complete products, some are experiments, and some show the foundations I learned along the way.",
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
      "My GitHub also keeps the smaller exercises and coursework that helped me build strong foundations. They cover frontend and backend development, DevOps, shell scripting, regular expressions, and other core engineering topics.",
    type: BlockType.TEXTAREA,
    group: "projects",
  },

  // ---------------------------------------------------------------- direction, interests, and future vision
  {
    key: "research.eyebrow",
    label: "Research eyebrow",
    value: "Direction and interests",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.title",
    label: "Research heading",
    value: "Where I am going",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.subtitle",
    label: "Research introduction",
    value:
      "Software engineering is where I started. Machine learning has become an important part of my work. My next step is to grow in AI engineering and research so I can investigate useful questions and turn what I learn into systems that work in real settings.",
    type: BlockType.TEXTAREA,
    group: "research",
  },
  {
    key: "research.pillar.problem.title",
    label: "Problem-first pillar title",
    value: "Software engineering is my foundation",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.pillar.problem.body",
    label: "Problem-first pillar body",
    value:
      "It taught me how to break down problems, design systems, work with data, test my ideas, and build products that other people can actually use.",
    type: BlockType.TEXTAREA,
    group: "research",
  },
  {
    key: "research.pillar.rigour.title",
    label: "Rigour pillar title",
    value: "Machine learning is a growing strength",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.pillar.rigour.body",
    label: "Rigour pillar body",
    value:
      "Through coursework and projects, I have worked with computer vision, prediction, clustering, time series, and model deployment. I am learning to evaluate results carefully and explain the limits clearly.",
    type: BlockType.TEXTAREA,
    group: "research",
  },
  {
    key: "research.pillar.translation.title",
    label: "Translation pillar title",
    value: "AI research engineering is my direction",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.pillar.translation.body",
    label: "Translation pillar body",
    value:
      "I want to combine research curiosity with strong engineering. That means asking useful questions, running careful experiments, and carrying the best ideas into reliable and accessible tools.",
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
      "One day, I hope to establish BRTI as an African research and technology organisation. I imagine a place where researchers, engineers, professionals, entrepreneurs, and young talent can study real problems, build useful technology, and train the next generation of African researchers and engineers.",
    type: BlockType.TEXTAREA,
    group: "research",
  },
  {
    key: "research.vision.focus1",
    label: "Future focus 1",
    value: "Healthcare",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.vision.focus2",
    label: "Future focus 2",
    value: "Agriculture",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.vision.focus3",
    label: "Future focus 3",
    value: "Education",
    type: BlockType.TEXT,
    group: "research",
  },
  {
    key: "research.vision.focus4",
    label: "Future focus 4",
    value: "African talent",
    type: BlockType.TEXT,
    group: "research",
  },

  // ---------------------------------------------------------------- experience
  { key: "experience.eyebrow", label: "Experience eyebrow", value: "Experience", type: BlockType.TEXT, group: "experience" },
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
      "I have learned in classrooms, internships, farms, client conversations, and team projects. Each experience has added a different part to the professional I am becoming.",
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
      "My university studies give me structure and strong foundations. Courses, certifications, personal projects, and communities help me keep learning beyond the classroom.",
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

  // ---------------------------------------------------------------- personal life, community, and entrepreneurship
  {
    key: "personal.eyebrow",
    label: "Personal section eyebrow",
    value: "Beyond the code",
    type: BlockType.TEXT,
    group: "personal",
  },
  {
    key: "personal.title",
    label: "Personal section heading",
    value: "Community, entrepreneurship, and the person behind the work",
    type: BlockType.TEXT,
    group: "personal",
  },
  {
    key: "personal.subtitle",
    label: "Personal section introduction",
    value:
      "Technology is only one part of my story. Leadership, business, sport, creativity, and helping other students have also shaped how I work and who I want to become.",
    type: BlockType.TEXTAREA,
    group: "personal",
  },

  // ---------------------------------------------------------------- contact
  { key: "contact.eyebrow", label: "Contact eyebrow", value: "Get in touch", type: BlockType.TEXT, group: "contact" },
  {
    key: "contact.heading",
    label: "Contact heading",
    value: "Let us build, learn, or solve something useful",
    type: BlockType.TEXT,
    group: "contact",
  },
  {
    key: "contact.body",
    label: "Contact paragraph",
    value:
      "I am open to conversations with employers, researchers, professors, clients, founders, students, and collaborators. You can contact me about software projects, machine learning, research ideas, community work, or a problem you think we could explore together.",
    type: BlockType.TEXTAREA,
    group: "contact",
  },

  // ---------------------------------------------------------------- footer
  {
    key: "footer.text",
    label: "Footer line, after the year and name",
    value: "Student, software builder, and machine learning enthusiast · Kigali, Rwanda",
    type: BlockType.TEXT,
    group: "footer",
  },

  // ---------------------------------------------------------------- navigation
  { key: "nav.about", label: "Nav label, About", value: "About", type: BlockType.TEXT, group: "nav" },
  { key: "nav.journey", label: "Nav label, Journey", value: "Journey", type: BlockType.TEXT, group: "nav" },
  { key: "nav.what", label: "Nav label, What I Do", value: "What I Do", type: BlockType.TEXT, group: "nav" },
  { key: "nav.skills", label: "Nav label, Skills", value: "Skills", type: BlockType.TEXT, group: "nav" },
  { key: "nav.projects", label: "Nav label, Projects", value: "Projects", type: BlockType.TEXT, group: "nav" },
  { key: "nav.research", label: "Nav label, Direction", value: "Direction", type: BlockType.TEXT, group: "nav" },
  { key: "nav.experience", label: "Nav label, Experience", value: "Experience", type: BlockType.TEXT, group: "nav" },
  { key: "nav.contact", label: "Nav label, Contact", value: "Contact", type: BlockType.TEXT, group: "nav" },
];
