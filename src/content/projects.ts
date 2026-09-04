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
      "Investigates how compact and transfer-learning CNNs compare on malaria cell images, with my baseline model reaching 0.9647 F1 on the held-out test set.",
    fullDescription: `## The problem

Malaria diagnosis depends on trained professionals examining blood-smear microscopy, yet specialist time and laboratory capacity are limited in many of the communities most affected by the disease. This study asks a focused technical question: **how reliably can different convolutional-network approaches distinguish parasitised from uninfected single-cell images under one fair evaluation pipeline?**

## Who this work is intended to serve

The long-term beneficiaries would be laboratory professionals and clinics that need dependable decision-support tools, particularly in resource-constrained settings. This project is a comparative research study, however—not a clinical product—and it has not been tested in a healthcare workflow.

## What we investigated

Our five-person ALU team compared a baseline CNN, an advanced CNN, VGG16, ResNet50, and MobileNetV2. Every model used the same fixed 80/20 split of the NIH Malaria Cell Images dataset and went through seven controlled experiments so that architectural and training choices could be compared fairly.

## My contribution

I owned the baseline CNN: a deliberately simple two-block network trained from scratch to establish the performance floor for the more complex approaches. I ran seven experiments changing one factor at a time, including learning rate, dropout, augmentation, and batch size.

## Evidence so far

- The shared dataset contains 27,558 balanced single-cell images.
- All models were evaluated on the same 5,512-image held-out test set.
- My strongest baseline reached **0.9650 accuracy, 0.9647 F1, and 0.9938 AUC**.
- All five approaches finished within 0.003 F1, an important finding: complexity did not automatically produce a meaningful advantage at the chosen image resolution.

## Limitations

These results come from a curated public dataset of segmented cells, not prospectively collected clinical cases. They do not establish diagnostic safety, performance across laboratories or populations, workflow usefulness, or regulatory readiness. A model error in this context could carry serious consequences.

## Intended impact and next question

The intended contribution is a reproducible foundation for investigating affordable diagnostic support—not a replacement for microscopists or clinicians. My next question would be whether a compact model can remain calibrated across locally collected images from different microscopes while communicating uncertainty clearly enough to support human review.`,
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
      "Explores alternative signals for financial inclusion by modelling bank-account access across 23,524 East African survey responses—with its limits stated clearly.",
    fullDescription: `## The problem

Many people across East Africa remain outside formal financial systems and therefore have little or no conventional financial history. That makes it difficult to explore inclusive services using the records that established institutions normally expect.

## Who this work is intended to serve

This exploration is motivated by people in Kenya, Rwanda, Tanzania, and Uganda who are financially active but underrepresented in formal records. It may also help researchers and responsible financial-service teams study alternative indicators of financial access.

## What I investigated

I used 23,524 responses from four national financial-inclusion surveys to investigate whether demographic, employment, household, location, and mobile-access variables could predict **bank-account ownership**. Because only about 14 percent of respondents held an account, I applied SMOTE only to the training data and compared four candidate models on an untouched test split.

## What I built

The Streamlit application supports individual assessment, interactive data exploration, and batch CSV processing. Its feature pipeline derives contextual indicators such as digital inclusion and economic vulnerability, while preserving the exact fitted preprocessing steps for inference.

## My contribution

I built the end-to-end project during my CodeAlpha internship: data validation, feature engineering, model comparison, saved inference pipeline, scoring interface, analytics views, and batch workflow.

## Evidence so far

- Four models were evaluated using test ROC-AUC.
- Logistic Regression performed best at **0.857 ROC-AUC**, ahead of Random Forest (0.841), Decision Tree (0.815), and KNN (0.788).
- The lighter logistic model was selected because it matched heavier alternatives while remaining easier to run and inspect.

## Limitations

This is not a validated credit-risk model. Its target is bank-account ownership—not repayment behaviour or creditworthiness—and demographic survey variables can encode historical exclusion. The data spans surveys from 2016 to 2018, no fairness audit or institutional pilot has yet been completed, and the resulting score must not be used to approve or deny a real person credit.

## Intended impact and next question

The intended impact is to support research into more inclusive financial systems without disguising a proxy as a decision-ready product. The next step is to work with financial-inclusion specialists, define an appropriate outcome, audit group-level errors and calibration, and study whether consented non-traditional data adds value without reproducing discrimination.`,
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
      "Explores inclusive telemedicine through mobile, web, and an offline USSD pathway, with separate AI support designed for clinicians and patients.",
    fullDescription: `## The problem

Distance, limited connectivity, fragmented records, and shortages of specialist support can all stand between African patients and understandable, continuous care. A smartphone-only product excludes many of the people most affected by those constraints.

## Who this work is intended to serve

HealthBridge Africa is designed around three groups: patients seeking access and understandable information, clinicians who need context during consultations, and administrators responsible for operating the service without viewing private medical records.

## What I investigated

I explored how one health platform could preserve a consistent care pathway across very different levels of connectivity—and how AI assistance could support, rather than replace, professional judgement.

## What I built

Patients can use a mobile or web interface, while a USSD gateway supports registration, consultation requests, and recent-history checks on basic phones without internet access. MedAssist supplies contextual clinical support to doctors; HealthGuide explains diagnoses and medication in plain language to patients. Role checks, explicit doctor-access approval, rate limiting, and protected health records are enforced on the backend.

## My contribution

I created and maintain the platform across the application, Node and MySQL backend, Python and Redis USSD gateway, access-control model, bilingual interface, and the two role-specific AI assistants.

## Evidence so far

- Three access channels: mobile, web, and USSD.
- Two purpose-specific AI assistants with explicit human-oversight boundaries.
- Thirteen automated backend tests covering core behaviour.
- English and French interfaces support broader regional accessibility.

## Limitations

HealthBridge Africa is a working prototype, not a deployed medical service. It has not undergone clinical validation, security certification, field evaluation, or regulatory review. The AI layer depends on an external model and can produce incorrect guidance; USSD availability also depends on telecom integration.

## Intended impact and next question

The intended impact is to make continuity of care and understandable health information more accessible across device and connectivity barriers. The next step is participatory research with patients and healthcare professionals to identify the smallest safe workflow worth piloting, define escalation rules, and evaluate usefulness before expanding features.`,
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
    fullDescription: `## The problem

Computer science students often build in isolation even when classmates around them need the same collaborators, feedback, or project experience. General social networks are not designed around the process of finding technical work, showing progress, and forming a team.

## Who this work is intended to serve

PeerForge is intended for computer science students who want to discover peers, contribute to projects, discuss technical ideas, and build a visible record of practical work.

## What I investigated

I explored what a student-builder network needs beyond a conventional feed: structured project posts, collaboration status, technical tags, real-time conversation, profiles, notifications, and a public portfolio of contributions.

## What I built

The platform combines a Next.js web application with a NestJS and Prisma API inside a Turborepo monorepo. Socket.IO carries real-time messaging, while Clerk authentication is verified across both REST requests and socket connections. Students can publish work, recruit collaborators, discuss ideas, save posts, and present their projects.

## My contribution

I designed and built the full-stack system, shared types, authentication flow, real-time layer, project and post experiences, and deployment structure.

## Evidence so far

- Separate web and API applications share contracts inside one monorepo.
- Authentication covers both HTTP and WebSocket communication.
- The implemented interface supports project discovery, collaboration states, discussions, messaging, notifications, and profiles.

## Limitations

The product has not yet demonstrated sustained adoption or improved collaboration outcomes. Recommendation quality, moderation, abuse prevention, accessibility testing, and the cold-start experience all require evaluation with real student communities.

## Intended impact and next question

The intended impact is to help students move from solitary coursework toward visible, collaborative practice. The next question is whether structured project matching actually leads to more completed collaborations—and which signals can improve matching without turning participation into a popularity contest.`,
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
      "Helps investigate four rice-leaf diseases from a photograph through a deployed, retrainable pipeline tested under simulated concurrent demand.",
    fullDescription: `## The problem

For a smallholder farmer, a rice disease can threaten both household food and annual income. Bacterial blight, blast, brown spot, and tungro require different responses, yet an expert may not be nearby when early symptoms first appear.

## Who this work is intended to serve

The intended users are smallholder rice farmers and agricultural extension workers who need an accessible first check in the field. The system is decision support only; it does not replace an agronomist or laboratory confirmation.

## What I investigated

I investigated whether a lightweight transfer-learning model could distinguish four visually similar diseases, run affordably in the cloud, expose its confidence, accept new labelled data, and continue learning through a controlled retraining workflow.

## What I built

The public application accepts a leaf photograph and returns per-class confidence scores. It also exposes dataset and service monitoring, bulk labelled-image upload, background retraining, health endpoints, and database records of predictions and training runs. MobileNetV2 was selected because its size fits the resource constraints better than a large network.

## My contribution

I built the complete pipeline: data preparation, exploratory analysis, two-stage training, evaluation, FastAPI service, browser interface, persistence, Docker deployment, retraining flow, monitoring, and Locust/Nginx scaling experiment.

## Evidence so far

- 5,932 labelled images across four approximately balanced disease classes.
- About **89% accuracy and 0.90 macro-F1** on 1,185 held-out images.
- A public Hugging Face deployment and recorded video demonstration.
- Under a simulated 50-user load, scaling from one to four containers increased throughput from 12.2 to 23.3 requests per second and reduced median latency from 3.6 to 1.2 seconds, with zero failed requests.

## Limitations

The dataset is not a field trial and covers only four known disease classes. Image quality, crop variety, geography, lighting, unfamiliar diseases, and early-stage symptoms may change performance. The classifier is not calibrated for real agricultural decisions and has not yet been evaluated with farmers or extension professionals.

## Intended impact and next question

The intended impact is earlier, more accessible disease recognition so that farmers can seek the right expert guidance before damage spreads. The next step is to co-design a field study, add an explicit “uncertain or unknown” pathway, and measure performance and usefulness on locally collected images rather than only a public benchmark.`,
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
      "Turns personal work logs into private, on-device insight, while exposing model quality and separating learned predictions from rule-based recommendations.",
    fullDescription: `## The problem

Time trackers record hours, but a list of timestamps rarely helps someone understand patterns, sustainability, or the reliability of a forecast. Sending detailed behavioural data to an analytics server also creates avoidable privacy and latency costs.

## Who this work is intended to serve

The application is intended for students, independent professionals, and other people who want evidence about their work habits while keeping the analytics on their own device.

## What I investigated

I investigated how far transparent, lightweight analytics can go on-device: unsupervised grouping of session depth, chronological forecasting of future hours, and reviewable heuristics for anomalies and patterns.

## What I built

The Flutter application runs three distinct engines. K-Means groups sessions and reports a silhouette score; ordinary least-squares regression reports MAE, RMSE, and R² on a held-out chronological tail before forecasting; and a clearly labelled rule-based engine detects unusual patterns and produces recommendations. Firebase synchronises each user's records under per-user security rules.

## My contribution

I built the cross-platform application, analytics implementations, validation metrics, real-time data layer, authentication, notifications, bilingual interface, security rules, automated tests, and continuous-integration workflow.

## Evidence so far

- Three complementary analytics engines run locally on the device.
- Forecast quality is evaluated on unseen historical data rather than the training observations.
- Automated tests cover clustering, forecasting, anomaly detection, score bounds, and a widget smoke test; CI runs formatting, static analysis, and tests on every change.
- One codebase targets Android, iOS, web, Windows, macOS, and Linux.

## Limitations

The forecaster is intentionally a one-feature linear baseline and cannot yet model seasonality or richer behavioural context. K-Means currently clusters duration alone, the application loads entries without pagination, and web notifications require an open browser tab. No longitudinal user study has established behaviour change or wellbeing benefits.

## Intended impact and next question

The intended impact is to help people reflect on work patterns without surrendering detailed personal data to a remote analytics service. The next question is whether transparent feedback changes planning decisions over time—and whether richer local features can improve predictions without making them harder to understand.`,
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
