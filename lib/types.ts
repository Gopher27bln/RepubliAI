export type Tone = "neutral" | "informative" | "emotional" | "promotional";

export type Audience =
  | "general"
  | "professional"
  | "youth"
  | "expert"
  | "subscriber";

export type Channel =
  | "twitter"
  | "linkedin"
  | "instagram"
  | "newsletter"
  | "push"
  | "audio"
  | "image_brief";

export const ALL_CHANNELS: Channel[] = [
  "twitter",
  "linkedin",
  "instagram",
  "newsletter",
  "push",
  "audio",
  "image_brief",
];

export interface RepurposeRequest {
  title: string;
  body: string;
  tone: Tone;
  audience: Audience;
  brandGuidelines?: string;
  channels: Channel[];
}

export interface SocialResult {
  platform: "twitter" | "linkedin" | "instagram";
  post: string;
  hashtags: string[];
  charCount: number;
}

export interface NewsletterResult {
  subjectLine: string;
  preheader: string;
  summary: string;
  cta: string;
}

export interface PushResult {
  title: string;
  body: string;
  charCount: number;
}

export interface AudioResult {
  script: string;
  durationEstimate: string;
}

export interface ImageBriefResult {
  headline: string;
  visualConcept: string;
  mood: string;
  colorPalette: string;
  copyOverlay: string;
}

export type ChannelResult =
  | { channel: "twitter"; data: SocialResult }
  | { channel: "linkedin"; data: SocialResult }
  | { channel: "instagram"; data: SocialResult }
  | { channel: "newsletter"; data: NewsletterResult }
  | { channel: "push"; data: PushResult }
  | { channel: "audio"; data: AudioResult }
  | { channel: "image_brief"; data: ImageBriefResult };

export interface RepurposeResponse {
  results: ChannelResult[];
  generatedAt: string;
}
