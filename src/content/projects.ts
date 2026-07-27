import { Category, MediaType } from "@prisma/client";

// The card line is capped at 180 chars by the schema, so the full paragraph from the
// original site lives in fullDescription and the card carries a trimmed version.
export type SeedProject = {
  title: string;
  domain: string;
  category: Category;
  iconKey: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  repo: string;
  liveUrl?: string;
  metrics?: { label: string; value: string }[];
  featuredOrder?: number;
};

export const projects: SeedProject[] = [
  {
    title: "Malaria Diagnosis with CNN and Transfer Learning",
    domain: "ML · Healthcare",
    category: Category.ML_AI,
    iconKey: "🔬",
    shortDescription:
      "Compares five convolutional networks for telling parasitised blood cells from healthy ones, with my own baseline CNN reaching an F1 score of 0.9647.",
    fullDescription:
      "This project compares five convolutional neural networks for telling parasitised blood cells apart from healthy ones, and because each model was put through seven separate experiments, the comparison is genuinely careful, with my own baseline CNN reaching an F1 score of 0.9647 and an AUC of 0.9938 at its best.",
    techStack: ["Python", "TensorFlow", "VGG16", "ResNet50", "MobileNetV2", "CNN"],
    repo: "Malaria-Diagnosis",
    metrics: [
      { label: "F1 score", value: "0.9647" },
      { label: "AUC", value: "0.9938" },
      { label: "Models compared", value: "5" },
      { label: "Experiments per model", value: "7" },
    ],
    featuredOrder: 1,
  },
  {
    title: "African Credit Scoring System",
    domain: "ML · Financial Inclusion",
    category: Category.ML_AI,
    iconKey: "💳",
    shortDescription:
      "Predicts how likely someone is to hold a bank account when there is no credit history to lean on, with SHAP and LIME so the reasoning can be explained.",
    fullDescription:
      "Built on the Zindi financial inclusion survey of 23,524 people, this platform predicts how likely someone is to hold a bank account even when there is no credit history to lean on, and because the decision matters to real lives, I trained nine different models, added SHAP and LIME so the reasoning can be explained, and served the whole thing through FastAPI and Streamlit inside a Docker container.",
    techStack: ["XGBoost", "Random Forest", "scikit-learn", "SHAP", "LIME", "FastAPI", "Docker"],
    repo: "CodeAlpha_credit-scoring-model",
    metrics: [
      { label: "Survey respondents", value: "23,524" },
      { label: "Models trained", value: "9" },
      { label: "Explainability", value: "SHAP and LIME" },
    ],
    featuredOrder: 2,
  },
  {
    title: "HealthBridge Africa",
    domain: "Full-stack · Healthcare",
    category: Category.FULLSTACK,
    iconKey: "🩺",
    shortDescription:
      "A telemedicine platform reaching patients by mobile app, web, and a USSD dial code that works on basic phones with no internet at all.",
    fullDescription:
      "HealthBridge Africa is a telemedicine platform that reaches patients in three different ways, as a mobile app, as a web application, and through a USSD dial code that works on the most basic phones with no internet at all, and it carries two AI health assistants, one that supports doctors during consultations and another that explains a patient's health to them in language they can actually understand.",
    techStack: ["JavaScript", "React Native", "Node.js", "MySQL", "USSD"],
    repo: "HealthBridge_Africa",
    metrics: [
      { label: "Delivery channels", value: "3" },
      { label: "AI assistants", value: "2" },
    ],
    featuredOrder: 3,
  },
  {
    title: "PeerForge",
    domain: "Full-stack · Developer Tools",
    category: Category.FULLSTACK,
    iconKey: "🤝",
    shortDescription:
      "A space where computer science students share work, collaborate, and message in real time, built as a Turborepo monorepo.",
    fullDescription:
      "PeerForge is a space where computer science students can share their work, collaborate on projects, message one another in real time, and build up a public portfolio, and it is put together as a Turborepo monorepo, with a Next.js and TypeScript frontend, a NestJS and Prisma API, Socket.IO for the messaging, and Clerk handling authentication across both the REST and socket layers.",
    techStack: ["Next.js", "TypeScript", "NestJS", "Prisma", "Socket.IO", "Clerk", "Turborepo"],
    repo: "PeerForge",
    featuredOrder: 4,
  },
  {
    title: "Rice Leaf Disease Classifier",
    domain: "ML · Agriculture",
    category: Category.ML_AI,
    iconKey: "🌾",
    shortDescription:
      "Reads a photograph of a rice leaf and works out which disease it shows, built as a full MLOps pipeline rather than a notebook.",
    fullDescription:
      "This deep learning project looks at a photograph of a rice leaf and works out which disease it is showing, sorting it into bacterial blight, blast, brown spot, or tungro, and because I built it as a full MLOps pipeline rather than a notebook, it carries a farmer all the way from an uploaded photo to an answer they can act on.",
    techStack: ["Python", "TensorFlow", "Keras", "CNN", "Hugging Face"],
    repo: "rice_disease_classifier",
    metrics: [{ label: "Disease classes", value: "4" }],
    featuredOrder: 5,
  },
  {
    title: "Productivity Tracking and Analytics App",
    domain: "Mobile · Productivity",
    category: Category.MOBILE,
    iconKey: "⏱️",
    shortDescription:
      "A Flutter time tracker running three analytics engines on the device itself, so genuine machine learning happens on the phone.",
    fullDescription:
      "This cross-platform time-tracking app is built with Flutter and Firebase, and instead of merely listing hours it runs three analytics engines directly on the device, using K-Means to group sessions into work tiers, a linear-regression forecaster to predict the hours ahead, and a heuristic engine to flag anomalies, which means genuine machine learning is happening on the phone itself.",
    techStack: ["Flutter", "Dart", "Firebase", "K-Means", "Linear Regression"],
    repo: "Productivity-Tracking-Analytics",
    metrics: [{ label: "On-device engines", value: "3" }],
    featuredOrder: 6,
  },
  {
    title: "Maize Leaf Disease Classification",
    domain: "ML · Agriculture",
    category: Category.ML_AI,
    iconKey: "🌽",
    shortDescription:
      "Sorts maize leaf photographs into four categories, placing a scikit-learn model beside deep learning to see where each one struggles.",
    fullDescription:
      "Here I built an end-to-end pipeline that sorts maize leaf photographs into four categories, and rather than settling for a single approach I placed a traditional model built with scikit-learn side by side with deep learning built in TensorFlow, so that I could understand where each one succeeds and where each one struggles.",
    techStack: ["Python", "TensorFlow", "scikit-learn", "CNN"],
    repo: "Maize_Leaf-Disease_Classification",
    metrics: [{ label: "Categories", value: "4" }],
  },
  {
    title: "HandScript AI, Handwriting Recognition",
    domain: "ML · Computer Vision",
    category: Category.ML_AI,
    iconKey: "✍️",
    shortDescription:
      "Reads handwritten capital letters at 98.9 percent test accuracy, wrapped in a Streamlit app so anyone can draw a letter and watch it read back.",
    fullDescription:
      "HandScript AI is a convolutional neural network that reads handwritten capital letters from A to Z and reaches 98.9 percent accuracy on the test set, but what I like most about it is that I wrapped it in a Streamlit app, so that anyone can draw a letter and watch the model read it back to them in the moment.",
    techStack: ["Python", "TensorFlow", "Keras", "CNN", "Streamlit"],
    repo: "CodeAlpha_Handwritten-Character-Recognition",
    metrics: [
      { label: "Test accuracy", value: "98.9%" },
      { label: "Classes", value: "26" },
    ],
  },
  {
    title: "FredCare AI, Breast Cancer Prediction",
    domain: "ML · Healthcare",
    category: Category.ML_AI,
    iconKey: "🎗️",
    shortDescription:
      "Clinical decision support that helps flag whether a breast cancer case appears malignant early, with plain-language results and a clear disclaimer.",
    fullDescription:
      "FredCare AI is a clinical decision support application that helps flag whether a breast cancer case appears malignant at an early stage, and it has been written to feel like a tool a real person could trust, pairing the model with a clean interface, plain-language results, and a clear disclaimer for whoever happens to be reading them.",
    techStack: ["Python", "scikit-learn", "Flask", "HTML", "CSS", "JS"],
    repo: "CodeAlpha_Breast-Cancer-Prediction",
  },
  {
    title: "Student Performance Prediction System",
    domain: "ML · Education",
    category: Category.ML_AI,
    iconKey: "🎓",
    shortDescription:
      "Predicts student performance from study habits and circumstances, with the strongest model served over FastAPI and wired live to a Flutter app.",
    fullDescription:
      "This project predicts how students are likely to perform based on their study habits and personal circumstances, and after comparing a Linear Regression, a Decision Tree, and a Random Forest, I took the strongest model, placed it behind a public FastAPI service, and connected it live to a Flutter mobile app, so that the study reaches all the way to a phone in someone's hand.",
    techStack: ["scikit-learn", "Random Forest", "FastAPI", "Flutter"],
    repo: "linear_regression_model",
    metrics: [{ label: "Models compared", value: "3" }],
  },
  {
    title: "Maternal Health Risk Prediction",
    domain: "ML · Healthcare",
    category: Category.ML_AI,
    iconKey: "🤰",
    shortDescription:
      "Predicts whether a mother's risk level is low, mid, or high from six vital signs, shipping only the winning model behind a layered FastAPI service.",
    fullDescription:
      "Working from the UCI maternal health dataset, this service predicts whether a mother's risk level is low, mid, or high from six vital signs, and it reflects a discipline I care about, because it keeps the exploratory research to one side and ships only the winning model behind a clean, layered FastAPI application.",
    techStack: ["scikit-learn", "Random Forest", "FastAPI", "HTML", "JS"],
    repo: "Maternal_Health_Risk_Prediction",
    metrics: [
      { label: "Vital signs used", value: "6" },
      { label: "Risk classes", value: "3" },
    ],
  },
  {
    title: "Tetouan City Power Forecast",
    domain: "ML · Time Series",
    category: Category.ML_AI,
    iconKey: "⚡",
    shortDescription:
      "Forecasts city electricity demand from weather and recent load across more than fifty thousand records, wired to two databases and an API.",
    fullDescription:
      "This time series project forecasts how much electricity the city of Tetouan uses, drawing on weather data and recent demand across more than fifty thousand records from 2017, and rather than living inside a notebook it is wired to two databases, an API, and a prediction script, with a tuned Random Forest ultimately outperforming the linear baseline.",
    techStack: ["Python", "scikit-learn", "Random Forest", "SQL", "REST API"],
    repo: "tetouan-power-forecast",
    metrics: [
      { label: "Records", value: "50,000+" },
      { label: "Best model", value: "Tuned Random Forest" },
    ],
  },
  {
    title: "Multimodal Verification and Prediction Pipeline",
    domain: "ML · Multimodal",
    category: Category.ML_AI,
    iconKey: "🔐",
    shortDescription:
      "Verifies a person by face and then by voice, revealing its recommendation only when both checks pass and clearly belong to the same person.",
    fullDescription:
      "This system verifies a person twice before it will reveal anything, first by their face and then by their voice, and it only shows the recommendation when both checks pass and clearly belong to the same person, which makes it a good demonstration of designing a pipeline where several models have to agree before anything at all can happen.",
    techStack: ["Python", "Face Recognition", "Audio Processing", "ML"],
    repo: "Formative2_MachineLearning_Pipeline",
  },
  {
    title: "Principal Component Analysis from First Principles",
    domain: "ML · Foundations",
    category: Category.ML_AI,
    iconKey: "📐",
    shortDescription:
      "PCA implemented from scratch in NumPy alone, working through covariance, eigenvalues, eigenvectors, and variance decomposition.",
    fullDescription:
      "For this one I implemented Principal Component Analysis entirely from first principles using nothing but NumPy, working through covariance, eigenvalues, eigenvectors, and variance decomposition on an African malaria dataset, because I wanted to understand the mathematics beneath the tools rather than simply call a ready-made function.",
    techStack: ["Python", "NumPy"],
    repo: "Formative-2---PrincipleComponentAnalysis",
  },
  {
    title: "Kigali City Services Directory",
    domain: "Mobile · Civic",
    category: Category.MOBILE,
    iconKey: "🗺️",
    shortDescription:
      "Helps people discover and review the services around Kigali, with real-time search, category filters, embedded Google Maps, and directions.",
    fullDescription:
      "This Flutter app helps people discover, explore, and review the places and services around Kigali, complete with real-time search, category filters, embedded Google Maps, and directions, and I built it because finding my way around a new city in a language I did not yet speak was a daily obstacle that I knew a great many others were facing too.",
    techStack: ["Flutter", "Dart", "Firebase", "Riverpod", "Google Maps"],
    repo: "Kigali_City_Service_App",
  },
  {
    title: "CitizenConnect",
    domain: "Mobile · Civic",
    category: Category.MOBILE,
    iconKey: "🏛️",
    shortDescription:
      "A civic-technology app connecting citizens with government agencies, where I owned the entire Firebase backend and its security rules.",
    fullDescription:
      "CitizenConnect is a civic-technology app that connects citizens with government agencies, and for my team I owned the entire Firebase backend, which meant handling authentication with email verification, role detection, the full range of Firestore operations, file storage, and the security rules that keep everything safe.",
    techStack: ["Flutter", "Dart", "Firebase", "Firestore", "Firebase Auth"],
    repo: "CitizenConnect",
  },
  {
    title: "Guardian Watch",
    domain: "Mobile · Safety",
    category: Category.MOBILE,
    iconKey: "🛡️",
    shortDescription:
      "An early-stage Flutter app exploring an idea around safety and monitoring, currently laying down the structure and opening screens.",
    fullDescription:
      "Guardian Watch is an early-stage Flutter app that I began in order to explore an idea around safety and monitoring, and I am happy to describe it honestly as a work in progress, since it currently lays down the project structure and the opening screens as one of my ongoing mobile explorations.",
    techStack: ["Flutter", "Dart"],
    repo: "Guardian-Watch-app",
  },
  {
    title: "Toumaï Marketplace",
    domain: "Full-stack · Agriculture",
    category: Category.FULLSTACK,
    iconKey: "🛒",
    shortDescription:
      "An agricultural marketplace putting farmers, fishermen, and local sellers in direct contact with buyers, so the middlemen no longer take a share.",
    fullDescription:
      "Toumaï is a responsive agricultural marketplace that puts farmers, fishermen, and local sellers in direct contact with buyers, so that the usual middlemen no longer take their share, and it comes with real-time messaging, straightforward listings, category search, role-based dashboards, and a dark mode for good measure.",
    techStack: ["React", "Node.js", "SQLite", "JavaScript"],
    repo: "Smart-Farm",
    liveUrl: "https://smart-farm-smoky.vercel.app",
  },
  {
    title: "MTN MoMo SMS Analytics Dashboard",
    domain: "Full-stack · Fintech",
    category: Category.FULLSTACK,
    iconKey: "📊",
    shortDescription:
      "Reads a raw XML export of Mobile Money messages, extracts the financial detail by pattern matching, and shows where the money actually went.",
    fullDescription:
      "This dashboard grew out of a real frustration, because I had hundreds of Mobile Money messages sitting in my phone and no easy way to see what they said about my spending, so I built a system that reads a raw XML export of those messages, pulls out the financial details through pattern matching, and turns them into a clear picture of where the money actually went over time.",
    techStack: ["Python", "JavaScript", "XML Parsing", "SQL", "HTML", "CSS"],
    repo: "Momo_SMS_Analysis_Project",
  },
  {
    title: "Fred-Cash, Converter and Calculator",
    domain: "Full-stack · Fintech",
    category: Category.FULLSTACK,
    iconKey: "💱",
    shortDescription:
      "A real-time converter covering more than forty-five currencies plus a calculator, deployed with load balancing across several servers.",
    fullDescription:
      "Fred-Cash brings together a real-time currency converter that handles more than forty-five currencies and an interactive calculator, and it goes a little further than an ordinary frontend, since it is deployed with load balancing across several servers and pays close attention to keeping the API key secure.",
    techStack: ["HTML", "CSS", "JavaScript", "REST API", "Nginx", "Load Balancing"],
    repo: "Fred-Cash",
    metrics: [{ label: "Currencies", value: "45+" }],
  },
  {
    title: "Personal Resume Website",
    domain: "Web · Personal",
    category: Category.FULLSTACK,
    iconKey: "📄",
    shortDescription:
      "A single clean page bringing together my skills, experience, education, and projects, an early record of how I first told my story on the web.",
    fullDescription:
      "This was my personal resume website, a single clean page that brought together my skills, experience, education, and projects, and it stands as an early record of how I first began to present myself and my story on the web.",
    techStack: ["HTML", "CSS", "JavaScript"],
    repo: "My-Personal-Resume-Website",
  },
  {
    title: "Personal Portfolio Website",
    domain: "Web · Personal",
    category: Category.FULLSTACK,
    iconKey: "🌐",
    shortDescription:
      "Where I gather who I am, what I offer, and the projects I have worked on in one place, and steadily refine my own web presence.",
    fullDescription:
      "This personal website is where I gather who I am, what I offer, and the projects I have worked on in one place, and it has been part of how I steadily refine my own web presence and show prospective clients the kind of work they can expect from me.",
    techStack: ["HTML", "CSS", "JavaScript"],
    repo: "My-personal-Website",
  },
  {
    title: "AirBnB Clone (Full Web App)",
    domain: "Foundations · Python",
    category: Category.FOUNDATIONS,
    iconKey: "🏠",
    shortDescription:
      "Carries the AirBnB clone past its console into a database-backed application, with JSON and database storage and PEP8-clean unit tests.",
    fullDescription:
      "This team project takes the well-known AirBnB clone well past its starting console and into a fuller application backed by a database, complete with a command interpreter, storage that persists in both JSON and a database, a BaseModel that the other classes inherit from, and a suite of unit tests kept to the PEP8 standard.",
    techStack: ["Python", "MySQL", "SQLAlchemy", "Flask", "unittest"],
    repo: "alu-AirBnB_clone_v2",
  },
  {
    title: "AirBnB Clone (Console)",
    domain: "Foundations · Python",
    category: Category.FOUNDATIONS,
    iconKey: "⌨️",
    shortDescription:
      "The first stage of the AirBnB clone, a backend console that creates, updates, and destroys objects with JSON serialization so state survives.",
    fullDescription:
      "This was the first stage of the AirBnB clone, focused on the backend console that manages the program's data, and it lets a user create, update, and destroy objects while using JSON serialization so that everything is still there the next time the program is opened.",
    techStack: ["Python", "unittest", "JSON Serialization"],
    repo: "alu-AirBnB_clone",
  },
  {
    title: "Sparse Matrix Processor",
    domain: "Foundations · Data Structures",
    category: Category.FOUNDATIONS,
    iconKey: "🔢",
    shortDescription:
      "Adds, subtracts, and multiplies sparse matrices from text files, checking dimensions first and storing only non-zero entries to save memory.",
    fullDescription:
      "This command-line program carries out addition, subtraction, and multiplication on sparse matrices that are loaded from text files, and it checks the dimensions properly before it acts, while storing only the non-zero entries so that large and mostly empty matrices are handled without wasting memory.",
    techStack: ["JavaScript", "Node.js", "Data Structures"],
    repo: "sparse_matrix",
  },
  {
    title: "Data Structures and Algorithms",
    domain: "Foundations · Algorithms",
    category: Category.FOUNDATIONS,
    iconKey: "🧮",
    shortDescription:
      "My ongoing work with the fundamental data structures and algorithms that make the more ambitious projects possible.",
    fullDescription:
      "This repository gathers my ongoing work with data structures and algorithms, where I practise the fundamental building blocks that every capable engineer relies on, and it stands as steady evidence that I invest in the basics which make the more ambitious projects possible.",
    techStack: ["Python", "Algorithms", "Data Structures"],
    repo: "DSA",
  },
];

// Every project starts with no media, so the card renders its styled placeholder.
export const DEFAULT_MEDIA_TYPE = MediaType.NONE;
