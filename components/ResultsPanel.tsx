"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import {
  XIcon,
  Briefcase,
  Camera,
  Mail,
  Bell,
  Mic2,
  Image,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChannelResult, Channel } from "@/lib/types";
import ChannelCard from "./ChannelCard";

const CHANNEL_META: Record<
  Channel,
  { label: string; Icon: ComponentType<{ className?: string }>; color: string }
> = {
  twitter: { label: "Twitter / X", Icon: XIcon, color: "text-sky-500" },
  linkedin: { label: "LinkedIn", Icon: Briefcase, color: "text-blue-600" },
  instagram: { label: "Instagram", Icon: Camera, color: "text-pink-500" },
  newsletter: { label: "Newsletter", Icon: Mail, color: "text-violet-600" },
  push: { label: "Push", Icon: Bell, color: "text-orange-500" },
  audio: { label: "Audio-Skript", Icon: Mic2, color: "text-emerald-600" },
  image_brief: { label: "Bild-Briefing", Icon: Image, color: "text-amber-500" },
};

interface Props {
  results: ChannelResult[] | null;
  loading: boolean;
  error: string | null;
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-2/3 rounded-xl bg-slate-200" />
      <div className="h-4 w-full rounded-lg bg-slate-100" />
      <div className="h-4 w-5/6 rounded-lg bg-slate-100" />
      <div className="h-4 w-4/6 rounded-lg bg-slate-100" />
      <div className="mt-6 h-8 w-2/3 rounded-xl bg-slate-200" />
      <div className="h-4 w-full rounded-lg bg-slate-100" />
      <div className="h-4 w-3/4 rounded-lg bg-slate-100" />
    </div>
  );
}

export default function ResultsPanel({ results, loading, error }: Props) {
  const [activeTab, setActiveTab] = useState<Channel | null>(null);

  const activeChannel =
    activeTab ?? (results && results.length > 0 ? results[0].channel : null);
  const activeResult = results?.find((r) => r.channel === activeChannel);

  if (!loading && !results && !error) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light">
          <span className="text-3xl">🔄</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-700">
          Bereit zur Wiederverwendung
        </h3>
        <p className="mt-2 max-w-xs text-sm text-slate-400">
          Geben Sie Ihren Artikel ein, wählen Sie Kanäle aus und klicken Sie auf{" "}
          <strong>Generieren</strong>.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-1">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-brand" />
          Inhalte werden generiert…
        </div>
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-700">{error}</p>
      </div>
    );
  }

  if (!results || results.length === 0) return null;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-100 pb-4">
        {results.map(({ channel }) => {
          const { label, Icon, color } = CHANNEL_META[channel];
          const active = channel === activeChannel;
          return (
            <button
              key={channel}
              onClick={() => setActiveTab(channel)}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-navy-950 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-white" : color)} />
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeResult && <ChannelCard result={activeResult} />}
      </div>
    </div>
  );
}
