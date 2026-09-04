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
  mediaType?: MediaType;
  mediaUrl?: string;
  posterUrl?: string;
  mediaAlt?: string;
  featuredOrder?: number;
};

export const projects: SeedProject[] = [
  {
    title: "Malaria Diagnosis with CNN and Transfer Learning",
    domain: "ML · Healthcare",
    category: Category.ML_AI,
    iconKey: "🔬",
    shortDescription:
      "I compared several ways to identify malaria-infected cells and learned that a simpler model can sometimes perform as well as a larger one on the same test set.",
    fullDescription: `## Why we built it

Malaria diagnosis often requires trained professionals to examine blood-smear images. In places with limited laboratory staff, a reliable support tool could help specialists review cases more efficiently. Our team wanted to understand how different image models perform when they are trained and tested under the same conditions.

## Who it could help

The long-term users could be laboratory professionals and clinics that need dependable decision support. This project is a research comparison, not a medical product. It has not been tested in a clinic and should not be used to make a diagnosis.

## What we tried

Our five-person ALU team compared a baseline CNN, an advanced CNN, VGG16, ResNet50, and MobileNetV2. We used the same split of the NIH Malaria Cell Images dataset for every model. Each teammate ran seven experiments so that our comparison would be consistent.

## My part

I worked on the baseline CNN. I kept the network simple on purpose so that the larger models had a clear point of comparison. Across seven experiments, I changed factors such as the learning rate, dropout, data augmentation, and batch size.

## What I learned

- The dataset contains 27,558 balanced single-cell images.
- We tested every model on the same 5,512 held-out images.
- My best baseline reached **0.9650 accuracy, 0.9647 F1, and 0.9938 AUC**.
- All five models finished within 0.003 F1 of one another. On this dataset, a more complex model did not automatically give a better result.

## What is still missing

The images come from a clean public dataset of individual cells. Real clinical images can vary across microscopes, laboratories, and patient groups. The study does not prove that the model is safe, useful in a clinical workflow, or ready for medical use.

## What I would explore next

I would test a compact model on locally collected images from different microscopes. I would also study how to show uncertainty clearly so that a professional can review difficult cases instead of receiving an overconfident answer.`,
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
      "I explored what East African survey data can tell us about access to bank accounts, while learning why a prediction is not the same as a fair credit decision.",
    fullDescription: `## Why I built it

Many people in East Africa use money and run businesses without having the formal financial history that banks normally expect. During my CodeAlpha internship, I wanted to explore whether other kinds of information could help us understand financial access.

## Who it is about

The data represents people in Kenya, Rwanda, Tanzania, and Uganda. The project may be useful to researchers studying financial inclusion, but it is not a system for approving or rejecting a loan.

## What I tried

I used 23,524 responses from four national surveys. The data includes information about employment, households, location, mobile access, and whether a person owns a bank account. Because only about 14 percent of respondents had an account, I balanced only the training data and compared four models on a separate test set.

## What I built

I created a Streamlit application for individual exploration, charts, and batch CSV processing. I also built the data checks, feature preparation, model comparison, and saved prediction pipeline.

## What I learned

- Logistic Regression gave the best test ROC-AUC at **0.857**.
- Random Forest reached 0.841, Decision Tree reached 0.815, and KNN reached 0.788.
- The simpler model was competitive and easier to inspect.
- A model can find patterns in existing data without proving that those patterns are fair or appropriate for a real decision.

## What is still missing

The target is bank-account ownership, not repayment or creditworthiness. Demographic survey data can also carry the effects of past exclusion. The surveys were collected between 2016 and 2018, and I have not completed a fairness audit or a pilot with a financial institution.

## What I would explore next

I would work with financial inclusion specialists to choose a more suitable outcome, review errors across different groups, and decide whether consented alternative data can add value without repeating unfair patterns.`,
    techStack: ["Python", "scikit-learn", "Logistic Regression", "SMOTE", "Streamlit", "Plotly"],
    repo: "CodeAlpha_credit-scoring-model",
    metrics: [
      { label: "Survey respondents", value: "23,524" },
      { label: "Best test ROC-AUC", value: "0.857" },
      { label: "Models compared", value: "4" },
    ],
    featuredOrder: 2,
  },
  {
    title: "HealthBridge Africa",
    domain: "Full-stack · Healthcare",
    category: Category.FULLSTACK,
    iconKey: "🩺",
    shortDescription:
      "I am building a healthcare platform that can work through mobile, web, and USSD so access does not depend on owning a smartphone or having reliable internet.",
    fullDescription: `## Why I started it

Distance, weak connectivity, scattered health records, and limited access to specialists can make it harder for patients to receive continuous care. I did not want the idea to depend only on smartphones because that would leave out many of the people it is meant to support.

## Who it is for

HealthBridge Africa is designed around patients, clinicians, and service administrators. Patients need access and clear information. Clinicians need useful context during consultations. Administrators need to operate the platform without seeing private medical records.

## What I am exploring

I am exploring how one care experience can work across different devices and levels of connectivity. I am also exploring how AI can support a professional or explain information to a patient without taking over the professional's role.

## What I built

The prototype includes mobile and web experiences. A USSD gateway supports registration, consultation requests, and recent-history checks on basic phones. MedAssist provides contextual support for doctors, while HealthGuide explains diagnoses and medication in simpler language for patients. The backend includes role checks, doctor-access approval, rate limiting, and protected health records.

## What I learned

- Designing for three access channels changes how every workflow has to be planned.
- Different users need different forms of AI assistance.
- The backend currently has thirteen automated tests for core behaviour.
- English and French interfaces can make the product useful to more people in the region.

## What is still missing

This is a working prototype, not a medical service. It has not been clinically validated, tested in the field, certified for security, or reviewed by regulators. The AI layer can be wrong, and a real USSD service would require a telecom partner.

## What I would do next

I would work directly with patients and healthcare professionals to choose one small and safe workflow to test first. Their feedback should decide what is useful, what needs stronger safeguards, and what should not be automated.`,
    techStack: ["JavaScript", "React Native", "Node.js", "MySQL", "USSD"],
    repo: "HealthBridge_Africa",
    metrics: [
      { label: "Delivery channels", value: "3" },
      { label: "AI assistants", value: "2" },
      { label: "Automated backend tests", value: "13" },
    ],
    mediaType: MediaType.IMAGE,
    mediaUrl: "https://raw.githubusercontent.com/Adossi-design/HealthBridge_Africa/main/assets/logo.png",
    mediaAlt: "HealthBridge Africa logo with a medical cross, heartbeat line, and surrounding blue arcs",
    featuredOrder: 3,
  },
  {
    title: "PeerForge",
    domain: "Full-stack · Developer Tools",
    category: Category.FULLSTACK,
    iconKey: "🤝",
    shortDescription:
      "A collaboration environment where computer science students can find projects, share work, and form teams instead of learning in isolation.",
    fullDescription: `## Why I built it

Computer science students often work alone even when other students nearby are looking for the same feedback, experience, or teammate. General social platforms make it easy to post, but they are not designed around finding technical projects and building together.

## Who it is for

PeerForge is for computer science students who want to discover projects, meet collaborators, discuss ideas, and show the work they have contributed to.

## What I explored

I thought about what students need beyond a normal social feed. That led to structured project posts, collaboration status, technical tags, conversations, profiles, notifications, and a visible record of contributions.

## What I built

Students can publish work, ask for collaborators, join discussions, save posts, send messages, and present their projects. Behind the interface, the web and API applications share types in one repository. Authentication covers both normal requests and real-time messages.

## What I learned

- Collaboration tools need more structure than a normal feed.
- Real-time features add useful energy, but they also make authentication and state harder to manage.
- A technically complete feature does not prove that students will keep using it.

## What is still missing

PeerForge has not yet shown sustained adoption or better collaboration outcomes. Recommendation quality, moderation, accessibility, abuse prevention, and the experience for a new community still need real user testing.

## What I would explore next

I would test it with a small student community and measure whether people form teams and finish projects together. I would also learn which matching signals are useful without turning the platform into a popularity contest.`,
    techStack: ["Next.js", "TypeScript", "NestJS", "Prisma", "Socket.IO", "Clerk", "Turborepo"],
    repo: "PeerForge",
    metrics: [
      { label: "Core applications", value: "2" },
      { label: "Realtime transport", value: "Socket.IO" },
    ],
    mediaType: MediaType.IMAGE,
    mediaUrl:
      "https://raw.githubusercontent.com/Adossi-design/PeerForge/main/apps/api/uploads/1778793291951-126624.png",
    mediaAlt: "PeerForge project discussion interface showing collaboration status, skills, and comments",
    featuredOrder: 4,
  },
  {
    title: "Rice Leaf Disease Classifier",
    domain: "ML · Agriculture",
    category: Category.ML_AI,
    iconKey: "🌾",
    shortDescription:
      "I built a tool that checks a rice-leaf photo for four diseases and explored what it would take to move a model from training into a usable service.",
    fullDescription: `## Why I built it

For a smallholder farmer, crop disease can affect both food and income. Different rice diseases need different responses, but an agricultural expert may not be nearby when the first signs appear. My own farm experience made this problem especially meaningful to me.

## Who it could help

The idea is meant for smallholder rice farmers and agricultural extension workers who need an accessible first check. It is a support tool, not a replacement for an agronomist or a laboratory result.

## What I explored

I wanted to learn whether a lightweight image model could recognise four visually similar diseases, run at a reasonable cost, show confidence scores, accept new labelled images, and support retraining later.

## What I built

The public application accepts a leaf photograph and returns a confidence score for each class. It also includes service monitoring, batch image upload, background retraining, health checks, and records of predictions and training runs. I chose MobileNetV2 because a smaller model made more sense for the available resources.

## What I learned

- The dataset contains 5,932 labelled images across four roughly balanced classes.
- The model reached about **89% accuracy and 0.90 macro-F1** on 1,185 held-out images.
- I deployed a public demo and recorded a walkthrough.
- In a simulated 50-user test, four containers increased throughput from 12.2 to 23.3 requests per second and reduced median latency from 3.6 to 1.2 seconds, with no failed requests.

## What is still missing

This was not a field trial. The dataset covers only four known diseases, and performance may change with different lighting, crop varieties, locations, early symptoms, or an unfamiliar disease. Farmers and extension professionals have not evaluated the tool yet.

## What I would do next

I would collect local images with agricultural partners, add a clear "uncertain or unknown" result, and test whether the tool helps people decide when to ask an expert for support.`,
    techStack: ["Python", "TensorFlow", "Keras", "CNN", "Hugging Face"],
    repo: "rice_diseases_classifier",
    liveUrl: "https://huggingface.co/spaces/Fred-William/rice-disease-classifier",
    mediaType: MediaType.VIDEO_EMBED,
    mediaUrl: "https://youtu.be/yqQmsAyq4Lc",
    mediaAlt: "Video demonstration of the deployed rice leaf disease classifier",
    metrics: [
      { label: "Held-out accuracy", value: "≈89%" },
      { label: "Macro-F1", value: "≈0.90" },
      { label: "Disease classes", value: "4" },
      { label: "Load-test failures", value: "0" },
    ],
    featuredOrder: 5,
  },
  {
    title: "Productivity Tracking and Analytics App",
    domain: "Mobile · Productivity",
    category: Category.MOBILE,
    iconKey: "⏱️",
    shortDescription:
      "I built a private productivity tracker that turns work sessions into simple patterns and forecasts without sending the analysis to a separate server.",
    fullDescription: `## Why I built it

Most time trackers show a list of hours without helping a person understand the pattern behind them. I wanted to explore whether a small, private analytics system could help someone reflect on their work without sending detailed behaviour data to another server.

## Who it is for

The app is meant for students, independent professionals, and anyone who wants a clearer picture of their work habits while keeping the analysis on their own device.

## What I explored

I tested three kinds of local analysis: grouping similar work sessions, forecasting future hours, and using clear rules to point out unusual patterns. I kept these separate so a user can tell which results come from a learned model and which come from a rule.

## What I built

The Flutter app uses K-Means for grouping, linear regression for forecasting, and a rule-based engine for recommendations. It reports evaluation measures for the learned models instead of showing a prediction without context. Firebase synchronises each user's records with per-user security rules.

## What I learned

- The app runs three different analysis engines on the device.
- Forecast quality is checked on later, held-out data rather than the training data.
- The project includes automated tests and a GitHub Actions workflow.
- One Flutter codebase supports Android, iOS, web, Windows, Linux, and macOS.

## What is still missing

The forecast uses only one feature, so it cannot understand deadlines, health, changing workloads, or seasonal patterns. I have not yet shown that the recommendations improve behaviour. History queries also need pagination, and web notifications require the tab to stay open.

## What I would do next

I would test the app with people over a longer period and ask whether the feedback actually changes how they plan. I would also explore richer local features while keeping the results understandable.`,
    techStack: ["Flutter", "Dart", "Firebase", "K-Means", "Linear Regression"],
    repo: "Productivity-Tracking-Analytics",
    metrics: [
      { label: "On-device engines", value: "3" },
      { label: "Target platforms", value: "6" },
      { label: "Forecast evaluation", value: "Held-out" },
    ],
    featuredOrder: 6,
  },
  {
    title: "Maize Leaf Disease Classification",
    domain: "ML · Agriculture",
    category: Category.ML_AI,
    iconKey: "🌽",
    shortDescription:
      "I explored whether image classification could help recognise four maize leaf conditions and compared a traditional model with deep learning.",
    fullDescription:
      "## Why I built it\n\nCrop disease can be difficult to recognise early, especially when expert advice is not nearby. I built this project to explore how image classification might support farmers or agricultural workers with a first check.\n\n## What I learned\n\nI compared a traditional scikit-learn model with a TensorFlow deep-learning model instead of assuming that the more complex option would always be better. The work taught me to look at where each approach succeeds and fails across four leaf categories.\n\n## Technical note\n\nThe project covers data preparation, model training, comparison, and evaluation. It is a learning project, not a field-tested agricultural tool.",
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
      "I turned a handwriting model into an interactive app so people can draw a letter and immediately see how the model understands it.",
    fullDescription:
      "## Why I built it\n\nI wanted to make computer vision easier to see and understand. Instead of leaving a handwriting model inside a notebook, I created an app where a person can draw a capital letter and watch the model respond.\n\n## What I learned\n\nThe model reached 98.9 percent accuracy on its test set across 26 letters. Building the Streamlit interface also taught me that a model becomes much easier to discuss when people can interact with it directly.\n\n## Technical note\n\nThe project uses a convolutional neural network built with TensorFlow and Keras. The test result belongs to the project dataset and does not guarantee the same performance on every person's handwriting.",
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
      "I explored how a prediction interface could explain a breast-cancer risk result clearly while reminding users that a model is not a diagnosis.",
    fullDescription:
      "## Why I built it\n\nHealth predictions can be confusing or harmful when they are shown without context. I built FredCare AI to practise presenting a model result in plain language with a visible reminder that professional medical judgement still matters.\n\n## What I learned\n\nThe project made me think beyond model output. The wording, interface, and disclaimer are part of the responsibility too.\n\n## Technical note\n\nThe prototype uses a scikit-learn model behind a Flask application. It has not been clinically validated and must not be used as a diagnosis.",
    techStack: ["Python", "scikit-learn", "Flask", "HTML", "CSS", "JS"],
    repo: "CodeAlpha_Breast-Cancer-Prediction",
  },
  {
    title: "Student Performance Prediction System",
    domain: "ML · Education",
    category: Category.ML_AI,
    iconKey: "🎓",
    shortDescription:
      "I explored how study habits and personal circumstances relate to student performance, then connected the best model to a mobile app.",
    fullDescription:
      "## Why I built it\n\nI care about education and wanted to understand which patterns in study habits and personal circumstances appear alongside student performance. The idea is to support reflection, not to label a student's ability.\n\n## What I learned\n\nI compared Linear Regression, Decision Tree, and Random Forest models, then connected the strongest one to a Flutter app through FastAPI. This taught me how to carry a machine learning experiment into a working mobile experience.\n\n## Technical note\n\nThe model reflects patterns in its dataset. It should not be used to make high-stakes decisions about a student.",
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
      "I studied how six vital signs relate to maternal health risk and built a small service that presents low, medium, or high risk categories.",
    fullDescription:
      "## Why I built it\n\nMaternal health is an area where timely attention can matter greatly. I used this project to learn how six recorded vital signs relate to low, medium, and high risk categories in a public dataset.\n\n## What I learned\n\nI separated the model exploration from the FastAPI service that uses the selected model. That helped me understand why research code and application code need different structures.\n\n## Technical note\n\nThis is an educational prototype based on the UCI dataset. It has not been clinically validated and cannot replace care from a qualified professional.",
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
      "I explored how weather and recent demand can help forecast a city's electricity use, then moved the result beyond a notebook into an API workflow.",
    fullDescription:
      "## Why I built it\n\nElectricity providers need to plan for changing demand. I used data from Tetouan to explore how weather and recent electricity use could support a short-term forecast.\n\n## What I learned\n\nThe dataset contains more than 50,000 records from 2017. A tuned Random Forest performed better than my linear baseline. Connecting the work to databases, an API, and a prediction script helped me practise the full path from data to service.\n\n## Technical note\n\nThis is a learning project based on historical data from one city. A real planning tool would need newer data, monitoring, and testing across changing conditions.",
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
      "I combined face and voice checks to explore how several models can work together before a system reveals a result.",
    fullDescription:
      "## Why I built it\n\nMany AI applications depend on more than one signal. I built this pipeline to understand how a system can combine face and voice checks before it continues to a recommendation.\n\n## What I learned\n\nThe hardest part was not a single model. It was coordinating several stages, passing results safely, and deciding what should happen when one check fails.\n\n## Technical note\n\nThis is a demonstration project, not a secure identity product. Real biometric systems require consent, privacy protection, bias testing, anti-spoofing, and much stronger security review.",
    techStack: ["Python", "Face Recognition", "Audio Processing", "ML"],
    repo: "Formative2_MachineLearning_Pipeline",
  },
  {
    title: "Principal Component Analysis from First Principles",
    domain: "ML · Foundations",
    category: Category.ML_AI,
    iconKey: "📐",
    shortDescription:
      "I implemented Principal Component Analysis from the mathematics upward because I wanted to understand what happens behind a library call.",
    fullDescription:
      "## Why I built it\n\nIt is easy to call a machine learning function without understanding what it does. I implemented Principal Component Analysis from first principles because I wanted a clearer understanding of the mathematics behind dimensionality reduction.\n\n## What I learned\n\nWorking through covariance, eigenvalues, eigenvectors, and explained variance helped me connect linear algebra to the behaviour I normally see in a library.\n\n## Technical note\n\nThe implementation uses NumPy and an African malaria dataset. The goal was learning and mathematical understanding, not outperforming a production library.",
    techStack: ["Python", "NumPy"],
    repo: "Formative-2---PrincipleComponentAnalysis",
  },
  {
    title: "Kigali City Services Directory",
    domain: "Mobile · Civic",
    category: Category.MOBILE,
    iconKey: "🗺️",
    shortDescription:
      "I built a mobile guide to help newcomers find useful places and services around Kigali, inspired by my own first months in the city.",
    fullDescription:
      "## Why I built it\n\nWhen I first arrived in Kigali, finding the right places and services in a city where I did not yet speak the local language was a daily challenge. I built this app for newcomers and residents who need a simpler way to discover what is nearby.\n\n## What I learned\n\nThe project taught me to combine search, categories, maps, directions, reviews, and live data in one mobile experience. It also reminded me that a useful product can begin with a small problem from everyday life.\n\n## Technical note\n\nThe app uses Flutter, Firebase, Riverpod, and Google Maps.",
    techStack: ["Flutter", "Dart", "Firebase", "Riverpod", "Google Maps"],
    repo: "Kigali_City_Service_App",
  },
  {
    title: "CitizenConnect",
    domain: "Mobile · Civic",
    category: Category.MOBILE,
    iconKey: "🏛️",
    shortDescription:
      "I worked on a civic app designed to make communication between citizens and government agencies easier and more organised.",
    fullDescription:
      "## Why we built it\n\nCitizens can struggle to know where to send a request or how to follow what happens next. Our team explored a mobile space where people and government agencies could communicate more clearly.\n\n## My part and what I learned\n\nI was responsible for the Firebase backend. I worked on email verification, user roles, Firestore operations, file storage, and security rules. The project taught me how much a civic product depends on clear permissions and careful handling of user information.\n\n## Technical note\n\nCitizenConnect is a team learning project built with Flutter and Firebase. It is not an official government service.",
    techStack: ["Flutter", "Dart", "Firebase", "Firestore", "Firebase Auth"],
    repo: "CitizenConnect",
  },
  {
    title: "Guardian Watch",
    domain: "Mobile · Safety",
    category: Category.MOBILE,
    iconKey: "🛡️",
    shortDescription:
      "An early mobile experiment where I am exploring a safety and monitoring idea without presenting an unfinished concept as a finished product.",
    fullDescription:
      "## Why I started it\n\nI wanted to explore how a mobile app might support a safety and monitoring use case. The idea is still at an early stage, so the main value for me has been learning how to shape the problem before adding many features.\n\n## Current state\n\nThe repository contains the Flutter project structure and opening screens. It is a work in progress, not a working safety service.\n\n## What comes next\n\nBefore building further, I need to define the intended user, the exact safety problem, the privacy risks, and what responsible monitoring should mean in practice.",
    techStack: ["Flutter", "Dart"],
    repo: "Guardian-Watch-app",
  },
  {
    title: "Toumaï Marketplace",
    domain: "Full-stack · Agriculture",
    category: Category.FULLSTACK,
    iconKey: "🛒",
    shortDescription:
      "I built a marketplace concept that helps farmers, fishers, and local sellers connect directly with buyers and keep more control over a sale.",
    fullDescription:
      "## Why I built it\n\nFarmers and local producers can lose income when they have limited access to buyers. Toumaï explores a more direct connection between farmers, fishers, sellers, and customers.\n\n## What it offers\n\nUsers can create listings, search by category, communicate in real time, and use dashboards based on their role. The goal is to make local trade easier to organise and give producers more control over how they reach buyers.\n\n## What I learned\n\nThe project brought together my interest in agriculture and entrepreneurship. It also taught me how marketplaces depend on trust, communication, and clear roles, not only product listings.\n\n## Technical note\n\nThe application uses React, Node.js, SQLite, and JavaScript. Real use would require payment, moderation, identity, and logistics planning.",
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
      "I turned a difficult export of Mobile Money messages into a clearer view of spending patterns and transaction history.",
    fullDescription:
      "## Why I built it\n\nI had hundreds of Mobile Money messages on my phone and no easy way to understand what they said about my spending. I built this dashboard to turn that messy history into something I could review.\n\n## What I learned\n\nThe project reads a raw XML export, identifies transaction details through pattern matching, stores the results, and presents them in a dashboard. It taught me how much cleaning and interpretation can sit between raw data and a useful chart.\n\n## Technical note\n\nThe project uses Python, XML processing, SQL, JavaScript, HTML, and CSS. Financial records are sensitive, so a wider product would need strong privacy and security controls.",
    techStack: ["Python", "JavaScript", "XML Parsing", "SQL", "HTML", "CSS"],
    repo: "Momo_SMS_Analysis_Project",
  },
  {
    title: "Fred-Cash, Converter and Calculator",
    domain: "Full-stack · Fintech",
    category: Category.FULLSTACK,
    iconKey: "💱",
    shortDescription:
      "I built a currency converter and calculator to practise using live exchange data and deploying a small web service across several servers.",
    fullDescription:
      "## Why I built it\n\nCurrency conversion is a simple everyday need, but it gave me a useful way to learn about external data, API security, and web deployment.\n\n## What I learned\n\nFred-Cash converts more than forty-five currencies and includes a calculator. I also deployed it behind load balancing across several servers and kept the exchange-rate API key away from the browser.\n\n## Technical note\n\nThe project uses HTML, CSS, JavaScript, a REST API, Nginx, and load balancing. Exchange results depend on the freshness and availability of the external service.",
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
      "My first résumé website, built to gather my education, experience, skills, and early projects in one clear place.",
    fullDescription:
      "## Why I built it\n\nI needed one link where people could understand my early experience, education, skills, and projects. Building that page also helped me learn how to present my own story on the web.\n\n## What I learned\n\nThe project was simple, but it taught me that clear structure and readable writing matter as much as visual style on a personal website. It now serves as a record of how my online presence began.",
    techStack: ["HTML", "CSS", "JavaScript"],
    repo: "My-Personal-Resume-Website",
  },
  {
    title: "Personal Portfolio Website",
    domain: "Web · Personal",
    category: Category.FULLSTACK,
    iconKey: "🌐",
    shortDescription:
      "The evolving digital home where I bring together my story, work, skills, interests, and plans for the future.",
    fullDescription:
      "## Why I built it\n\nI wanted a digital home that could grow with me. It brings together my background, projects, experience, skills, interests, and future direction for employers, researchers, clients, students, and collaborators.\n\n## What I learned\n\nThe site has moved from a static page to a database-driven Next.js application with an admin system. Rebuilding it has taught me about content design, accessibility, animation, deployment, and the challenge of writing about myself in a way that is clear and honest.\n\n## What comes next\n\nThis website will keep changing as I learn, build, work with more people, and understand my own direction more clearly.",
    techStack: ["HTML", "CSS", "JavaScript"],
    repo: "My-personal-Website",
  },
  {
    title: "AirBnB Clone (Full Web App)",
    domain: "Foundations · Python",
    category: Category.FOUNDATIONS,
    iconKey: "🏠",
    shortDescription:
      "A team learning project that helped me understand how a larger web application connects models, storage, a command interface, and tests.",
    fullDescription:
      "## Why we built it\n\nThis team project was designed to teach us how the parts of a larger web application fit together. It moved an earlier command-line project into a fuller, database-backed system.\n\n## What I learned\n\nI worked with a command interpreter, shared models, JSON and database storage, inheritance, SQLAlchemy, Flask, and unit tests. The biggest lesson was how one decision in the data layer affects the rest of the application.\n\n## Technical note\n\nThis is an educational AirBnB clone created as part of software engineering training, not a commercial booking platform.",
    techStack: ["Python", "MySQL", "SQLAlchemy", "Flask", "unittest"],
    repo: "alu-AirBnB_clone_v2",
  },
  {
    title: "AirBnB Clone (Console)",
    domain: "Foundations · Python",
    category: Category.FOUNDATIONS,
    iconKey: "⌨️",
    shortDescription:
      "The first stage of a larger team project, where I learned how a command-line interface can create and manage data that persists between sessions.",
    fullDescription:
      "## Why we built it\n\nBefore building a web interface, our team needed to understand the data and the operations behind it. We created a console where a user can create, view, update, and delete objects.\n\n## What I learned\n\nJSON serialization keeps the objects available after the program closes. This project strengthened my understanding of object-oriented Python, command interpreters, testing, and persistent state.\n\n## Technical note\n\nThis was the foundation stage of an educational AirBnB clone.",
    techStack: ["Python", "unittest", "JSON Serialization"],
    repo: "alu-AirBnB_clone",
  },
  {
    title: "Sparse Matrix Processor",
    domain: "Foundations · Data Structures",
    category: Category.FOUNDATIONS,
    iconKey: "🔢",
    shortDescription:
      "I built a command-line tool that handles large, mostly empty matrices without storing every zero in memory.",
    fullDescription:
      "## Why I built it\n\nA sparse matrix may contain many zeros, so storing every position wastes memory. I built this processor to understand how the right data structure changes the cost of a calculation.\n\n## What I learned\n\nThe program loads matrices from text files, checks their dimensions, and performs addition, subtraction, and multiplication while storing only non-zero values. It gave me practical experience with efficiency, validation, and data structures.\n\n## Technical note\n\nThe command-line application is built with JavaScript and Node.js.",
    techStack: ["JavaScript", "Node.js", "Data Structures"],
    repo: "sparse_matrix",
  },
  {
    title: "Data Structures and Algorithms",
    domain: "Foundations · Algorithms",
    category: Category.FOUNDATIONS,
    iconKey: "🧮",
    shortDescription:
      "A growing collection of data structures and algorithm exercises that keeps my engineering foundations active and honest.",
    fullDescription:
      "## Why I keep it\n\nLarger applications still depend on basic ideas such as choosing the right structure, understanding complexity, and solving a problem step by step. This repository is where I keep practising those foundations.\n\n## What I am learning\n\nThe exercises help me improve problem solving, recognise common patterns, and write solutions that are easier to explain and reason about. It is ongoing learning rather than a finished product.",
    techStack: ["Python", "Algorithms", "Data Structures"],
    repo: "DSA",
  },
];

// Every project starts with no media, so the card renders its styled placeholder.
export const DEFAULT_MEDIA_TYPE = MediaType.NONE;
