import { db } from '../firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  increment,
  limit,
  where
} from 'firebase/firestore';
import { galleryData as staticGallery } from '../data/galleryData';

// Fallback Static Data in case DB is unseeded
const FALLBACK_HERO = {
  title: "Behaviour Change & \nIEC Specialist",
  subtitle: "9+ years building public systems, IEC/BCC strategy, and climate action programs across Andhra Pradesh & Telangana.",
  introText: "Hi, I am JSR Annamayya. I am a National Award winning Behaviour Change and IEC Specialist with over nine years of experience building public systems and driving climate action. Throughout my career, I have had the privilege of working with municipal corporations and environmental organizations across Andhra Pradesh and Telangana. I am honoured to have received the Vande Bharat Puraskar in 2023, the National Youth Icon Award in 2022, and the Indian Star Icon Award in 2021. Welcome to my portfolio."
};

const FALLBACK_ABOUT = {
  intro: "A Trailblazer in Environmental Sustainability and Leadership with 9 years of expertise in IEC strategies, solid waste management, corporate operations, and community development. Recognised for his innovative approaches, he has made a lasting impact in public service and corporate leadership.",
  eduBio: "JSR Annamayya holds a Gold Medal from Tirumala Engineering College with a B.Tech in Electrical & Electronics Engineering, an early testament to his dedication and pursuit of excellence. His technical acumen and innovative mindset have laid the foundation for his future contributions to society. He has taken the stage at numerous national forums in Delhi, representing India many times and sharing his insights on critical issues on SWM at the India Circular Economy Forum 2024.",
  serviceBio: "As an IEC Specialist in Andhra Pradesh municipal administrations, he influenced sustainable behavioural change among 2.2 million people, played a key role in the National Swachh Bharat rankings of the Government of India, and earned national recognition for best practices in environmental sustainability.",
  corporateBio: "At Wipro and Accenture, he led an 80+ member team, showcasing excellence in technical solutions, project management, and leadership for Silicon Valley clients including Google and Uber.",
  strengths: [
    "Government Expertise",
    "IEC & BCC Strategy",
    "Solid Waste Management (SWM)",
    "Urban Governance",
    "Climate & Sustainability Programs",
    "Stakeholder Engagement",
    "Capacity Building",
    "Citizen Mobilisation",
    "CSR & Institutional Partnerships",
    "Training & Public Speaking"
  ]
};

const FALLBACK_TIMELINE = [
  {
    number: "May 2024 – Feb 2026",
    title: "Council for Green Revolution",
    subtitle: "Assistant Director",
    text: "Led state-level environmental education & climate action initiatives with Dept. of School/College Education, Telangana Biodiversity Board, GHMC, and Forest Dept. Spearheaded the Young Earth Leaders Program (YELP), driving sustainability & youth-led climate advocacy.",
    order: 5
  },
  {
    number: "Apr 2023 – Mar 2024",
    title: "Nellore Municipal Corporation",
    subtitle: "IEC Expert",
    text: "Structured urban sanitation & municipal solid waste management (SWM) systems. Supervised technical coordination, field compliance, and citizen engagement. Driven outcomes linked directly to national Safai Mitra Suraksha recognition.",
    order: 4
  },
  {
    number: "Feb 2021 – Mar 2023",
    title: "Rajamahendravaram Municipal Corp.",
    subtitle: "IEC Specialist",
    text: "Designed robust community models and waste campaigns that achieved a 15% efficiency increase in door-to-door waste collection. Maintained operational scaling contributing to GFC Star Rating and Swachh Bharat milestones.",
    order: 3
  },
  {
    number: "Mar 2020 – Jan 2021",
    title: "Guntur Municipal Corporation",
    subtitle: "IEC / SWM Program Lead",
    text: "Directed large-scale citizen mobilisation and solid waste management campaigns. Spearheaded targeted communications that elevated Guntur's Swachh Survekshan rank from 121 to 4.",
    order: 2
  },
  {
    number: "2016 – 2019",
    title: "Wipro & Accenture",
    subtitle: "Quality Team Lead / Special Project Area Lead",
    text: "Managed project operations, structured delivery, and quality assurance workflows with teams of up to 40+ engineers for Silicon Valley enterprise clients before shifting focus toward high-impact public governance systems.",
    order: 1
  }
];

const FALLBACK_VIDEOS = [
  {
    title: 'Guntur Cleanliness Campaign (Rank 121 to 4)',
    description: 'Strategic behaviour change communication and SWM strategy that drove community waste segregation, lifting Guntur to national rank 4.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'SWM & Sanitation',
    date: '2020-08-15'
  },
  {
    title: 'Young Earth Leaders Program (YELP)',
    description: 'State-wide environmental education workshops empowering school and college students as environmental champions in Telangana.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Climate Action',
    date: '2025-01-10'
  },
  {
    title: 'Safai Mitra Suraksha Campaign - Nellore',
    description: 'Empowering and training public health workers in Nellore on safety compliance, urban sanitation, and municipal systems strengthening.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Urban Governance',
    date: '2023-09-01'
  },
  {
    title: 'Anytime Bag (ATB) Vending Machine',
    description: 'Demonstrating the ATB Cloth Bag Vending Machine, an innovative behavioural change intervention approved by UNDP to combat single-use plastic.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Innovation',
    date: '2022-11-20'
  }
];

