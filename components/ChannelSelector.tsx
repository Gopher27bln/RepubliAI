"use client";

import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { Channel } from "@/lib/types";
import {
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Bell,
  Mic2,
  Image,
} from "lucide-react";

interface ChannelConfig {
  id: Channel;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
}

const CHANNELS: ChannelConfig[] = [
  {
    id: "twitter",
    label: "Twitter / X",
    description: "Kurzer Post, max. 280 Zeichen",
    icon: Twitter,
    color: "bg-sky-50 border-sky-200 text-sky-700",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Professioneller Beitrag mit Erkenntnissen",
    icon: Linkedin,
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    id: "instagram",
    label: "Instagram",
    description: "Caption mit Hashtags",
    icon: Instagram,
    color: "bg-pink-50 border-pink-200 text-pink-700",
  },
  {
    id: "newsletter",
    label: "Newsletter",
    description: "Betreff, Preheader & Teaser",
    icon: Mail,
    color: "bg-violet-50 border-violet-200 text-violet-700",
  },
  {
    id: "push",
    label: "Push-Nachricht",
    description: "Titel + Ultra-Kurztext ≤100 Zeichen",
    icon: Bell,
    color: "bg-orange-50 border-orange-200 text-orange-700",
  },
  {
    id: "audio",
    label: "Audio-Skript",
    description: "TTS-fähiges Vorleseskript",
    icon: Mic2,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    id: "image_brief",
    label: "Bild-Briefing",
    description: "Kreativ-Brief für Grafiker / Designer",
    icon: Image,
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
];

interface Props {
  selected: Channel[];
  onChange: (channels: Channel[]) => void;
}

export default function ChannelSelector({ selected, onChange }: Props) {
  const toggle = (id: Channel) => {
    if (selected.includes(id)) {
      onChange(selected.filter((c) => c !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">
          Ausgabe-Kanäle
        </label>
        <button
          type="button"
          onClick={() =>
            selected.length === CHANNELS.length
              ? onChange([])
              : onChange(CHANNELS.map((c) => c.id))
          }
          className="text-xs text-brand hover:underline"
        >
          {selected.length === CHANNELS.length ? "Alle abwählen" : "Alle wählen"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
        {CHANNELS.map(({ id, label, description, icon: Icon, color }) => {
          const active = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={cn(
                "flex items-start gap-2.5 rounded-xl border-2 p-3 text-left transition-all duration-150",
                active
                  ? cn(color, "ring-2 ring-brand ring-offset-1")
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  active ? "" : "text-slate-400"
                )}
              />
              <div>
                <p className="text-xs font-semibold leading-tight">{label}</p>
                <p className="mt-0.5 text-[10px] leading-tight opacity-75">
                  {description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
