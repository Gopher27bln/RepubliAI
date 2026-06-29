import type {
  RepurposeRequest,
  RepurposeResponse,
  ChannelResult,
  SocialResult,
  NewsletterResult,
  PushResult,
  AudioResult,
  ImageBriefResult,
  Tone,
  Audience,
} from "./types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function excerpt(body: string, words = 12): string {
  const parts = body.split(/\s+/).filter(Boolean);
  const slice = parts.slice(0, words);
  const text = slice.join(" ").replace(/[,.]?$/, "");
  return parts.length > words ? text + "…" : text;
}

function hashtagsFor(title: string, platform: "twitter" | "linkedin" | "instagram"): string[] {
  const base = title
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, 3)
    .map((w) => `#${w.replace(/[^a-zA-Z0-9]/g, "")}`);

  const extras: Record<typeof platform, string[]> = {
    twitter: ["#Breaking", "#News"],
    linkedin: ["#ThoughtLeadership", "#Industry"],
    instagram: ["#Trending", "#MustRead", "#ContentMarketing"],
  };

  return [...base, ...extras[platform]].slice(0, platform === "instagram" ? 8 : 4);
}

function tonePrefix(tone: Tone): string {
  const map: Record<Tone, string> = {
    neutral: "",
    informative: "Hier sind die wichtigsten Fakten: ",
    emotional: "Das bewegt uns alle – ",
    promotional: "Jetzt lesen und profitieren: ",
  };
  return map[tone];
}

function audienceNote(audience: Audience): string {
  const map: Record<Audience, string> = {
    general: "Für alle verständlich.",
    professional: "Relevant für Fach- und Führungskräfte.",
    youth: "Frisch, direkt, ohne Schnörkel.",
    expert: "Tiefgehende Analyse für Experten.",
    subscriber: "Exklusiv für unsere treuen Leser.",
  };
  return map[audience];
}

function generateTwitter(req: RepurposeRequest): SocialResult {
  const intro = tonePrefix(req.tone);
  const post = `${intro}${req.title}\n\n${excerpt(req.body, 18)}`;
  const hashtags = hashtagsFor(req.title, "twitter");
  return {
    platform: "twitter",
    post: post.trim(),
    hashtags,
    charCount: post.length + hashtags.join(" ").length + 1,
  };
}

function generateLinkedIn(req: RepurposeRequest): SocialResult {
  const intro = tonePrefix(req.tone);
  const hook = req.tone === "emotional"
    ? `Was ich daran wirklich bemerkenswert finde:`
    : `Drei Erkenntnisse aus diesem Beitrag:`;

  const post = `${intro}${req.title}\n\n${excerpt(req.body, 25)}\n\n${hook}\n• ${excerpt(req.body, 8)}\n• ${excerpt(req.body.split(" ").reverse().join(" "), 8)}\n\nLesen Sie den vollständigen Artikel über den Link in den Kommentaren.`;
  const hashtags = hashtagsFor(req.title, "linkedin");
  return {
    platform: "linkedin",
    post: post.trim(),
    hashtags,
    charCount: post.length,
  };
}

function generateInstagram(req: RepurposeRequest): SocialResult {
  const caption = `✨ ${req.title}\n\n${excerpt(req.body, 30)}\n\nLink in Bio 🔗`;
  const hashtags = hashtagsFor(req.title, "instagram");
  return {
    platform: "instagram",
    post: caption.trim(),
    hashtags,
    charCount: caption.length,
  };
}

function generateNewsletter(req: RepurposeRequest): NewsletterResult {
  const subjects: Record<Tone, string> = {
    neutral: `Neue Analyse: ${req.title}`,
    informative: `Was Sie über „${req.title}" wissen müssen`,
    emotional: `Das berührt uns: ${req.title}`,
    promotional: `Nicht verpassen: ${req.title}`,
  };

  const preheaders: Record<Tone, string> = {
    neutral: `${excerpt(req.body, 10)} – jetzt im Detail.`,
    informative: `Fakten, Hintergründe, Einordnung – kompakt für Sie.`,
    emotional: `Eine Geschichte, die bewegt.`,
    promotional: `Jetzt lesen und auf dem Laufenden bleiben.`,
  };

  return {
    subjectLine: subjects[req.tone],
    preheader: preheaders[req.tone],
    summary: excerpt(req.body, 60),
    cta: req.tone === "promotional" ? "Jetzt vollständigen Artikel lesen →" : "Zum vollständigen Artikel →",
  };
}

