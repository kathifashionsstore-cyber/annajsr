import admin from 'firebase-admin';

// Initialize Firebase Admin once
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      })
    });
  } else {
    admin.initializeApp();
  }
}

const db = admin.firestore();

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
    // 1. Fetch dynamic JSR profile context from Firestore
    const aboutSnap = await db.collection('content').doc('about').get();
    const aboutData = aboutSnap.exists ? aboutSnap.data() : {};

    const timelineSnap = await db.collection('timeline').get();
    const timeline = timelineSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));

    const awardsSnap = await db.collection('awards').get();
    const awards = awardsSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));

    const statsSnap = await db.collection('stats').get();
    const stats = statsSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));

    const innovationsSnap = await db.collection('innovations').get();
    const innovations = innovationsSnap.docs.map(d => d.data()).sort((a, b) => (a.order || 0) - (b.order || 0));

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

Guidelines:
- Keep responses short, concise, and conversational (max 2-3 sentences).
- If the user asks general greetings (e.g. hi, hello), respond warmly and introduce yourself as JSR Annamayya's assistant.
- Do not invent or assume any facts about JSR. If a detail is not provided, politely state that you do not have that information and suggest contacting JSR directly via the contact form.`;

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
      
      await db.collection('chatLogs').add({
        createdAt: new Date().toISOString(),
        clientIp,
        userAgent,
        userMessage: message,
        botReply: reply,
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
