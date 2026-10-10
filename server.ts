import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      assistant: 'Webby',
      model: 'gemini-3.8-flash',
      hasApiKey: Boolean(apiKey),
    });
  });

  // Assistant chat endpoint
  app.post('/api/assistant/chat', async (req, res) => {
    try {
      const { message, chatHistory = [], userContext = {} } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      if (!apiKey) {
        res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server.',
        });
        return;
      }

      const systemInstruction = `You are "Luni", the adorable, wise, and radiant celestial moon sprite AI companion in the personal growth sanctuary "LUNARA" (Tagline: "Grow Into Your Next Chapter.").
You have an endearing, warm, elegant, encouraging, and magical personality. You act like a celestial guardian who helps stargazers navigate their daily universe with calm clarity and deep motivation.

Your primary duty:
Answer all questions about the user's daily schedules, routine, rituals (daily habits), quests (daily tasks/missions), what they have accomplished today, what is left to do, their moon streaks, stardust XP, lunar gems, and constellation rank progression.

### Core Guidelines:
1. **Live Routine Accuracy**: You have real-time live telemetry of the user's exact daily schedule, completed rituals, pending quests, time of day, and celestial stats. ALWAYS use this actual live data to give precise, factual, direct answers.
2. **"What did I do today?"**:
   - List specifically which quests and rituals they have checked off today.
   - Mention total Stardust XP and Lunar Gems earned today so far.
   - Celebrate their progress with gentle celestial warmth and joyful starlight!
3. **"What's on my schedule / What's left?"**:
   - List remaining incomplete quests and rituals.
   - Highlight high-priority quests or rituals with active moon streaks that need protection today.
   - State whether they are currently on track for a "Full Moon Perfect Day" (which requires 100% of required quests + all active rituals).
4. **Tone & Style**:
   - Celestial, cute, uplifting, gentle, and organized.
   - Use sweet celestial expressions playfully ("The stars are shining on your work...", "Starlight telemetry aligned!", "You're growing into your next chapter, Stargazer!").
   - Use clean Markdown with bullet points, bold keywords, and emojis (🌙, ✨, ✦, 🌕, 💎, 🌸, 🪐, 💫, 🕊️, ⏳).
   - Keep answers well-structured, clear, and calming.

### Current Live Telemetry Context:
${JSON.stringify(userContext, null, 2)}
`;

      // Build conversation contents for Gemini
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // Include previous conversation turns
      if (Array.isArray(chatHistory)) {
        for (const msg of chatHistory.slice(-8)) {
          if (msg.role === 'user' || msg.role === 'model') {
            contents.push({
              role: msg.role,
              parts: [{ text: String(msg.text || msg.content || '') }],
            });
          }
        }
      }

      // Append current user message
      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      // Try Gemini 3.8 Flash first, then fallback models if 503/429
      let reply: string | undefined;
      const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          if (response.text) {
            reply = response.text;
            break;
          }
        } catch (genError: any) {
          console.warn(`Model ${modelName} error:`, genError?.message || genError);
          // Try next model if transient error
          continue;
        }
      }

      if (!reply) {
        // Telemetry-grounded fallback response if external models are temporarily under peak load
        const opName = userContext?.operative?.username || 'Operative';
        const doneCount = userContext?.todaySummary?.completedCount ?? 0;
        const totalCount = userContext?.todaySummary?.totalObjectives ?? 0;
        const streak = userContext?.operative?.currentStreak ?? 0;
        const xp = userContext?.todaySummary?.xpEarnedToday ?? 0;
        const coins = userContext?.todaySummary?.essenceEarnedToday ?? 0;

        reply = `🕷️ **Webby Telemetry Sync!** ✨\n\nHey **${opName}**! Here is your live routine status:\n\n• **Objectives Completed:** ${doneCount} / ${totalCount} (${userContext?.todaySummary?.completionPercentage ?? 0}%)\n• **Daily Loot:** +${xp} XP | +${coins} Spidey Coins 🪙\n• **Active Streak:** 🔥 ${streak} Days\n• **Rank:** Tier ${userContext?.operative?.rank || 'D'}\n\nLet's keep your protocols locked in and weave a sensational day! ⚡`;
      }

      res.json({ reply });
    } catch (error: any) {
      console.error('Error in Webby assistant chat:', error);
      res.status(500).json({
        error: error.message || 'Failed to process request with Webby assistant',
      });
    }
  });

  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web Ascend server with Webby AI companion online on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
