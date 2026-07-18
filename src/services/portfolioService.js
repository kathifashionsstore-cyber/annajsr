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
import { portfolioData } from '../data/portfolioData';

// Fallback Static Data in case DB is unseeded
const FALLBACK_HERO = {
  title: portfolioData.profile.designation,
  subtitle: portfolioData.profile.bio.intro,
  introText: portfolioData.profile.bio.bio1,
  imageUrl: portfolioData.profile.images.heroPortrait
};

const FALLBACK_ABOUT = {
  intro: portfolioData.profile.bio.intro,
  eduBio: portfolioData.profile.bio.bio2,
  serviceBio: portfolioData.profile.bio.bio1,
  corporateBio: portfolioData.profile.bio.bio3,
  strengths: portfolioData.profile.strengths,
  imageUrl: portfolioData.profile.images.profileAlt
};

const FALLBACK_TIMELINE = portfolioData.experience.map((exp, idx) => ({
  number: exp.dateRange,
  title: exp.organisation,
  subtitle: exp.role,
  text: exp.description,
  order: exp.order || (idx + 1)
}));

const FALLBACK_VIDEOS = [
  {
    title: 'Guntur Cleanliness Campaign (Rank 121 to 4)',
    description: 'Strategic behaviour change communication and SWM strategy that drove community waste segregation, lifting Guntur to national rank 4.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'SWM & Sanitation',
    date: '2020-08-15',
    order: 1
  },
  {
    title: 'Young Earth Leaders Program (YELP)',
    description: 'State-wide environmental education workshops empowering school and college students as environmental champions in Telangana.',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Climate Action',
    date: '2025-01-10',
    order: 2
  }
];

const FALLBACK_STATS = portfolioData.stats.map((st, idx) => ({
  value: st.value,
  label: st.label,
  order: idx + 1
}));

const FALLBACK_AWARDS = portfolioData.awards.map((aw, idx) => ({
  title: aw.title,
  year: aw.year,
  issuer: aw.issuer,
  desc: aw.desc,
  order: idx + 1
}));


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
  email: portfolioData.profile.email,
  phone: portfolioData.profile.phone,
  address: portfolioData.profile.address,
  experienceYears: "9+ years of experience",
  specialties: portfolioData.profile.strengths
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
  const fallbackList = portfolioData.heroSlides.map((slide, idx) => ({
    id: slide.id || `h${idx + 1}`,
    order: slide.order || idx + 1,
    headline: slide.headline,
    subtext: slide.subtext,
    imageUrl: ""
  }));

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
  return getSortedCollection('testimonials', portfolioData.testimonials.map((t, idx) => ({
    quote: t.quote,
    author: t.author,
    designation: t.designation,
    company: t.company,
    order: idx + 1
  })));
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
export const getServices = () => getSortedCollection('services', portfolioData.services.map((s, idx) => ({
  order: s.order || idx + 1,
  title: s.title,
  description: s.description,
  icon: s.icon
})));

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
export const getDepartments = () => getSortedCollection('departments', portfolioData.departments.map((d, idx) => ({
  order: d.order || idx + 1,
  name: d.name,
  logo: d.logo || ''
})));

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
export const getInnovations = () => getSortedCollection('innovations', portfolioData.innovations.map((inv, idx) => ({
  order: inv.order || idx + 1,
  title: inv.title,
  description: inv.description
})));

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
export const getCaseStudies = () => getSortedCollection('caseStudies', portfolioData.caseStudies.map((cs, idx) => ({
  order: cs.order || idx + 1,
  title: cs.title,
  organisation: cs.organisation,
  dateRange: cs.dateRange,
  coverImage: cs.image || '',
  tags: cs.tags || [],
  problem: cs.problem || '',
  objective: cs.objective || '',
  strategy: cs.strategy || '',
  implementation: cs.implementation || '',
  results: cs.results || '',
  lessons: cs.lessons || ''
})));

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
export const getHighlights = () => getSortedCollection('highlights', portfolioData.highlights.map((h, idx) => ({
  order: h.order || idx + 1,
  headline: h.headline,
  year: h.year,
  icon: h.icon
})));

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

// --- VISION & LEADERSHIP ---
export const getVisionBlocks = () => getSortedCollection('vision', portfolioData.vision.map((v, idx) => ({
  number: v.number || `0${idx + 1}`,
  title: v.title,
  paragraph: v.paragraph,
  image: v.image || '',
  order: idx + 1
})));

export const saveVisionBlock = async (v) => {
  if (v.id) {
    const docRef = doc(db, 'vision', v.id);
    const { id, ...data } = v;
    await setDoc(docRef, data, { merge: true });
  } else {
    await addDoc(collection(db, 'vision'), v);
  }
};

export const deleteVisionBlock = async (id) => {
  await deleteDoc(doc(db, 'vision', id));
};

// --- SKILLS ---
export const getSkills = () => getSortedCollection('skills', [
  { label: "Behaviour Change Communication", target: 100, order: 1 },
  { label: "IEC Strategy", target: 100, order: 2 },
  { label: "Community Mobilisation", target: 100, order: 3 },
  { label: "Program Leadership", target: 100, order: 4 }
]);

export const saveSkill = async (s) => {
  if (s.id) {
    const docRef = doc(db, 'skills', s.id);
    const { id, ...data } = s;
    await setDoc(docRef, data, { merge: true });
  } else {
    await addDoc(collection(db, 'skills'), s);
  }
};

export const deleteSkill = async (id) => {
  await deleteDoc(doc(db, 'skills', id));
};

// --- ONGOING DEVELOPMENT ---
export const getDevelopment = () => getSortedCollection('development', portfolioData.development.map((d, idx) => ({
  year: d.year,
  program: d.program,
  institution: d.institution,
  description: d.description,
  order: idx + 1
})));

export const saveDevelopment = async (d) => {
  if (d.id) {
    const docRef = doc(db, 'development', d.id);
    const { id, ...data } = d;
    await setDoc(docRef, data, { merge: true });
  } else {
    await addDoc(collection(db, 'development'), d);
  }
};

export const deleteDevelopment = async (id) => {
  await deleteDoc(doc(db, 'development', id));
};

