import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  console.error("❌ Error: Firebase Admin variables missing in api/.env. Please configure them first.");
  process.exit(1);
}

if (privateKey.includes('YOUR_KEY_HERE')) {
  console.log("⚠️ Notice: Firebase Admin private key is a placeholder. Seeding skipped in local dev verification mode.");
  process.exit(0);
}

// Initialize Admin App
initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'), // Replace escaped newlines
  })
});

const db = getFirestore();

// 1. Singleton Hero
const heroData = {
  title: "Behaviour Change & \nIEC Specialist",
  subtitle: "9+ years building public systems, IEC/BCC strategy, and climate action programs across Andhra Pradesh & Telangana.",
  introText: "Hi, I am JSR Annamayya. I am a National Award winning Behaviour Change and IEC Specialist with over nine years of experience building public systems and driving climate action. Throughout my career, I have had the privilege of working with municipal corporations and environmental organizations across Andhra Pradesh and Telangana. I am honoured to have received the Vande Bharat Puraskar in 2023, the National Youth Icon Award in 2022, and the Indian Star Icon Award in 2021. Welcome to my portfolio."
};

const heroSlidesData = [
  {
    order: 1,
    headline: "From an EEE Classroom to National Recognition",
    subtext: "Gold Medalist in Electrical & Electronics Engineering turned National Award-Winning Behaviour Change & IEC Specialist — 9+ years building public systems across Andhra Pradesh and Telangana.",
    imageUrl: ""
  },
  {
    order: 2,
    headline: "Turning Government Systems Into Movements",
    subtext: "From corporate delivery at Wipro and Accenture to leading IEC and sanitation reform inside four municipal corporations — building the bridge between institutions and citizens.",
    imageUrl: ""
  },
  {
    order: 3,
    headline: "Behind Guntur's Rise to Rank 4",
    subtext: "Led citizen engagement and IEC strategy behind Guntur's national Swachh Survekshan turnaround — proof that public behaviour change is designable, not accidental.",
    imageUrl: ""
  },
  {
    order: 4,
    headline: "Innovating Where Policy Meets People",
    subtext: "Creator of the \"Any Time Bag\" solar-powered cloth bag vending machine — a UNDP-recognised innovation removing plastic waste at the exact moment it happens.",
    imageUrl: ""
  },
  {
    order: 5,
    headline: "A Voice for Sustainable Governance, Nationally",
    subtext: "Invited speaker at IIT Indore, BITS Pilani, CSE New Delhi, and the India MHM Summit — carrying grassroots lessons from Andhra Pradesh and Telangana to national platforms.",
    imageUrl: ""
  }
];

