"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChannelResult } from "@/lib/types";

interface Props {
  result: ChannelResult;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition",
        copied
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Kopiert!" : "Kopieren"}
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>
        <CopyButton text={value} />
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
        {value}
      </p>
    </div>
  );
}

function CharBadge({ count, limit }: { count: number; limit?: number }) {
  const over = limit !== undefined && count > limit;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        over ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
      )}
    >
      {count} Zeichen{limit ? ` / ${limit}` : ""}
    </span>
  );
}

export default function ChannelCard({ result }: Props) {
  if (result.channel === "twitter") {
    const { post, hashtags, charCount } = result.data;
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <CharBadge count={charCount} limit={280} />
        </div>
        <Field label="Tweet" value={post} />
        <Field label="Hashtags" value={hashtags.join(" ")} />
      </div>
    );
  }

  if (result.channel === "linkedin") {
    const { post, hashtags, charCount } = result.data;
    return (
      <div className="space-y-3">
        <CharBadge count={charCount} />
        <Field label="Beitrag" value={post} />
        <Field label="Hashtags" value={hashtags.join(" ")} />
      </div>
    );
  }

  if (result.channel === "instagram") {
    const { post, hashtags, charCount } = result.data;
    return (
      <div className="space-y-3">
        <CharBadge count={charCount} />
        <Field label="Caption" value={post} />
        <Field label="Hashtags" value={hashtags.join(" ")} />
      </div>
    );
  }

  if (result.channel === "newsletter") {
    const { subjectLine, preheader, summary, cta } = result.data;
    return (
      <div className="space-y-3">
        <Field label="Betreff" value={subjectLine} />
        <Field label="Preheader" value={preheader} />
        <Field label="Zusammenfassung" value={summary} />
        <Field label="Call-to-Action" value={cta} />
      </div>
    );
  }

  if (result.channel === "push") {
    const { title, body, charCount } = result.data;
    return (
      <div className="space-y-3">
        <CharBadge count={charCount} limit={100} />
        <Field label="Titel" value={title} />
        <Field label="Nachricht" value={body} />
      </div>
    );
  }

  if (result.channel === "audio") {
    const { script, durationEstimate } = result.data;
    return (
      <div className="space-y-3">
        <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
          {durationEstimate}
        </span>
        <Field label="Skript" value={script} />
      </div>
    );
  }

  if (result.channel === "image_brief") {
    const { headline, visualConcept, mood, colorPalette, copyOverlay } =
      result.data;
    return (
      <div className="space-y-3">
        <Field label="Headline" value={headline} />
        <Field label="Visuelles Konzept" value={visualConcept} />
        <Field label="Mood / Stil" value={mood} />
        <Field label="Farbpalette" value={colorPalette} />
        <Field label="Copy-Overlay" value={copyOverlay} />
      </div>
    );
  }

  return null;
}
