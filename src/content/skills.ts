// Three tiers, where level is how many of the ten bar segments are filled.
export const skillTiers = [
  {
    name: "Shipped to real users",
    subtitle: "paid client work or deployed projects",
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
    name: "Built and evaluated in projects",
    subtitle: "trained, tested and written up",
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
    name: "Studying now",
    subtitle: "learning actively, not yet shipped",
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
      "I design and build software systems that are meant to scale, and I rely on solid engineering habits throughout, which means paying close attention to architecture, REST APIs, authentication, database design, testing, and the deployment pipelines that carry everything into production.",
  },
  {
    title: "Machine Learning Engineering",
    iconKey: "🧠",
    description:
      "I build machine learning systems that are meant to live in the real world rather than remain inside a notebook, so my work stretches from preparing the data and developing the model through evaluation, explainability, deployment, and the inference services that finally deliver predictions to users.",
  },
  {
    title: "Full-Stack Development",
    iconKey: "🌐",
    description:
      "I develop web applications from end to end, which means I am comfortable moving between the interface a person sees, the backend services behind it, the database, the authentication, the real-time communication, and the cloud environment where all of it runs.",
  },
  {
    title: "Mobile Development",
    iconKey: "📱",
    description:
      "I create cross-platform mobile applications with Flutter and Firebase, and I try to give them an experience that feels modern and considered while keeping the architecture underneath ready to grow as the audience grows.",
  },
  {
    title: "Backend Engineering",
    iconKey: "⚙️",
    description:
      "I build backend systems with security in mind, drawing on Python, Node.js, FastAPI, NestJS, and Flask on the server side, and on PostgreSQL, MySQL, Prisma, GraphQL, and REST APIs for the data and the communication between services.",
  },
  {
    title: "Machine Learning",
    iconKey: "🔎",
    description:
      "My machine learning experience is fairly broad, reaching across computer vision, deep learning, and predictive analytics, as well as time series forecasting, classification, regression, clustering, explainable models, feature engineering, and model optimisation.",
  },
];

// The four "Domains I have built in" cards.
export const domains = [
  {
    title: "Healthcare",
    iconKey: "🩺",
    description:
      "I have built telemedicine platforms, medical assistant tools, and diagnostic support that are designed to work even where connectivity and access to professional care are limited.",
  },
  {
    title: "Finance",
    iconKey: "💳",
    description:
      "My finance work covers credit scoring, mobile money analytics, and tools that help bring people who have been left outside the formal financial system back into it.",
  },
  {
    title: "Education",
    iconKey: "🎓",
    description:
      "In education I have created learning tools supported by artificial intelligence, along with models that help predict and make sense of how students are likely to perform.",
  },
  {
    title: "Agriculture",
    iconKey: "🌾",
    description:
      "For agriculture I have developed crop disease detection, online marketplaces, and systems that help farmers keep track of their everyday operations.",
  },
];
