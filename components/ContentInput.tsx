"use client";

import { cn } from "@/lib/utils";
import type { Tone, Audience } from "@/lib/types";

const TONES: { value: Tone; label: string; emoji: string }[] = [
  { value: "neutral", label: "Neutral", emoji: "⚖️" },
  { value: "informative", label: "Informativ", emoji: "📊" },
  { value: "emotional", label: "Emotional", emoji: "❤️" },
  { value: "promotional", label: "Werblich", emoji: "📣" },
];

const AUDIENCES: { value: Audience; label: string }[] = [
  { value: "general", label: "Allgemein" },
  { value: "professional", label: "Fachpublikum" },
  { value: "youth", label: "Jugend / Gen Z" },
  { value: "expert", label: "Experten" },
  { value: "subscriber", label: "Abonnenten" },
];

interface Props {
  title: string;
  body: string;
  tone: Tone;
  audience: Audience;
  brandGuidelines: string;
  onTitleChange: (v: string) => void;
  onBodyChange: (v: string) => void;
  onToneChange: (v: Tone) => void;
  onAudienceChange: (v: Audience) => void;
  onBrandGuidelinesChange: (v: string) => void;
}

export default function ContentInput({
  title,
  body,
  tone,
  audience,
  brandGuidelines,
  onTitleChange,
  onBodyChange,
  onToneChange,
  onAudienceChange,
  onBrandGuidelinesChange,
}: Props) {
  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Artikel-Titel <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="z. B. 'KI verändert den deutschen Journalismus'"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Artikel-Text <span className="text-red-400">*</span>
        </label>
        <textarea
          value={body}
          onChange={(e) => onBodyChange(e.target.value)}
          placeholder="Fügen Sie hier den vollständigen Artikeltext ein…"
          rows={10}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition resize-none"
        />
        <p className="mt-1 text-right text-xs text-slate-400">
          {body.trim().split(/\s+/).filter(Boolean).length} Wörter
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Tonalität
        </label>
        <div className="grid grid-cols-4 gap-2">
          {TONES.map(({ value, label, emoji }) => (
            <button
              key={value}
              type="button"
              onClick={() => onToneChange(value)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl border-2 px-1 py-2.5 text-center transition",
                tone === value
                  ? "border-brand bg-brand text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              )}
            >
              <span className="text-base leading-none">{emoji}</span>
              <span className="text-[11px] font-medium leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Zielgruppe
        </label>
        <select
          value={audience}
          onChange={(e) => onAudienceChange(e.target.value as Audience)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition"
        >
          {AUDIENCES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700">
          Markenrichtlinien{" "}
          <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          value={brandGuidelines}
          onChange={(e) => onBrandGuidelinesChange(e.target.value)}
          placeholder="z. B. 'Kein Clickbait. Duzen. Immer Quellenangabe.'"
          rows={2}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition resize-none"
        />
      </div>
    </div>
  );
}
