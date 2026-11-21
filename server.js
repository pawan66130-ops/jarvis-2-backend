// JARVIS 2.0 backend example. Requires Node.js 18+.
// Install: npm install express cors dotenv openai @google/generative-ai
// Run: cp .env.example .env ; add your private keys ; node server.js
// Deploy only to a trusted HTTPS host. Never publish your .env file.
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req,res)=>res.json({status:'ok',service:'JARVIS 2.0'}));
app.post('/api/chat', async (req,res)=>{
  try {
    const { provider='openai', message, history=[] } = req.body || {};
    if (!message || typeof message !== 'string') return res.status(400).json({error:'message required'});
    const system = 'You are JARVIS, a helpful female-voiced Hindi-English personal assistant. Reply naturally in the language used by the user. Be accurate, concise, and transparent about uncertainty.';
    let reply;
    if (provider === 'gemini') {
      if (!process.env.GEMINI_API_KEY) return res.status(503).json({error:'Gemini key not configured'});
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({model:'gemini-2.5-flash', systemInstruction:system});
      const contents = history.filter(x=>['user','assistant'].includes(x.role)).slice(-10).map(x=>({role:x.role==='assistant'?'model':'user',parts:[{text:String(x.content)}]}));
      if (!contents.length || contents[contents.length-1].role !== 'user' || contents[contents.length-1].parts[0].text !== message) contents.push({role:'user',parts:[{text:message}]});
      const result = await model.generateContent({contents});
      reply = result.response.text();
    } else {
      if (!process.env.OPENAI_API_KEY) return res.status(503).json({error:'OpenAI key not configured'});
      const client = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
      const msgs = [{role:'system',content:system}, ...history.filter(x=>['user','assistant'].includes(x.role)).slice(-10).map(x=>({role:x.role,content:String(x.content)}))];
      if (msgs[msgs.length-1].role !== 'user' || msgs[msgs.length-1].content !== message) msgs.push({role:'user',content:message});
      const result = await client.chat.completions.create({model:'gpt-4.1-mini',messages:msgs});
      reply = result.choices[0].message.content;
    }
    res.json({reply});
  } catch (e) { console.error(e); res.status(500).json({error:'AI request failed'}); }
});
const port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`JARVIS backend listening on ${port}`));
