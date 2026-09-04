// Three tiers, where level is how many of the ten bar segments are filled.
export const skillTiers = [
  {
    name: "Used in client work and deployed projects",
    subtitle: "tools I have used beyond the classroom",
    level: 10,
    items: [
      "Python",
      "JavaScript ES6+",
      "TypeScript",
      "Flutter",
      "Dart",
      "React",
      "Next.js",
      "Node.js",
      "FastAPI",
      "Firebase",
      "Firestore",
      "Riverpod",
      "Google Maps SDK",
      "Docker",
      "Streamlit",
      "HTML5",
      "CSS3",
      "Tailwind",
      "SQL",
      "MySQL",
      "SQLite",
      "Git",
      "Linux",
      "Nginx",
      "XML processing",
    ],
  },
  {
    name: "Used in projects and experiments",
    subtitle: "tools I have applied while building and learning",
    level: 6,
    items: [
      "TensorFlow",
      "Keras",
      "scikit-learn",
      "CNN",
      "LSTM",
      "VGG16",
      "ResNet50",
      "MobileNetV2",
      "XGBoost",
      "Random Forest",
      "Logistic Regression",
      "K-Means",
      "PCA",
      "SHAP",
      "LIME",
      "pandas",
      "NumPy",
      "librosa",
      "NestJS",
      "Prisma",
      "Socket.IO",
      "Clerk",
      "Turborepo",
      "Flask",
      "PostgreSQL",
      "REST API design",
      "JWT auth",
      "GitHub Actions",
      "Postman",
      "R",
    ],
  },
  {
    name: "Currently learning",
    subtitle: "skills I am still developing",
    level: 3,
    items: ["PyTorch", "CRNN", "Django", "GraphQL", "USSD gateway integration", "MLOps tooling"],
  },
];

// The six "What I do" cards.
export const capabilities = [
  {
    title: "Software Engineering",
    iconKey: "🏗️",
    description:
      "This is my foundation. I enjoy breaking a problem into smaller parts, designing a clear structure, writing maintainable code, testing it, and learning from the way people use the result.",
  },
  {
    title: "Machine Learning",
    iconKey: "🧠",
    description:
      "I work with data preparation, model training, evaluation, and deployment. I am especially interested in computer vision and predictive systems, while staying honest about what a model can and cannot prove.",
  },
  {
    title: "Full-Stack Development",
    iconKey: "🌐",
    description:
      "I build web applications from the interface to the backend and database. I like seeing a complete product come together and making sure the experience is clear for the person using it.",
  },
  {
    title: "Mobile Development",
    iconKey: "📱",
    description:
      "I use Flutter and Firebase to create mobile experiences that work across platforms. My focus is on simple navigation, useful features, and a structure that can grow with the product.",
  },
  {
    title: "Backend Engineering",
    iconKey: "⚙️",
    description:
      "I build APIs, authentication flows, databases, and services with Python and JavaScript tools. I pay attention to data design, access control, reliability, and how each service supports the wider product.",
  },
  {
    title: "Product Thinking and Collaboration",
    iconKey: "🔎",
    description:
      "Client work, field research, and team projects have taught me to ask better questions, listen before building, explain technical choices clearly, and adjust when the first idea does not fit the real need.",
  },
];

// The four "Domains I have built in" cards.
export const domains = [
  {
    title: "Healthcare",
    iconKey: "🩺",
    description:
      "I am interested in tools that can improve access to health information and support professionals without pretending that software can replace medical judgement.",
  },
  {
    title: "Agriculture",
    iconKey: "💳",
    description:
      "My years of farm work made agricultural challenges real to me. I want to understand how software and AI can support farmers with useful information and better access to markets.",
  },
  {
    title: "Education",
    iconKey: "🎓",
    description:
      "Education changed my own path. Through mentoring and the AI Study Lab, I have also seen how much confidence and access to guidance can change a student's direction.",
  },
  {
    title: "Entrepreneurship",
    iconKey: "🌾",
    description:
      "From running a small juice business to delivering paid software projects, I enjoy turning an idea into something useful and taking responsibility for the people who trust me to deliver it.",
  },
];
