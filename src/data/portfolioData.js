import heroProfileImg from '../assets/hero_profile.jpg';
import profileAltImg from '../assets/about/profile_circle.png';
import aboutStackImg from '../assets/about/image.png';

// Import vision & leadership section images from extracted assets
import vision1Img from '../assets/extracted/page_4_img_18_851.jpeg';
import vision2Img from '../assets/extracted/page_4_img_20_856.jpeg';
import vision3Img from '../assets/extracted/page_4_img_22_861.jpeg';
import vision4Img from '../assets/extracted/page_4_img_30_881.jpeg';

// Import case studies & project images from extracted assets
import projGunturImg from '../assets/extracted/page_4_img_38_937.jpeg';
import projAtbImg from '../assets/extracted/page_4_img_52_972.jpeg';
import projMhmImg from '../assets/extracted/page_4_img_40_942.jpeg';

// Import other page heroes
import experienceHeroImg from '../assets/extracted/page_4_img_10_459.jpeg';
import contactHeroImg from '../assets/extracted/page_1_img_1_663.png';

// Import gallery images directly from the existing gallery data
import { galleryData } from './galleryData';

/**
 * Centered static data store for JSR Annamayya's portfolio.
 */
export const portfolioData = {
  profile: {
    name: "JSR Annamayya",
    alternateNames: ["JSR Annamaya", "Sai Annamayya"],
    role: "Behaviour Change & IEC Specialist",
    tagline: "Behaviour Change & IEC Specialist",
    subtitle: "9+ years building public systems, IEC/BCC strategy, and climate action programs across Andhra Pradesh & Telangana.",
    introText: "Hi, I am JSR Annamayya. I am a National Award winning Behaviour Change and IEC Specialist with over nine years of experience building public systems and driving climate action. Throughout my career, I have had the privilege of working with municipal corporations and environmental organizations across Andhra Pradesh and Telangana. I am honoured to have received the Vande Bharat Puraskar in 2023, the National Youth Icon Award in 2022, and the Indian Star Icon Award in 2021. Welcome to my portfolio.",
    
    // Detailed biographies for Professional Profile page
    bio: {
      intro: "A Trailblazer in Environmental Sustainability and Leadership with 9 years of expertise in IEC strategies, solid waste management, corporate operations, and community development. Recognised for his innovative approaches, he has made a lasting impact in public service and corporate leadership.",
      bio1: "Graduated as a Gold Medallist in Electrical & Electronics Engineering (EEE) from Tirumala Engineering College, Narasaraopet, presenting over 21 technical research papers at prestigious institutions like BITS Pilani, JNTUH, and Anna University. JSR Annamayya holds a Gold Medal from Tirumala Engineering College, an early testament to his dedication and pursuit of excellence. His technical acumen and innovative mindset have laid the foundation for his future contributions to society. He has taken the stage at numerous national forums in Delhi, representing India many times and sharing his insights on critical SWM (Solid Waste Management) issues at the India Circular Economy Forum 2024.",
      bio2: "Started professional career in the software corporate world at Accenture and Wipro (2016–2019) as a Quality Team Lead and Special Project Area Lead, managing large engineering delivery operations before transitioning full-time into public systems governance. At Wipro and Accenture, he led an 80+ member team, showcasing excellence in technical solutions, project management, and leadership for Silicon Valley clients including Google and Uber.",
      bio3: "Since transitioning, he has driven extensive solid waste management (SWM) campaigns and Behaviour Change Communication (BCC/IEC) programs across municipal administrations and departments in Andhra Pradesh and Telangana. Guided state-level environmental initiatives like the Young Earth Leaders Program, training 50,000+ students across 500+ government schools and 100+ colleges, and dedicating 2,080+ hours of community outreach. As an IEC Specialist in Andhra Pradesh municipal administrations, he influenced sustainable behavioural change among 2.2 million people, played a key role in the National Swachh Bharat rankings of the Government of India, and earned national recognition for best practices in environmental sustainability."
    },
    
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
    ],
    
    // Contact Settings
    email: "Sai.annamayya@gmail.com",
    phone: "7702012010",
    address: "Manikonda, Telangana",
    whatsappUrl: "https://wa.me/917702012010",
    linkedinUrl: "https://www.linkedin.com/in/jsr-annamayya-18a59665/?isSelfProfile=false",
    experienceYears: "9+ years of experience",
    
    images: {
      heroPortrait: heroProfileImg,
      profileAlt: profileAltImg,
      aboutStack: aboutStackImg,
      experienceHero: experienceHeroImg,
      contactHero: contactHeroImg,
      awardFeatured: vision2Img
    }
  },

  heroSlides: [
    {
      id: 'h1',
      order: 1,
      headline: "From an EEE Classroom to National Recognition",
      subtext: "Gold Medalist in Electrical & Electronics Engineering turned National Award-Winning Behaviour Change & IEC Specialist — 9+ years building public systems across Andhra Pradesh and Telangana."
    },
    {
      id: 'h2',
      order: 2,
      headline: "Turning Government Systems Into Movements",
      subtext: "From corporate delivery at Wipro and Accenture to leading IEC and sanitation reform inside four municipal corporations — building the bridge between institutions and citizens."
    },
    {
      id: 'h3',
      order: 3,
      headline: "Behind Guntur's Rise to Rank 4",
      subtext: "Led citizen engagement and IEC strategy behind Guntur's national Swachh Survekshan turnaround — proof that public behaviour change is designable, not accidental."
    },
    {
      id: 'h4',
      order: 4,
      headline: "Innovating Where Policy Meets People",
      subtext: "Creator of the \"Any Time Bag\" solar-powered cloth bag vending machine — a UNDP-recognised innovation removing plastic waste at the exact moment it happens."
    },
    {
      id: 'h5',
      order: 5,
      headline: "A Voice for Sustainable Governance, Nationally",
      subtext: "Speaker at the India Circular Economy Forum 2024 and national platforms in Delhi — carrying grassroots lessons to the national stage."
    }
  ],

  vision: [
    {
      id: 1,
      number: "01",
      title: "Behaviour Change",
      paragraph: "Designing targeted communication strategies that lower barriers and build sustainable public habits directly at the local municipal level.",
      image: vision1Img
    },
    {
      id: 2,
      number: "02",
      title: "Public Communication",
      paragraph: "Engaging citizen stakeholders, ward volunteers, and municipal officials to turn policy objectives into active civic movements.",
      image: vision2Img
    },
    {
      id: 3,
      number: "03",
      title: "Sustainable Innovation",
      paragraph: "Deploying technological interventions like solar-powered bag vending machines and chatbot systems to reduce environmental impact.",
      image: vision3Img
    },
    {
      id: 4,
      number: "04",
      title: "Community Leadership",
      paragraph: "Training thousands of students and environmental volunteers to spearhead grassroots ecology initiatives in schools and colleges.",
      image: vision4Img
    }
  ],

  // Structured by type of assignment/timeline
  experience: [
    {
      id: "exp-5",
      order: 5,
      dateRange: "May 2024 – Feb 2026",
      role: "Assistant Director",
      organisation: "Council for Green Revolution",
      location: "Telangana",
      type: "Climate Action & Environmental Advocacy",
      description: "Led state-level environmental education & climate action initiatives in collaboration with Dept. of School/College Education, Telangana Biodiversity Board, GHMC, and Forest Dept.",
      activities: [
        "Spearheaded the Young Earth Leaders Program (YELP), driving sustainability & youth-led climate advocacy.",
        "Trained 50,000+ students across 500+ government schools and 100+ colleges.",
        "Dedicated over 2,080+ hours of community outreach in environmental stewardship."
      ]
    },
    {
      id: "exp-4",
      order: 4,
      dateRange: "Apr 2023 – Mar 2024",
      role: "IEC Expert",
      organisation: "Nellore Municipal Corporation",
      location: "Nellore, Andhra Pradesh",
      type: "Government Public Systems Assignment",
      description: "Structured urban sanitation & municipal solid waste management (SWM) systems.",
      activities: [
        "Supervised technical coordination, field compliance, and citizen engagement.",
        "Drove outcomes linked directly to national Safai Mitra Suraksha recognition.",
        "Formulated behavior change communication programs for over 500,000 citizens."
      ]
    },
    {
      id: "exp-3",
      order: 3,
      dateRange: "Feb 2021 – Mar 2023",
      role: "IEC Specialist",
      organisation: "Rajamahendravaram Municipal Corp.",
      location: "Rajamahendravaram, Andhra Pradesh",
      type: "Government Public Systems Assignment",
      description: "Designed robust community models and waste campaigns for public sanitation.",
      activities: [
        "Achieved a 15% efficiency increase in door-to-door waste collection through BCC interventions.",
        "Maintained operational scaling contributing to GFC (Garbage Free City) Star Rating and Swachh Bharat milestones."
      ]
    },
    {
      id: "exp-2",
      order: 2,
      dateRange: "Mar 2020 – Jan 2021",
      role: "IEC / SWM Program Lead",
      organisation: "Guntur Municipal Corporation",
      location: "Guntur, Andhra Pradesh",
      type: "Government Public Systems Assignment",
      description: "Directed large-scale citizen mobilisation and solid waste management campaigns.",
      activities: [
        "Spearheaded targeted communications that elevated Guntur's national Swachh Survekshan rank from 121 to 4."
      ]
    },
    {
      id: "exp-1",
      order: 1,
      dateRange: "2016 – 2019",
      role: "Quality Team Lead / Special Project Area Lead",
      organisation: "Wipro & Accenture",
      location: "Hyderabad, India",
      type: "Corporate Operations & Delivery",
      description: "Managed project operations, structured delivery, and quality assurance workflows for Silicon Valley enterprise clients before shifting focus toward high-impact public governance systems.",
      activities: [
        "Led an 80+ member team showcasing excellence in technical solutions, project management, and delivery.",
        "Collaborated with major Silicon Valley clients, including Google and Uber."
      ]
    }
  ],

  education: [
    {
      degree: "B.Tech in Electrical & Electronics Engineering",
      institution: "Tirumala Engineering College (TEC), JNTUK",
      location: "Narasaraopet, Andhra Pradesh",
      dateRange: "2012 – 2016",
      details: "Graduated as an Academic Gold Medalist. Presented over 21 technical research papers at prestigious institutes including BITS Pilani, JNTUH, and Anna University."
    }
  ],

  services: [
    { order: 1, title: 'Behaviour Change Communication Strategy', description: 'Developing public engagement campaigns and behavior change tools.' },
    { order: 2, title: 'IEC Campaign Design', description: 'Information, Education & Communication layouts for municipal departments.' },
    { order: 3, title: 'Waste Management Consulting', description: 'Advisory on solid waste collection, segregation, and transport system design for municipal bodies.' },
    { order: 4, title: 'Climate Action Programs', description: 'Designing youth-led and institutional climate/biodiversity education initiatives.' },
    { order: 5, title: 'Capacity Building', description: 'Structured training programs for government staff, ward volunteers, and public health workers.' },
    { order: 6, title: 'Government Training', description: 'Facilitating skill and awareness sessions for municipal commissioners, engineers, and field staff.' },
    { order: 7, title: 'Public Speaking', description: 'Keynotes, panels, and faculty sessions on sustainability, governance, and behaviour change.' },
    { order: 8, title: 'CSR Advisory', description: 'Guiding corporate partners on sustainability-linked CSR program design and execution.' },
    { order: 9, title: 'Policy Support', description: 'Contributing to policy development and institutional partnership frameworks.' }
  ],

  departments: [
    { order: 1, name: 'Government of Andhra Pradesh' },
    { order: 2, name: 'Government of Telangana' },
    { order: 3, name: 'Greater Hyderabad Municipal Corporation (GHMC)' },
    { order: 4, name: 'Telangana Biodiversity Board' },
    { order: 5, name: 'Telangana Forest Department' },
    { order: 6, name: 'Department of School Education' },
    { order: 7, name: 'Department of College Education (Higher Education)' },
    { order: 8, name: 'Municipal Administration & Urban Development Department' }
  ],

  innovations: [
    { order: 1, title: 'Checkcovidnow / Arogya Setu', description: 'Recognised as the first rapid COVID-19 detection web app in Telangana; JSR is its founder.' },
    { order: 2, title: 'Any Time Bag (ATB) Cloth Bag Vending Machine', description: 'A United Nations-recognised initiative combating plastic pollution and avoiding single-use plastic covers.' },
    { order: 3, title: 'Municipal Chatbot & Command Control Unit', description: 'Enhancing citizen engagement in waste management with technology at the doorstep level.' },
    { order: 4, title: 'Green Saving Concepts & Quick Response Team', description: 'Addressing plastic waste and mobilising communities.' }
  ],

  caseStudies: [
    { 
      order: 1, 
      title: 'Guntur Swachh Survekshan Rank Improvement', 
      organisation: 'Guntur Municipal Corporation', 
      dateRange: '2020 – 2021',
      tags: ['SWM', 'IEC', 'Governance'],
      image: projGunturImg,
      problem: 'Guntur ranked poorly nationally (121st) in the Swachh Survekshan cleanliness survey, reflecting weak citizen participation, inconsistent waste segregation, and limited IEC outreach.',
      objective: 'Lift Guntur\'s national ranking through citizen engagement and improved municipal solid-waste systems.',
      strategy: 'Led IEC and citizen engagement interventions integrated directly into the city\'s sanitation and solid waste management programs.',
      implementation: 'Ground-level campaigns and coordination with municipal sanitation teams, citizen mobilization drives, and IEC messaging aligned to Swachh Survekshan evaluation criteria.',
      results: 'Guntur\'s Swachh Survekshan rank rose substantially over this period, shifting from 121st to 4th nationally, alongside progress on Garbage Free City status.',
      lessons: 'Rank improvement in national cleanliness surveys depends as much on sustained citizen-facing communication as on operational fixes — IEC and civic engagement were treated as core infrastructure, not an add-on.'
    },
    {
      order: 2,
      title: 'Any Time Bag (ATB): Solar-Powered Cloth Bag Vending Machine',
      organisation: 'GHMC / United Way of Hyderabad',
      dateRange: '2023',
      tags: ['Climate Action', 'Innovation', 'Plastic Reduction'],
      image: projAtbImg,
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
      tags: ['Public Health', 'IEC', 'Policy Support'],
      image: projMhmImg,
      problem: 'Limited corporate and institutional engagement in menstrual health management, with eco-friendly product adoption and school-level education lagging.',
      objective: 'Advocate for corporate and policy involvement in MHM education, eco-friendly product piloting, and school/community outreach.',
      strategy: 'Participate as an invited speaker at a national summit convening policymakers, corporates, and NGOs to share field-tested IEC practices in MHM.',
      implementation: 'Delivered a summit address and joined panel discussions at the India MHM Summit (3rd edition) hosted by Gramalaya at NDMC, New Delhi; shared field results on eco-friendly menstrual hygiene products piloted in schools and communities.',
      results: 'Contributed to national-level dialogue and policy visibility on MHM; strengthened his profile as a resource person on public-health IEC practice.',
      lessons: 'Cross-sector platforms (government, corporate, NGO) accelerate adoption of public-health innovations faster than single-institution efforts.'
    }
  ],

  highlights: [
    { order: 1, headline: 'National Award Winner (Vande Bharat Puraskar)', year: '2023' },
    { order: 2, headline: 'Launched "Any Time Bag" Solar Vending Machine (UNDP Recognised)', year: '2023' },
    { order: 3, headline: 'National Youth Icon Awardee, New Delhi', year: '2022' },
    { order: 4, headline: 'Indian Star Icon Awardee, New Delhi', year: '2021' },
    { order: 5, headline: 'Led Guntur\'s Swachh Survekshan Rank Improvement to 4th', year: '2020–2021' },
    { order: 6, headline: 'Managed Project execution with a 40+ Engineer Team at Accenture', year: '2019' },
    { order: 7, headline: 'Led a 15-person Quality Analyst Team at Wipro for Silicon Valley', year: '2016–2019' },
    { order: 8, headline: 'Gold Medalist in Electrical & Electronics Engineering, TEC', year: '2016' },
    { order: 9, headline: 'Worked across 4 Municipal Corporations (Guntur, Rajamahendravaram, Nellore, CGR)', year: 'Ongoing' },
    { order: 10, headline: 'Invited Speaker at IIT Indore, BITS Pilani, Osmania University, etc.', year: 'Ongoing' }
  ],

  stats: [
    { value: '50,000+', label: 'Students' },
    { value: '500+', label: 'Schools' },
    { value: '100+', label: 'Colleges' },
    { value: '15,000+', label: 'Volunteers' },
    { value: '150+', label: 'Engineers' },
    { value: '2,080+', label: 'Outreach Hours' },
    { value: '9+', label: 'Years' },
    { value: '30+', label: 'Campaigns' }
  ],

  awards: [
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
  ],

  // Genuine single testimonial preserved from previous setup
  testimonials: [
    {
      quote: "His strategic interventions in solid waste management helped our corporation achieve Swachh Bharat milestones.",
      author: "Municipal Commissioner",
      designation: "IAS Officer",
      company: "Nellore Municipal Corporation"
    }
  ],

  press: [
    {
      title: "Vande Bharat Puraskar Civilian Honour",
      source: "Telangana Today",
      date: "2023-11-10",
      url: "https://telanganatoday.com"
    }
  ],

  talks: [
    'Centre for Science and Environment (CSE), New Delhi',
    'IIT Indore',
    'BITS Pilani, Hyderabad Campus',
    'Osmania University',
    'India MHM Summit, New Delhi',
    'UNDP BIOFIN Program',
    'Tirumala Tirupati Devasthanams (TTD)'
  ],

  development: [
    {
      id: "dev-1",
      year: "2024",
      program: "India Circular Economy Forum",
      institution: "New Delhi",
      description: "Presented municipal solid waste management (SWM) implementation outcomes and behavior-change methodologies to environmental policymakers."
    },
    {
      id: "dev-2",
      year: "ONGOING",
      program: "Collegiate Keynotes",
      institution: "Academia",
      description: "Delivered guest lectures and design thinking keynotes on sustainability and solid waste management at IIT Indore, BITS Pilani (Hyderabad Campus), and Osmania University."
    }
  ],

  gallery: galleryData
};