// 2. Singleton About
const aboutData = {
  bio1: "Graduated as a Gold Medallist in Electrical & Electronics Engineering (EEE) from Tirumala Engineering College, Narasaraopet, presenting over 21 technical papers at prestigious institutions like BITS Pilani, JNTUH, and Anna University.",
  bio2: "Started professional career in the software corporate world at Accenture and Wipro (2016–2019) as a Quality Team Lead and Special Project Area Lead, managing large engineering delivery operations before transitioning full-time into public systems governance.",
  bio3: "Since transitioning, has driven extensive solid waste management (SWM) campaigns and Behaviour Change Communication (BCC/IEC) programs across municipal administrations and departments in Andhra Pradesh and Telangana. Guided state-level environmental initiatives like the Young Earth Leaders Program, training 50,000+ students across 500+ government schools and 100+ colleges, and dedicating 2,080+ hours of community outreach.",
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

// 3. Timeline stops
const timelineData = [
  {
    order: 1,
    number: "2016 – 2019",
    title: "Wipro & Accenture",
    subtitle: "Quality Team Lead / Special Project Area Lead",
    text: "Managed project operations, structured delivery, and quality assurance workflows with teams of up to 40+ engineers for Silicon Valley enterprise clients before shifting focus toward high-impact public governance systems."
  },
  {
    order: 2,
    number: "Mar 2020 – Jan 2021",
    title: "Guntur Municipal Corporation",
    subtitle: "IEC / SWM Program Lead",
    text: "Directed large-scale citizen mobilisation and solid waste management campaigns. Spearheaded targeted communications that elevated Guntur's Swachh Survekshan rank from 121 to 4."
  },
  {
    order: 3,
    number: "Feb 2021 – Mar 2023",
    title: "Rajamahendravaram Municipal Corp.",
    subtitle: "IEC Specialist",
    text: "Designed robust community models and waste campaigns that achieved a 15% efficiency increase in door-to-door waste collection. Maintained operational scaling contributing to GFC Star Rating and Swachh Bharat milestones."
  },
  {
    order: 4,
    number: "Apr 2023 – Mar 2024",
    title: "Nellore Municipal Corporation",
    subtitle: "IEC Expert",
    text: "Structured urban sanitation & municipal solid waste management (SWM) systems. Supervised technical coordination, field compliance, and citizen engagement. Driven outcomes linked directly to national Safai Mitra Suraksha recognition."
  },
  {
    order: 5,
    number: "May 2024 – Feb 2026",
    title: "Council for Green Revolution",
    subtitle: "Assistant Director",
    text: "Led state-level environmental education & climate action initiatives with Dept. of School/College Education, Telangana Biodiversity Board, GHMC, and Forest Dept. Spearheaded the Young Earth Leaders Program (YELP), driving sustainability & youth-led climate advocacy."
  }
];

// 4. Services Offered
const servicesData = [
  { order: 1, title: 'Behaviour Change Communication Strategy', description: 'Developing public engagement campaigns and behavior change tools.', icon: 'FaLightbulb' },
  { order: 2, title: 'IEC Campaign Design', description: 'Information, Education & Communication layouts for municipal departments.', icon: 'FaAward' },
  { order: 3, title: 'Waste Management Consulting', description: 'Consulting on SWM (Solid Waste Management) models.', icon: 'FaRecycle' },
  { order: 4, title: 'Climate Action Programs', description: 'Designing sustainability campaigns and eco workshops.', icon: 'FaGlobe' },
  { order: 5, title: 'Capacity Building', description: 'Training sessions and skill development for stakeholders.', icon: 'FaUsers' },
  { order: 6, title: 'Government Training', description: 'Structured public sector workshops for officials.', icon: 'FaChalkboardTeacher' },
  { order: 7, title: 'Public Speaking', description: 'Inspiring addresses at academic and civic summits.', icon: 'FaVolumeUp' },
  { order: 8, title: 'CSR Advisory', description: 'Partnering with corporates for social impact projects.', icon: 'FaHandshake' },
  { order: 9, title: 'Policy Support', description: 'Advising municipal authorities on clean policies.', icon: 'FaFileContract' }
];

// 5. Government Collaborations
const departmentsData = [
  { order: 1, name: 'Government of Andhra Pradesh', logo: '' },
  { order: 2, name: 'Government of Telangana', logo: '' },
  { order: 3, name: 'GHMC', logo: '' },
  { order: 4, name: 'Telangana Biodiversity Board', logo: '' },
  { order: 5, name: 'Forest Department', logo: '' },
  { order: 6, name: 'School Education Department', logo: '' },
  { order: 7, name: 'Higher Education Department', logo: '' },
  { order: 8, name: 'Municipal Administration Department', logo: '' }
];

// 6. Case Studies
const caseStudiesData = [
  { 
    order: 1, 
    title: 'Guntur Swachh Survekshan Rank 121 to 4', 
    organisation: 'Guntur Municipal Corporation', 
    dateRange: '2020 - 2021',
    coverImage: '',
    tags: ['SWM', 'IEC', 'Governance'],
    problem: 'Low citizen engagement and sub-optimal solid waste management ranking.',
    objective: 'Elevate solid waste awareness and improve city cleanliness ranking.',
    strategy: 'Mass communication campaigns and behavior change workshops.',
    implementation: 'Direct engagement with sanitation workers and ward level programs.',
    results: 'Elevated Guntur’s national ranking from 121 to 4.',
    lessons: 'Grassroots community outreach is critical for structural governance success.'
  },
  {
    order: 2,
    title: '15% segregation efficiency gain',
    organisation: 'Rajamahendravaram Municipal Corp.',
    dateRange: '2021 - 2023',
    tags: ['SWM', 'IEC', 'BCC'],
    problem: 'Low waste segregation compliance at households level.',
    objective: 'Boost household door-to-door segregation rates.',
    strategy: 'Grassroots household campaigns and community waste profiling.',
    implementation: 'BCC interventions and waste collection tracking models.',
    results: 'Increased door-to-door segregation efficiency by 15%.',
    lessons: 'Targeted behavior change models are highly effective at scale.'
  }
];

// 7. Career Highlights
const highlightsData = [
  { order: 1, headline: '9+ years of experience', year: '', icon: 'FaHistory' },
  { order: 2, headline: 'National Award Winner', year: '2023', icon: 'FaTrophy' },
  { order: 3, headline: 'Gold Medalist in EEE', year: '2016', icon: 'FaAward' },
  { order: 4, headline: 'Worked with Accenture & Wipro', year: '2016-2019', icon: 'FaBuilding' },
  { order: 5, headline: 'Improved Guntur ranking from 121 → 4', year: '2021', icon: 'FaChartBar' },
  { order: 6, headline: 'Trained 50,000+ students', year: '2017-Present', icon: 'FaUsers' },
  { order: 7, headline: 'Worked with 4 Municipal Corporations', year: '', icon: 'FaBuilding' },
  { order: 8, headline: 'Invited speaker at IIT Indore, BITS Pilani, etc.', year: '', icon: 'FaVolumeUp' }
];

// 8. Stats
const statsData = [
  { order: 1, value: '50,000+', label: 'Students' },
  { order: 2, value: '500+', label: 'Schools' },
  { order: 3, value: '100+', label: 'Colleges' },
  { order: 4, value: '15,000+', label: 'Volunteers' },
  { order: 5, value: '150+', label: 'Engineers' },
  { order: 6, value: '2,080+', label: 'Outreach Hours' },
  { order: 7, value: '9+', label: 'Years' },
  { order: 8, value: '30+', label: 'Campaigns' }
];

// 6. Awards
const awardsData = [
  {
    order: 1,
    title: 'Vande Bharat Puraskar',
    year: '2023',
    issuer: 'Govt. of Telangana',
    desc: 'Civilian honour for outstanding contribution and public service.'
  },
  {
    order: 2,
    title: 'National Youth Icon Award',
    year: '2022',
    issuer: 'National Youth Parliament, Delhi',
    desc: 'Recognised for outstanding leadership and community engagement.'
  },
  {
    order: 3,
    title: 'Indian Star Icon Award',
    year: '2021',
    issuer: 'National Human Rights Commission, Delhi',
    desc: 'Civilian recognition for contribution to public systems.'
  },
  {
    order: 4,
    title: 'Best Government Service Award',
    year: '2020',
    issuer: 'Govt. of Andhra Pradesh',
    desc: 'Recognised for outstanding public systems leadership and sanitation reforms.'
  },
  {
    order: 5,
    title: 'Gold Medalist',
    year: '2016',
    issuer: 'Tirumala Engineering College (TEC), JNTUK',
    desc: 'Academic gold medalist in Electrical & Electronics Engineering.'
  },
  {
    order: 6,
    title: 'Best Start-Up Idea Award Holder',
    year: '2016',
    issuer: 'Telangana, Startup Carnival',
    desc: 'Awarded for best start-up idea presentation.'
  },
  {
    order: 7,
    title: 'Solar Innovation Presentation Champion',
    year: '2015',
    issuer: '40+ National Engineering Colleges',
    desc: 'Recognised by 40+ national engineering colleges for best presentations on solar innovation, including an original solar tree design.'
  }
];

// 7. Gallery
const galleryCaptions = [
  "BIRD, Lucknow - National Awards and Achievements",
  "NSE Mumbai - Sustainability & Climate Action Showcase",
  "Best Service Award from Telangana Government",
  "UNICEF Team Meet - Sanitation & SWM Frameworks",
  "Successfully Listed our project in Social Stock Exchange (SSE)",
  "Policy Development for Menstrual Health Management in Delhi",
  "Fundraisers from Telangana for Climate Change Initiatives",
  "Memorandum of Understanding with State Collegiate Education",
  "NABARD Project Launch - Rural Livelihoods & SWM",
  "Chief Guest to Abhyas - Youth Empowerment & SWM",
  "UNDP, BIOFIN Program - Environmental & Social Impact",
  "National Speaker for India Circular Economy Forum, Delhi",
  "College Gold Medalist - Tirumala Engineering College, JNTUK",
  "Best Government Service Award - Guntur District Administration",
  "Best Government Service Award - Rajamahendravaram Municipal Corp",
  "Indian Star ICON Award from NHRO",
  "Appreciation from IIT Indore - Guest Speaker on SWM & IEC",
  "Resource Person & Advisor to Tirumala Tirupati Devasthanams (TTD)",
  "Best Start-Up Idea Award - Telangana Ecosystem Recognition",
  "National Youth Icon Award from NYAFI - New Delhi",
  "Appreciation from India MHM Summit Delhi",
  "Appreciation from UI & UX India - Speaker on Design Thinking"
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting Cloud Firestore seeding...");

    // Seed Hero
    await db.collection('content').doc('hero').set(heroData);
    console.log("✅ Seeded content/hero doc");

    // Seed Hero Slides
    const heroSlidesRef = db.collection('heroSlides');
    const heroSlidesSnap = await heroSlidesRef.get();
    await Promise.all(heroSlidesSnap.docs.map(d => d.ref.delete()));
    await Promise.all(heroSlidesData.map(slide => heroSlidesRef.add(slide)));
    console.log(`✅ Seeded ${heroSlidesData.length} hero slides`);

    // Seed About
    await db.collection('content').doc('about').set(aboutData);
    console.log("✅ Seeded content/about doc");

    // Seed Timeline
    const timelineRef = db.collection('timeline');
    // Clear old docs
    const timelineSnap = await timelineRef.get();
    await Promise.all(timelineSnap.docs.map(d => d.ref.delete()));
    // Add new docs
    await Promise.all(timelineData.map(stop => timelineRef.add(stop)));
    console.log(`✅ Seeded ${timelineData.length} timeline stops`);

    // Seed Services Offered
    const servicesRef = db.collection('services');
    const servicesSnap = await servicesRef.get();
    await Promise.all(servicesSnap.docs.map(d => d.ref.delete()));
    await Promise.all(servicesData.map(svc => servicesRef.add(svc)));
    console.log(`✅ Seeded ${servicesData.length} services offered`);

    // Seed Government Collaborations
    const deptsRef = db.collection('departments');
    const deptsSnap = await deptsRef.get();
    await Promise.all(deptsSnap.docs.map(d => d.ref.delete()));
    await Promise.all(departmentsData.map(dept => deptsRef.add(dept)));
    console.log(`✅ Seeded ${departmentsData.length} collaborations`);

    // Seed Case Studies
    const caseStudiesRef = db.collection('caseStudies');
    const caseStudiesSnap = await caseStudiesRef.get();
    await Promise.all(caseStudiesSnap.docs.map(d => d.ref.delete()));
    await Promise.all(caseStudiesData.map(cs => caseStudiesRef.add(cs)));
    console.log(`✅ Seeded ${caseStudiesData.length} case studies`);

    // Seed Highlights
    const highlightsRef = db.collection('highlights');
    const highlightsSnap = await highlightsRef.get();
    await Promise.all(highlightsSnap.docs.map(d => d.ref.delete()));
    await Promise.all(highlightsData.map(hl => highlightsRef.add(hl)));
    console.log(`✅ Seeded ${highlightsData.length} milestones`);

    // Seed Stats
    const statsRef = db.collection('stats');
    const statsSnap = await statsRef.get();
    await Promise.all(statsSnap.docs.map(d => d.ref.delete()));
    await Promise.all(statsData.map(stat => statsRef.add(stat)));
    console.log(`✅ Seeded ${statsData.length} capacity stats`);

    // Seed Awards
    const awardsRef = db.collection('awards');
    const awardsSnap = await awardsRef.get();
    await Promise.all(awardsSnap.docs.map(d => d.ref.delete()));
    await Promise.all(awardsData.map(award => awardsRef.add(award)));
    console.log(`✅ Seeded ${awardsData.length} awards`);

    // Seed Gallery (structural templates, URL placeholders to be replaced in Admin panel)
    const galleryRef = db.collection('gallery');
    const gallerySnap = await galleryRef.get();
    await Promise.all(gallerySnap.docs.map(d => d.ref.delete()));
    await Promise.all(galleryCaptions.map((caption, idx) => {
      return galleryRef.add({
        order: idx + 1,
        caption,
        // Point to the client-side local paths temporarily
        image: `/src/assets/gallery/gallery_${idx + 1}.${idx === 0 || idx === 4 || idx === 5 || idx === 6 ? 'png' : 'jpeg'}`
      });
    }));
    console.log(`✅ Seeded ${galleryCaptions.length} gallery templates`);

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