const FALLBACK_STATS = [
  { value: '50+', label: 'Chief Commissioners' },
  { value: '150+', label: 'Environmental Engineers' },
  { value: '15,000+', label: 'Ward Volunteers' },
  { value: '10,000+', label: 'Public Health Workers' },
  { value: '50,000+', label: 'Rural Students Trained' }
];

const FALLBACK_AWARDS = [
  {
    title: 'Vande Bharat Puraskar',
    year: '2023',
    issuer: 'Govt. of Telangana',
    desc: 'Civilian honour for outstanding contribution and public service.'
  },
  {
    title: 'National Youth Icon Award',
    year: '2022',
    issuer: 'National Youth Parliament, Delhi',
    desc: 'Recognised for outstanding leadership and community engagement.'
  },
  {
    title: 'Indian Star Icon Award',
    year: '2021',
    issuer: 'National Human Rights Commission, Delhi',
    desc: 'Civilian recognition for contribution to public systems.'
  },
  {
    title: 'Best Government Service Award',
    year: '2020',
    issuer: 'Govt. of Andhra Pradesh',
    desc: 'Recognised for outstanding public systems leadership and sanitation reforms.'
  },
  {
    title: 'Gold Medalist',
    year: '2016',
    issuer: 'Tirumala Engineering College (TEC), JNTUK',
    desc: 'Academic gold medalist in Electrical & Electronics Engineering.'
  },
  {
    title: 'Best Start-Up Idea Award Holder',
    year: '2016',
    issuer: 'Telangana, Startup Carnival',
    desc: 'Awarded for best start-up idea presentation.'
  },
  {
    title: 'Solar Innovation Presentation Champion',
    year: '2015',
    issuer: '40+ National Engineering Colleges',
    desc: 'Recognised by 40+ national engineering colleges for best presentations on solar innovation, including an original solar tree design.'
  }
];

// --- API ACTIONS ---

// 1. Hero Content
export const getHeroContent = async () => {
  try {
    const docRef = doc(db, 'content', 'hero');
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : FALLBACK_HERO;
  } catch (e) {
    console.warn("Firestore fetch failed, returning static hero data", e);
    return FALLBACK_HERO;
  }
};

export const updateHeroContent = async (data) => {
  const docRef = doc(db, 'content', 'hero');
  await setDoc(docRef, data, { merge: true });
};

// 2. About Content
export const getAboutContent = async () => {
  try {
    const docRef = doc(db, 'content', 'about');
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : FALLBACK_ABOUT;
  } catch (e) {
    console.warn("Firestore fetch failed, returning static about data", e);
    return FALLBACK_ABOUT;
  }
};

export const updateAboutContent = async (data) => {
  const docRef = doc(db, 'content', 'about');
  await setDoc(docRef, data, { merge: true });
};