function generatePush(req: RepurposeRequest): PushResult {
  const titles: Record<Tone, string> = {
    neutral: req.title.slice(0, 50),
    informative: `NEU: ${req.title.slice(0, 45)}`,
    emotional: `Bewegend: ${req.title.slice(0, 40)}`,
    promotional: `Jetzt lesen: ${req.title.slice(0, 37)}`,
  };

  const body = excerpt(req.body, 10);
  const fullTitle = titles[req.tone];

  return {
    title: fullTitle,
    body,
    charCount: fullTitle.length + body.length,
  };
}

function generateAudio(req: RepurposeRequest): AudioResult {
  const opening: Record<Tone, string> = {
    neutral: `Willkommen. Heute sprechen wir über folgendes Thema: ${req.title}.`,
    informative: `Guten Tag. In dieser Ausgabe erhalten Sie alle wichtigen Informationen zu: ${req.title}.`,
    emotional: `Stellen Sie sich vor: ${excerpt(req.body, 10)} – genau darum geht es heute in unserem Beitrag zu ${req.title}.`,
    promotional: `Verpassen Sie nicht unseren heutigen Beitrag: ${req.title}. Hier sind die Highlights.`,
  };

  const script = `${opening[req.tone]}\n\n${req.body.slice(0, 600)}\n\nDas war unser heutiger Beitrag zu „${req.title}". Vielen Dank fürs Zuhören – und bis zum nächsten Mal.`;

  const wordCount = script.split(/\s+/).length;
  const minutes = Math.round(wordCount / 130);
  const seconds = Math.round((wordCount / 130 - minutes) * 60);

  return {
    script,
    durationEstimate: `ca. ${minutes} Min. ${seconds > 0 ? seconds + " Sek." : ""}`.trim(),
  };
}

function generateImageBrief(req: RepurposeRequest): ImageBriefResult {
  const moods: Record<Tone, string> = {
    neutral: "sachlich, klar, vertrauenswürdig",
    informative: "professionell, strukturiert, hell",
    emotional: "warm, menschlich, berührend",
    promotional: "dynamisch, kontrastreich, aufmerksamkeitsstark",
  };

  const palettes: Record<Tone, string> = {
    neutral: "Grautöne, Weiß, Marineblau",
    informative: "Hellblau, Weiß, Dunkelgrau",
    emotional: "Warmes Orange, Cremeweiß, Terrakotta",
    promotional: "Kräftiges Blau, Leuchtendes Gelb, Schwarz",
  };

  return {
    headline: req.title,
    visualConcept: `Starkes Eröffnungsbild, das das Kernthema „${excerpt(req.body, 6)}" visuell kommuniziert. Verwendung von ${moods[req.tone]} Motiven.`,
    mood: moods[req.tone],
    colorPalette: palettes[req.tone],
    copyOverlay: `„${excerpt(req.body, 8)}" – ${req.title}`,
  };
}

export async function repurposeContent(req: RepurposeRequest): Promise<RepurposeResponse> {
  await delay(700);

  const results: ChannelResult[] = [];

  for (const channel of req.channels) {
    switch (channel) {
      case "twitter":
        results.push({ channel: "twitter", data: generateTwitter(req) });
        break;
      case "linkedin":
        results.push({ channel: "linkedin", data: generateLinkedIn(req) });
        break;
      case "instagram":
        results.push({ channel: "instagram", data: generateInstagram(req) });
        break;
      case "newsletter":
        results.push({ channel: "newsletter", data: generateNewsletter(req) });
        break;
      case "push":
        results.push({ channel: "push", data: generatePush(req) });
        break;
      case "audio":
        results.push({ channel: "audio", data: generateAudio(req) });
        break;
      case "image_brief":
        results.push({ channel: "image_brief", data: generateImageBrief(req) });
        break;
    }
  }

  return { results, generatedAt: new Date().toISOString() };
}
