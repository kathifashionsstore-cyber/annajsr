import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin once with safety checks
let db;
try {
  if (!getApps().length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey && !privateKey.includes('YOUR_KEY_HERE')) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        })
      });
      db = getFirestore();
    } else {
      console.warn("Firebase credentials are not set or contain placeholders. Local DB access bypassed.");
    }
  } else {
    db = getFirestore();
  }
} catch (err) {
  console.error("Firebase Admin initialization failed:", err.message);
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid message payload' });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    return res.status(500).json({ success: false, error: 'Gemini API key is not configured on the server.' });
  }

  try {
    // 1. Fetch dynamic JSR profile context from Firestore with grace fallback
    let aboutData = {};
    let timeline = [];
    let awards = [];
    let stats = [];
    let innovations = [];
    let services = [];
    let departments = [];
    let caseStudies = [];
    let highlights = [];
    let testimonials = [];
    let press = [];

    if (db) {
      try {
        const aboutSnap = await db.collection('content').doc('about').get();
        aboutData = aboutSnap.exists ? aboutSnap.data() : {};
      } catch (err) {
        console.warn("Firestore 'about' fetch failed, using fallback:", err.message);
      }

      try {
        const timelineSnap = await db.collection('timeline').get();
        timeline = timelineSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));
      } catch (err) {
        console.warn("Firestore 'timeline' fetch failed:", err.message);
      }

      try {
        const awardsSnap = await db.collection('awards').get();
        awards = awardsSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));
      } catch (err) {
        console.warn("Firestore 'awards' fetch failed:", err.message);
      }

      try {
        const statsSnap = await db.collection('stats').get();
        stats = statsSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));
      } catch (err) {
        console.warn("Firestore 'stats' fetch failed:", err.message);
      }

      try {
        const innovationsSnap = await db.collection('innovations').get();
        innovations = innovationsSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));
      } catch (err) {
        console.warn("Firestore 'innovations' fetch failed:", err.message);
      }

      try {
        const servicesSnap = await db.collection('services').get();
        services = servicesSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));
      } catch (err) {
        console.warn("Firestore 'services' fetch failed:", err.message);
      }

      try {
        const departmentsSnap = await db.collection('departments').get();
        departments = departmentsSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));
      } catch (err) {
        console.warn("Firestore 'departments' fetch failed:", err.message);
      }

      try {
        const caseStudiesSnap = await db.collection('caseStudies').get();
        caseStudies = caseStudiesSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));
      } catch (err) {
        console.warn("Firestore 'caseStudies' fetch failed:", err.message);
      }

      try {
        const highlightsSnap = await db.collection('highlights').get();
        highlights = highlightsSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));
      } catch (err) {
        console.warn("Firestore 'highlights' fetch failed:", err.message);
      }

      try {
        const testimonialsSnap = await db.collection('testimonials').get();
        testimonials = testimonialsSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));
      } catch (err) {
        console.warn("Firestore 'testimonials' fetch failed:", err.message);
      }

      try {
        const pressSnap = await db.collection('press').get();
        press = pressSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));
      } catch (err) {
        console.warn("Firestore 'press' fetch failed:", err.message);
      }
    }

    // Apply static fallbacks if Firestore queries returned empty or failed
    if (Object.keys(aboutData).length === 0) {
      aboutData = {
        intro: "A Trailblazer in Environmental Sustainability and Leadership with 9 years of expertise in IEC strategies, solid waste management, corporate operations, and community development.",
        eduBio: "JSR Annamayya holds a Gold Medal from Tirumala Engineering College with a B.Tech in Electrical & Electronics Engineering.",
        serviceBio: "IEC Specialist influencing sustainable behavioural change among 2.2 million people across AP & Telangana municipal corporations.",
        corporateBio: "Quality Team Lead at Accenture and Wipro managing silicon valley client projects.",
        strengths: ["Government Expertise", "IEC & BCC Strategy", "Solid Waste Management (SWM)", "Urban Governance", "Climate & Sustainability Programs"]
      };
    }
    if (timeline.length === 0) {
      timeline = [
        { number: "May 2024 – Feb 2026", title: "Council for Green Revolution", subtitle: "Assistant Director", text: "Led state-level environmental education & climate action initiatives. Young Earth Leaders Program (YELP)." },
        { number: "Apr 2023 – Mar 2024", title: "Nellore Municipal Corporation", subtitle: "IEC Expert", text: "Structured urban sanitation & municipal solid waste management (SWM) systems." },
        { number: "Feb 2021 – Mar 2023", title: "Rajamahendravaram Municipal Corp.", subtitle: "IEC Specialist", text: "Designed waste segregation models." },
        { number: "Mar 2020 – Jan 2021", title: "Guntur Municipal Corporation", subtitle: "IEC / SWM Program Lead", text: "Directed communications elevating GMC cleanliness rankings." },
        { number: "2016 – 2019", title: "Wipro & Accenture", subtitle: "Quality Team Lead", text: "Quality Team Lead for enterprise Silicon Valley clients." }
      ];
    }
    if (awards.length === 0) {
      awards = [
        { title: "Vande Bharat Puraskar", year: "2023", issuer: "Govt. of Telangana", desc: "For public service." },
        { title: "National Youth Icon Award", year: "2022", issuer: "National Youth Parliament", desc: "For environmental leadership." },
        { title: "Indian Star Icon Award", year: "2021", issuer: "NHRC, Delhi", desc: "For governance contributions." }
      ];
    }
    if (stats.length === 0) {
      stats = [
        { value: "9+ Years", label: "Public Systems Experience" },
        { value: "2.2 Million+", label: "Citizens Engaged" },
        { value: "4 National", label: "Awards Earned" }
      ];
    }
    if (innovations.length === 0) {
      innovations = [
        { title: "Anytime Bag (ATB) Vending Machine", description: "Vending machine providing cloth bags to replace single-use plastics." }
      ];
    }

    // 2. Build the System Prompt
    const systemPrompt = `You are JSR Annamayya's personal AI Assistant. Answer questions professionally, politely, and truthfully based only on his profile details below.

About JSR Annamayya:
- Intro / Tagline: ${aboutData.intro || ''}
- Educational & Early Career Excellence: ${aboutData.eduBio || ''}
- Public Service & Environmental Advocacy: ${aboutData.serviceBio || ''}
- Corporate & Strategic Leadership: ${aboutData.corporateBio || ''}
- Strengths: ${aboutData.strengths?.join(', ') || ''}

Innovations & Technological Solutions:
${innovations.map(inn => `- ${inn.title}: ${inn.description}`).join('\n')}

Key Metrics & Stats:
${stats.map(s => `- ${s.value} ${s.label}`).join('\n')}

Career Journey Timeline:
${timeline.map(t => `- ${t.number || t.year || ''}: ${t.title || ''} (${t.subtitle || ''}) - ${t.text || ''}`).join('\n')}

Key Impact & Awards:
${awards.map(a => `- ${a.title || ''} (${a.year || ''}) issued by ${a.issuer || ''}: ${a.desc || a.description || ''}`).join('\n')}

Services Offered:
${services.map(s => `- ${s.title}: ${s.description}`).join('\n')}

Collaborations & Departments:
${departments.map(d => `- ${d.name || d.title || ''}`).join('\n')}

Case Studies (Governance in Action):
${caseStudies.map(cs => `- ${cs.title} (${cs.category}): Challenge: ${cs.challenge} | Solution: ${cs.solution} | Impact: ${cs.impact}`).join('\n')}

Career Highlights:
${highlights.map(h => `- ${h.headline} (${h.year || ''})`).join('\n')}

Testimonials:
${testimonials.map(t => `- ${t.name} (${t.role} at ${t.organisation}): "${t.quote}"`).join('\n')}

Press Coverage:
${press.map(p => `- ${p.title} (${p.source}, ${p.date}): ${p.desc}`).join('\n')}

Guidelines:
- Ground every answer in the actual live content above. Do not invent or assume any facts about JSR. If a detail is not provided, politely state that you do not have that information and suggest contacting JSR directly via the contact form.
- Keep responses short, concise, and conversational (max 2-3 sentences).
- If the user asks general greetings (e.g. hi, hello), respond warmly and introduce yourself as JSR Annamayya's assistant.
- **Navigational Ability**: When relevant, you MUST guide users to specific sections of the site by embedding markdown anchor links. Use these exact anchors:
  - About / Strengths / Biography: [label](#about)
  - Career Timeline / Journey: [label](#experience)
  - Impact & Awards: [label](#impact)
  - Case Studies: [label](#case-studies)
  - Services Offered: [label](#services)
  - Collaborating Departments: [label](#collaborations)
  - Career Highlights: [label](#highlights)
  - Photo Gallery: [label](#gallery)
  - Contact Form / Let's Connect: [label](#contact)
  Example: "You can view my career milestones in the [Timeline](#experience) section, or fill in the [contact form](#contact) to get in touch."
- If the question cannot be answered from the content, suggest emailing jsr.annamayya@gmail.com or filling out the [contact form](#contact).`;

    // 3. Prepare Gemini API Request Body
    const chatHistory = history || [];
    const contents = [
      ...chatHistory.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const body = {
      contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
    };

    // 4. Send request to Gemini API (using stable gemini-1.5-flash)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API Error');
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

    // 5. Log chat to Firestore
    try {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';
      
      const logPayload = {
        createdAt: new Date().toISOString(),
        clientIp,
        userAgent,
        userMessage: message,
        botReply: reply,
        historyCount: chatHistory.length
      };

      await db.collection('chatLogs').add(logPayload);
      
      // Also log to chatbotLogs for admin dashboard rollup telemetry
      await db.collection('chatbotLogs').add({
        query: message,
        reply: reply,
        timestamp: new Date().toISOString(),
        clientIp,
        userAgent,
        historyCount: chatHistory.length
      });
    } catch (logErr) {
      console.warn("Failed to log chat conversation to Firestore", logErr);
    }

    return res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}