// Generic Collection Fetch Helper
const getSortedCollection = async (colName, fallback) => {
  try {
    const q = query(collection(db, colName), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    if (snap.empty) {
      // Try un-ordered query if ordered is empty
      const rawSnap = await getDocs(collection(db, colName));
      if (rawSnap.empty) return fallback;
      return rawSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn(`Firestore fetch failed for ${colName}, returning static data`, e);
    return fallback.map((item, idx) => ({ id: String(idx + 1), ...item }));
  }
};

// 3. Timeline Experience
export const getTimelineStops = () => getSortedCollection('timeline', FALLBACK_TIMELINE);

export const saveTimelineStop = async (stop) => {
  if (stop.id) {
    const docRef = doc(db, 'timeline', stop.id);
    const { id, ...data } = stop;
    await setDoc(docRef, data, { merge: true });
  } else {
    await addDoc(collection(db, 'timeline'), stop);
  }
};

export const deleteTimelineStop = async (id) => {
  await deleteDoc(doc(db, 'timeline', id));
};

// 4. Video Campaigns
export const getVideos = () => getSortedCollection('videos', FALLBACK_VIDEOS);

export const saveVideo = async (video) => {
  if (video.id) {
    const docRef = doc(db, 'videos', video.id);
    const { id, ...data } = video;
    await setDoc(docRef, data, { merge: true });
  } else {
    await addDoc(collection(db, 'videos'), video);
  }
};

export const deleteVideo = async (id) => {
  await deleteDoc(doc(db, 'videos', id));
};

// 5. Stats
export const getStats = () => getSortedCollection('stats', FALLBACK_STATS);

export const saveStat = async (stat) => {
  if (stat.id) {
    const docRef = doc(db, 'stats', stat.id);
    const { id, ...data } = stat;
    await setDoc(docRef, data, { merge: true });
  } else {
    await addDoc(collection(db, 'stats'), stat);
  }
};

export const deleteStat = async (id) => {
  await deleteDoc(doc(db, 'stats', id));
};

// 6. Awards
export const getAwards = () => getSortedCollection('awards', FALLBACK_AWARDS);

export const saveAward = async (award) => {
  if (award.id) {
    const docRef = doc(db, 'awards', award.id);
    const { id, ...data } = award;
    await setDoc(docRef, data, { merge: true });
  } else {
    await addDoc(collection(db, 'awards'), award);
  }
};

export const deleteAward = async (id) => {
  await deleteDoc(doc(db, 'awards', id));
};

// 7. Gallery
export const getGalleryImages = () => {
  // Convert static imports into a direct array matching schema
  const fallbackList = staticGallery.map(img => ({
    image: img.image,
    caption: img.caption
  }));
  return getSortedCollection('gallery', fallbackList);
};

export const saveGalleryImage = async (img) => {
  if (img.id) {
    const docRef = doc(db, 'gallery', img.id);
    const { id, ...data } = img;
    await setDoc(docRef, data, { merge: true });
  } else {
    await addDoc(collection(db, 'gallery'), img);
  }
};

export const deleteGalleryImage = async (id) => {
  await deleteDoc(doc(db, 'gallery', id));
};

// --- CONTACT FORM SUBMISSIONS ---
export const submitContactForm = async (formData) => {
  await addDoc(collection(db, 'contacts'), {
    ...formData,
    createdAt: new Date().toISOString()
  });
};

export const getContactMessages = async () => {
  try {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn("Firestore fetch failed for contacts, fallback to raw", e);
    try {
      const snap = await getDocs(collection(db, 'contacts'));
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error(err);
      return [];
    }
  }
};

export const deleteContactMessage = async (id) => {
  await deleteDoc(doc(db, 'contacts', id));
};

// --- INVITED TALKS ---
export const getTalks = async () => {
  try {
    const docRef = doc(db, 'content', 'talks');
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data().talks) {
      return snap.data().talks;
    }
    return [
      'Centre for Science and Environment (CSE), New Delhi',
      'IIT Indore',
      'BITS Pilani, Hyderabad Campus',
      'Osmania University',
      'India MHM Summit, New Delhi',
      'UNDP BIOFIN Program',
      'Tirumala Tirupati Devasthanams (TTD)'
    ];
  } catch (e) {
    console.warn("Firestore fetch failed for talks, returning fallback", e);
    return [
      'Centre for Science and Environment (CSE), New Delhi',
      'IIT Indore',
      'BITS Pilani, Hyderabad Campus',
      'Osmania University',
      'India MHM Summit, New Delhi',
      'UNDP BIOFIN Program',
      'Tirumala Tirupati Devasthanams (TTD)'
    ];
  }
};

export const updateTalks = async (talksList) => {
  const docRef = doc(db, 'content', 'talks');
  await setDoc(docRef, { talks: talksList });
};

// --- GENERAL CONTACT/FOOTER SETTINGS ---
const FALLBACK_CONTACT = {
  email: "Sai.annamayya@gmail.com",
  phone: "7702012010",
  address: "Manikonda, Telangana",
  experienceYears: "9+ years of experience",
  specialties: [
    "Public Systems Specialist",
    "IEC & BCC Strategy Development",
    "Environmental Communication"
  ]
};

export const getContactSettings = async () => {
  try {
    const docRef = doc(db, 'content', 'contact');
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : FALLBACK_CONTACT;
  } catch (e) {
    console.warn("Firestore fetch failed for contact settings, returning fallback", e);
    return FALLBACK_CONTACT;
  }
};

export const updateContactSettings = async (data) => {
  const docRef = doc(db, 'content', 'contact');
  await setDoc(docRef, data, { merge: true });
};

// --- HERO SLIDES (SLIDER LIST) ---
export const getHeroSlides = async () => {
  const fallbackList = [
    {
      id: 'h1',
      order: 1,
      headline: "From an EEE Classroom to National Recognition",
      subtext: "Gold Medalist in Electrical & Electronics Engineering turned National Award-Winning Behaviour Change & IEC Specialist — 9+ years building public systems across Andhra Pradesh and Telangana.",
      imageUrl: ""
    },
    {
      id: 'h2',
      order: 2,
      headline: "Leading Teams, Then Leading Change",
      subtext: "Led an 80+ member team at Wipro and Accenture delivering for Silicon Valley clients including Google and Uber — before turning that same leadership toward public service.",
      imageUrl: ""
    },
    {
      id: 'h3',
      order: 3,
      headline: "Behavioural Change, at Scale",
      subtext: "Influenced sustainable behavioural change among 2.2 million people as an IEC Specialist across Andhra Pradesh's municipal administrations.",
      imageUrl: ""
    },
    {
      id: 'h4',
      order: 4,
      headline: "Innovating Where Policy Meets People",
      subtext: "Founder of Checkcovidnow and creator of the \"Any Time Bag\" solar-powered cloth bag vending machine — a UN-recognised innovation removing plastic waste at the exact moment it happens.",
      imageUrl: ""
    },
    {
      id: 'h5',
      order: 5,
      headline: "A Voice for Sustainable Governance, Nationally",
      subtext: "Speaker at the India Circular Economy Forum 2024 and national platforms in Delhi — carrying grassroots lessons to the national stage.",
      imageUrl: ""
    }
  ];

  try {
    const list = await getSortedCollection('heroSlides', []);
    if (!list || list.length === 0) {
      return fallbackList;
    }
    return list;
  } catch (e) {
    console.warn("Firestore fetch failed for heroSlides, returning fallback", e);
    return fallbackList;
  }
};

export const saveHeroSlide = async (slide) => {
  if (slide.id && slide.id !== 'default') {
    const docRef = doc(db, 'heroSlides', slide.id);
    const { id, ...data } = slide;
    await setDoc(docRef, data, { merge: true });
    await logSystemActivity('save_hero_slide', `Updated slide: ${slide.headline}`);
  } else {
    const { id, ...data } = slide;
    await addDoc(collection(db, 'heroSlides'), data);
    await logSystemActivity('save_hero_slide', `Created slide: ${slide.headline}`);
  }
};

export const deleteHeroSlide = async (id) => {
  if (id && id !== 'default') {
    await deleteDoc(doc(db, 'heroSlides', id));
    await logSystemActivity('delete_hero_slide', `Deleted slide: ${id}`);
  }
};

// --- TESTIMONIALS ---
export const getTestimonials = async () => {
  return getSortedCollection('testimonials', [
    {
      quote: "His strategic interventions in solid waste management helped our corporation achieve Swachh Bharat milestones.",
      author: "Municipal Commissioner",
      designation: "IAS Officer",
      company: "Nellore Municipal Corporation",
      order: 1
    }
  ]);
};

export const saveTestimonial = async (t) => {
  if (t.id) {
    const docRef = doc(db, 'testimonials', t.id);
    const { id, ...data } = t;
    await setDoc(docRef, data, { merge: true });
    await logSystemActivity('save_testimonial', `Updated testimonial by ${t.author}`);
  } else {
    await addDoc(collection(db, 'testimonials'), t);
    await logSystemActivity('save_testimonial', `Created testimonial by ${t.author}`);
  }
};

export const deleteTestimonial = async (id) => {
  await deleteDoc(doc(db, 'testimonials', id));
  await logSystemActivity('delete_testimonial', `Deleted testimonial: ${id}`);
};

// --- PRESS COVERAGE ---
export const getPressCoverage = async () => {
  return getSortedCollection('press', [
    {
      title: "Vande Bharat Puraskar Civilian Honour",
      source: "Telangana Today",
      date: "2023-11-10",
      url: "https://telanganatoday.com",
      image: "",
      order: 1
    }
  ]);
};

export const savePressItem = async (item) => {
  if (item.id) {
    const docRef = doc(db, 'press', item.id);
    const { id, ...data } = item;
    await setDoc(docRef, data, { merge: true });
    await logSystemActivity('save_press_item', `Updated press: ${item.title}`);
  } else {
    await addDoc(collection(db, 'press'), item);
    await logSystemActivity('save_press_item', `Created press: ${item.title}`);
  }
};

export const deletePressItem = async (id) => {
  await deleteDoc(doc(db, 'press', id));
  await logSystemActivity('delete_press_item', `Deleted press item: ${id}`);
};

// --- RESUME ---
export const getResumeUrl = async () => {
  try {
    const docRef = doc(db, 'content', 'resume');
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data().url : null;
  } catch (e) {
    console.warn("Firestore fetch failed for resume URL", e);
    return null;
  }
};

export const saveResumeUrl = async (url) => {
  const docRef = doc(db, 'content', 'resume');
  await setDoc(docRef, { url }, { merge: true });
  await logSystemActivity('save_resume', `Uploaded new resume PDF`);
};

// --- ANALYTICS EVENTS & DAILY ROLLUPS ---
export const logAnalyticsEvent = async (event) => {
  try {
    const eventDoc = {
      ...event,
      timestamp: new Date().toISOString()
    };
    await addDoc(collection(db, 'analyticsEvents'), eventDoc);

    // Aggregate into a daily rollup document
    const today = new Date().toISOString().split('T')[0];
    const rollupRef = doc(db, 'analyticsRollups', today);
    
    const updates = {};
    if (event.type === 'pageview') {
      updates.pageviews = increment(1);
    } else if (event.type === 'gallery_click') {
      updates.galleryClicks = increment(1);
      const label = event.label || 'unknown';
      const safeLabel = `gallery_${label.replace(/[^a-zA-Z0-9]/g, '_')}`;
      updates[safeLabel] = increment(1);
    } else if (event.type === 'resume_download') {
      updates.resumeDownloads = increment(1);
    } else if (event.type === 'resume_preview') {
      updates.resumePreviews = increment(1);
    } else if (event.type === 'contact_submit') {
      updates.contactSubmissions = increment(1);
    } else if (event.type === 'chatbot_message') {
      updates.chatbotMessages = increment(1);
    }
    
    if (event.device) {
      updates[`device_${event.device}`] = increment(1);
    }
    if (event.browser) {
      updates[`browser_${event.browser.replace(/[^a-zA-Z0-9]/g, '_')}`] = increment(1);
    }
    if (event.os) {
      updates[`os_${event.os.replace(/[^a-zA-Z0-9]/g, '_')}`] = increment(1);
    }
    if (event.city) {
      updates[`city_${event.city.replace(/[^a-zA-Z0-9]/g, '_')}`] = increment(1);
    }
    if (event.country) {
      updates[`country_${event.country.replace(/[^a-zA-Z0-9]/g, '_')}`] = increment(1);
    }
    
    await setDoc(rollupRef, updates, { merge: true });
  } catch (e) {
    console.error("Failed to log analytics event", e);
  }
};

export const getAnalyticsSummary = async () => {
  try {
    const snap = await getDocs(collection(db, 'analyticsRollups'));
    return snap.docs.map(d => ({ date: d.id, ...d.data() }));
  } catch (e) {
    console.error("Failed to fetch analytics rollups", e);
    return [];
  }
};

export const getRecentActivities = async (limitCount = 20) => {
  try {
    const q = query(
      collection(db, 'analyticsEvents'), 
      orderBy('timestamp', 'desc'), 
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn("Failed to fetch recent activities", e);
    return [];
  }
};

// --- CHATBOT LOGS ---
export const logChatbotMessage = async (sessionId, queryText, replyText, matchedQuestion = '', isFallback = false) => {
  try {
    const logDoc = {
      sessionId,
      query: queryText,
      reply: replyText,
      matchedQuestion,
      isFallback,
      timestamp: new Date().toISOString()
    };
    await addDoc(collection(db, 'chatbotLogs'), logDoc);
  } catch (e) {
    console.error("Failed to log chatbot message", e);
  }
};

// --- CHATBOT KNOWLEDGE BASE ---
export const FALLBACK_CHATBOT_KB = [
  {
    id: 'seed-1',
    question: "What does JSR Annamayya do?",
    keywords: ["who is he", "what does he do", "role", "profession"],
    answer: "JSR Annamayya is a National Award-Winning Behaviour Change & IEC Specialist with 9+ years leading solid waste management, environmental sustainability, and public systems reform across Andhra Pradesh and Telangana.",
    link: "#about"
  },
  {
    id: 'seed-2',
    question: "Tell me about his career journey.",
    keywords: ["career", "background", "experience", "work history", "journey"],
    answer: "He started as a Gold Medalist in Electrical & Electronics Engineering, led teams at Wipro and Accenture, then moved into public service — working across four municipal corporations before his current role at Council for Green Revolution.",
    link: "#experience"
  },
  {
    id: 'seed-3',
    question: "What awards has he won?",
    keywords: ["awards", "recognition", "honors", "achievements"],
    answer: "His recognitions include the Vande Bharat Puraskar (2023), National Youth Icon Award (2022), Indian Star Icon Award (2021), Best Government Service Award, and a Gold Medal from Tirumala Engineering College, among others.",
    link: "#impact"
  },
  {
    id: 'seed-4',
    question: "Tell me about Swachh Bharat / cleanliness campaigns.",
    keywords: ["swachh bharat", "swachh survekshan", "cleanliness", "ranking", "sanitation"],
    answer: "As an IEC Specialist across Andhra Pradesh's municipal administrations, he led citizen engagement and IEC strategy that contributed to major Swachh Survekshan ranking improvements and Garbage Free City progress.",
    link: "#case-studies"
  },
  {
    id: 'seed-5',
    question: "What is the \"Any Time Bag\" / ATB?",
    keywords: ["any time bag", "atb", "cloth bag", "vending machine", "plastic"],
    answer: "The Any Time Bag (ATB) is a solar-powered cloth bag vending machine he conceptualised — a UN-recognised innovation that gives shoppers a plastic-free alternative at the exact point of purchase.",
    link: "#case-studies"
  },
  {
    id: 'seed-6',
    question: "What services does he offer?",
    keywords: ["services", "consulting", "hire", "work with him", "offerings"],
    answer: "He offers Behaviour Change Communication strategy, IEC campaign design, waste management consulting, climate action program design, capacity building, government training, public speaking, CSR advisory, and policy support.",
    link: "#services"
  },
  {
    id: 'seed-7',
    question: "How can I contact him?",
    keywords: ["contact", "reach him", "email", "phone", "get in touch", "collaborate"],
    answer: "You can reach out directly through the contact form, email, or LinkedIn — I can pull those up for you right now.",
    link: "#contact"
  },
  {
    id: 'seed-8',
    question: "What is Checkcovidnow / Arogya Setu?",
    keywords: ["checkcovidnow", "arogya setu", "covid app", "innovation"],
    answer: "Checkcovidnow was recognised as the first rapid COVID-19 detection web app in Telangana — JSR is its founder.",
    link: "#about"
  },
  {
    id: 'seed-9',
    question: "What government departments has he worked with?",
    keywords: ["government departments", "collaborations", "ministries", "GHMC"],
    answer: "He's worked alongside the Government of Andhra Pradesh, Government of Telangana, GHMC, the Telangana Biodiversity Board, the Forest Department, and both School and Higher Education departments, among others.",
    link: "#collaborations"
  },
  {
    id: 'seed-10',
    question: "Where did he study?",
    keywords: ["education", "college", "degree", "university"],
    answer: "He holds a B.Tech in Electrical & Electronics Engineering from Tirumala Engineering College (JNTUK), graduating as a Gold Medalist.",
    link: "#about"
  }
];

export const getChatbotKB = async () => {
  try {
    const snap = await getDocs(collection(db, 'chatbotKnowledgeBase'));
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return list.length > 0 ? list : FALLBACK_CHATBOT_KB;
  } catch (e) {
    console.warn("Failed to fetch chatbot knowledge base, using fallback:", e);
    return FALLBACK_CHATBOT_KB;
  }
};

export const addChatbotKBEntry = async (entry) => {
  const docRef = await addDoc(collection(db, 'chatbotKnowledgeBase'), {
    question: entry.question,
    keywords: Array.isArray(entry.keywords) ? entry.keywords : String(entry.keywords).split(',').map(k => k.trim()).filter(Boolean),
    answer: entry.answer,
    link: entry.link || ''
  });
  await logSystemActivity('add_chatbot_faq', `Created FAQ: ${entry.question}`);
  return docRef.id;
};

export const updateChatbotKBEntry = async (id, entry) => {
  const docRef = doc(db, 'chatbotKnowledgeBase', id);
  await updateDoc(docRef, {
    question: entry.question,
    keywords: Array.isArray(entry.keywords) ? entry.keywords : String(entry.keywords).split(',').map(k => k.trim()).filter(Boolean),
    answer: entry.answer,
    link: entry.link || ''
  });
  await logSystemActivity('update_chatbot_faq', `Updated FAQ: ${entry.question}`);
};

export const deleteChatbotKBEntry = async (id) => {
  const docRef = doc(db, 'chatbotKnowledgeBase', id);
  await deleteDoc(docRef);
  await logSystemActivity('delete_chatbot_faq', `Deleted FAQ ID: ${id}`);
};

// --- SYSTEM AUDIT LOGS ---
export const logSystemActivity = async (action, details) => {
  try {
    const logDoc = {
      action,
      details,
      timestamp: new Date().toISOString(),
      user: auth.currentUser?.email || 'admin'
    };
    await addDoc(collection(db, 'systemLogs'), logDoc);
  } catch (e) {
    console.error("Failed to log system activity", e);
  }
};

export const getSystemLogs = async (limitCount = 30) => {
  try {
    const q = query(
      collection(db, 'systemLogs'), 
      orderBy('timestamp', 'desc'), 
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn("Failed to fetch system logs", e);
    return [];
  }
};

// --- SERVICES OFFERED ---
export const getServices = () => getSortedCollection('services', [
  { order: 1, title: 'Behaviour Change Communication Strategy', description: 'Developing public engagement campaigns and behavior change tools.', icon: 'FaLightbulb' },
  { order: 2, title: 'IEC Campaign Design', description: 'Information, Education & Communication layouts for municipal departments.', icon: 'FaAward' },
  { order: 3, title: 'Waste Management Consulting', description: 'Advisory on solid waste collection, segregation, and transport system design for municipal bodies.', icon: 'FaRecycle' },
  { order: 4, title: 'Climate Action Programs', description: 'Designing youth-led and institutional climate/biodiversity education initiatives.', icon: 'FaGlobe' },
  { order: 5, title: 'Capacity Building', description: 'Structured training programs for government staff, ward volunteers, and public health workers.', icon: 'FaUsers' },
  { order: 6, title: 'Government Training', description: 'Facilitating skill and awareness sessions for municipal commissioners, engineers, and field staff.', icon: 'FaChalkboardTeacher' },
  { order: 7, title: 'Public Speaking', description: 'Keynotes, panels, and faculty sessions on sustainability, governance, and behaviour change.', icon: 'FaVolumeUp' },
  { order: 8, title: 'CSR Advisory', description: 'Guiding corporate partners on sustainability-linked CSR program design and execution.', icon: 'FaHandshake' },
  { order: 9, title: 'Policy Support', description: 'Contributing to policy development and institutional partnership frameworks (e.g. menstrual health management policy work in Delhi).', icon: 'FaFileContract' }
]);

export const saveService = async (service) => {
  if (service.id) {
    const docRef = doc(db, 'services', service.id);
    const { id, ...data } = service;
    await setDoc(docRef, data, { merge: true });
  } else {
    await addDoc(collection(db, 'services'), service);
  }
};

export const deleteService = async (id) => {
  await deleteDoc(doc(db, 'services', id));
};

// --- GOVERNMENT DEPARTMENTS ---
export const getDepartments = () => getSortedCollection('departments', [
  { order: 1, name: 'Government of Andhra Pradesh', logo: '' },
  { order: 2, name: 'Government of Telangana', logo: '' },
  { order: 3, name: 'Greater Hyderabad Municipal Corporation (GHMC)', logo: '' },
  { order: 4, name: 'Telangana Biodiversity Board', logo: '' },
  { order: 5, name: 'Telangana Forest Department', logo: '' },
  { order: 6, name: 'Department of School Education', logo: '' },
  { order: 7, name: 'Department of College Education (Higher Education)', logo: '' },
  { order: 8, name: 'Municipal Administration & Urban Development Department', logo: '' }
]);

export const saveDepartment = async (dept) => {
  if (dept.id) {
    const docRef = doc(db, 'departments', dept.id);
    const { id, ...data } = dept;
    await setDoc(docRef, data, { merge: true });
  } else {
    await addDoc(collection(db, 'departments'), dept);
  }
};

export const deleteDepartment = async (id) => {
  await deleteDoc(doc(db, 'departments', id));
};

// --- INNOVATIONS ---
export const getInnovations = () => getSortedCollection('innovations', [
  { order: 1, title: 'Checkcovidnow / Arogya Setu', description: 'Recognised as the first rapid COVID-19 detection web app in Telangana; JSR is its founder.' },
  { order: 2, title: 'Any Time Bag (ATB) Cloth Bag Vending Machine', description: 'A United Nations-recognised initiative combating plastic pollution and avoiding single-use plastic covers.' },
  { order: 3, title: 'Municipal Chatbot & Command Control Unit', description: 'Enhancing citizen engagement in waste management with technology at the doorstep level.' },
  { order: 4, title: 'Green Saving Concepts & Quick Response Team', description: 'Addressing plastic waste and mobilising communities.' }
]);

export const saveInnovation = async (innovation) => {
  if (innovation.id) {
    const docRef = doc(db, 'innovations', innovation.id);
    const { id, ...data } = innovation;
    await setDoc(docRef, data, { merge: true });
  } else {
    await addDoc(collection(db, 'innovations'), innovation);
  }
};

export const deleteInnovation = async (id) => {
  await deleteDoc(doc(db, 'innovations', id));
};

// --- CASE STUDIES ---
export const getCaseStudies = () => getSortedCollection('caseStudies', [
  { 
    order: 1, 
    title: 'Guntur Swachh Survekshan Rank Improvement', 
    organisation: 'Guntur Municipal Corporation', 
    dateRange: '2020 – 2021',
    coverImage: '',
    tags: ['SWM', 'IEC', 'Governance'],
    problem: 'Guntur ranked poorly nationally in the Swachh Survekshan cleanliness survey, reflecting weak citizen participation, inconsistent waste segregation, and limited IEC outreach.',
    objective: 'Lift Guntur\'s national ranking through citizen engagement and improved municipal solid-waste systems.',
    strategy: 'Led IEC and citizen engagement interventions integrated directly into the city\'s sanitation and solid waste management programs.',
    implementation: 'Ground-level campaigns and coordination with municipal sanitation teams, citizen mobilization drives, and IEC messaging aligned to Swachh Survekshan evaluation criteria.',
    results: 'Guntur\'s Swachh Survekshan rank rose substantially over this period, alongside progress on Garbage Free City status (121st to 4th nationally).',
    lessons: 'Rank improvement in national cleanliness surveys depends as much on sustained citizen-facing communication as on operational fixes — IEC and civic engagement were treated as core infrastructure, not an add-on.'
  },
  {
    order: 2,
    title: 'Any Time Bag (ATB): Solar-Powered Cloth Bag Vending Machine',
    organisation: 'GHMC / United Way of Hyderabad',
    dateRange: '2023',
    coverImage: '',
    tags: ['Climate Action', 'Innovation', 'Plastic Reduction'],
    problem: 'Persistent single-use plastic bag usage in retail and market settings despite state-level plastic bans, driven by lack of convenient reusable alternatives at the point of purchase.',
    objective: 'Provide an on-the-spot, convenient alternative to plastic bags that changes shopper behaviour at the exact moment of the habit.',
    strategy: 'Conceptualise a coin/solar-powered vending machine dispensing cloth bags directly at markets, paired with citizen-facing IEC to drive adoption; positioned as a UNDP-recognised behaviour-change innovation.',
    implementation: 'Installed India\'s first solar-powered cloth bag vending machine ("Any Time Bag") at a fruit market in Hyderabad, in partnership with GHMC, United Way of Hyderabad, and InstaGood Technology Solutions; launched around World Environment Day 2023 with the Environment Minister in attendance.',
    results: 'Functioning installation reducing single-use plastic bag dependency at the market; recognised as a UNDP-aligned sustainability innovation.',
    lessons: 'Behaviour-change tools succeed when they remove friction at the exact decision point (point-of-purchase) rather than relying on awareness messaging alone.'
  },
  {
    order: 3,
    title: 'Menstrual Health Management (MHM) Advocacy at the India MHM Summit',
    organisation: 'Gramalaya / NDMC',
    dateRange: '2022',
    coverImage: '',
    tags: ['Public Health', 'IEC', 'Policy Support'],
    problem: 'Limited corporate and institutional engagement in menstrual health management, with eco-friendly product adoption and school-level education lagging.',
    objective: 'Advocate for corporate and policy involvement in MHM education, eco-friendly product piloting, and school/community outreach.',
    strategy: 'Participate as an invited speaker at a national summit convening policymakers, corporates, and NGOs to share field-tested IEC practices in MHM.',
    implementation: 'Delivered a summit address and joined panel discussions at the India MHM Summit (3rd edition) hosted by Gramalaya at NDMC, New Delhi; shared field results on eco-friendly menstrual hygiene products piloted in schools and communities.',
    results: 'Contributed to national-level dialogue and policy visibility on MHM; strengthened his profile as a resource person on public-health IEC practice.',
    lessons: 'Cross-sector platforms (government, corporate, NGO) accelerate adoption of public-health innovations faster than single-institution efforts.'
  }
]);

export const saveCaseStudy = async (cs) => {
  if (cs.id) {
    const docRef = doc(db, 'caseStudies', cs.id);
    const { id, ...data } = cs;
    await setDoc(docRef, data, { merge: true });
  } else {
    await addDoc(collection(db, 'caseStudies'), cs);
  }
};

export const deleteCaseStudy = async (id) => {
  await deleteDoc(doc(db, 'caseStudies', id));
};

// --- CAREER HIGHLIGHTS ---
export const getHighlights = () => getSortedCollection('highlights', [
  { order: 1, headline: 'National Award Winner (Vande Bharat Puraskar)', year: '2023', icon: 'FaTrophy' },
  { order: 2, headline: 'Launched "Any Time Bag" Solar Vending Machine (UNDP Recognised)', year: '2023', icon: 'FaLightbulb' },
  { order: 3, headline: 'National Youth Icon Awardee, New Delhi', year: '2022', icon: 'FaAward' },
  { order: 4, headline: 'Indian Star Icon Awardee, New Delhi', year: '2021', icon: 'FaStar' },
  { order: 5, headline: 'Led Guntur\'s Swachh Survekshan Rank Improvement to 4th', year: '2020–2021', icon: 'FaChartBar' },
  { order: 6, headline: 'Managed Project execution with a 40+ Engineer Team at Accenture', year: '2019', icon: 'FaBuilding' },
  { order: 7, headline: 'Led a 15-person Quality Analyst Team at Wipro for Silicon Valley', year: '2016–2019', icon: 'FaBuilding' },
  { order: 8, headline: 'Gold Medalist in Electrical & Electronics Engineering, TEC', year: '2016', icon: 'FaAward' },
  { order: 9, headline: 'Worked across 4 Municipal Corporations (Guntur, Rajamahendravaram, Nellore, CGR)', year: 'Ongoing', icon: 'FaBuilding' },
  { order: 10, headline: 'Invited Speaker at IIT Indore, BITS Pilani, Osmania University, etc.', year: 'Ongoing', icon: 'FaVolumeUp' }
]);

export const saveHighlight = async (h) => {
  if (h.id) {
    const docRef = doc(db, 'highlights', h.id);
    const { id, ...data } = h;
    await setDoc(docRef, data, { merge: true });
  } else {
    await addDoc(collection(db, 'highlights'), h);
  }
};

export const deleteHighlight = async (id) => {
  await deleteDoc(doc(db, 'highlights', id));
};
