"use client";

import { useState } from "react";
import { Sparkles, Zap } from "lucide-react";
import ContentInput from "@/components/ContentInput";
import ChannelSelector from "@/components/ChannelSelector";
import ResultsPanel from "@/components/ResultsPanel";
import type { Channel, ChannelResult, Tone, Audience } from "@/lib/types";
import { ALL_CHANNELS } from "@/lib/types";

const SAMPLE_ARTICLE = {
  title: "KI verändert den deutschen Journalismus – Chancen und Risiken",
  body: `Künstliche Intelligenz hält Einzug in die deutschen Redaktionen und verändert die Art und Weise, wie Nachrichten produziert, verbreitet und konsumiert werden. Verlage wie Axel Springer, Gruner + Jahr und zahlreiche öffentlich-rechtliche Sender erproben KI-gestützte Werkzeuge für die Texterstellung, Bildbeschriftung und personalisierte Inhaltsausspielung.

Die Chancen sind beträchtlich: Redakteure können repetitive Aufgaben auslagern, Rechercheprozesse beschleunigen und durch automatische Übersetzungen neue Zielgruppen erschließen. Gleichzeitig wächst die Sorge um Qualitätsverlust, journalistische Unabhängigkeit und den Abbau von Arbeitsplätzen.

Medienforscher der Universität Hamburg warnen, dass ohne klare ethische Leitlinien und transparente Offenlegungspflichten das Vertrauen der Leserinnen und Leser nachhaltig beschädigt werden könnte. Der Deutsche Journalisten-Verband fordert daher einen KI-Kodex, der Mindeststandards für den redaktionellen Einsatz von KI-Systemen festlegt.

Trotz aller Bedenken: Die meisten Expertinnen und Experten sind sich einig, dass KI den Journalismus nicht ersetzen, sondern transformieren wird – hin zu mehr Geschwindigkeit, Personalisierung und globaler Reichweite.`,
};

export default function Home() {
  const [title, setTitle] = useState(SAMPLE_ARTICLE.title);
  const [body, setBody] = useState(SAMPLE_ARTICLE.body);
  const [tone, setTone] = useState<Tone>("neutral");
  const [audience, setAudience] = useState<Audience>("general");
  const [brandGuidelines, setBrandGuidelines] = useState("");
  const [channels, setChannels] = useState<Channel[]>(ALL_CHANNELS);

  const [results, setResults] = useState<ChannelResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = title.trim().length > 0 && body.trim().length > 0 && channels.length > 0;

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, tone, audience, brandGuidelines, channels }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Unbekannter Fehler");
      }

      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Generieren");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = () => {
    setTitle(SAMPLE_ARTICLE.title);
    setBody(SAMPLE_ARTICLE.body);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-950">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-navy-950">RepubliAI</span>
            <span className="hidden rounded-full bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand sm:inline">
              Content Repurposing Engine
            </span>
          </div>
          <button
            onClick={loadSample}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Beispielartikel laden
          </button>
        </div>
      </header>

      {/* Main layout */}
      <main className="mx-auto w-full max-w-screen-xl flex-1 px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px_1fr]">
          {/* Left: Article Input */}
          <section className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-800">Quellartikel</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Fügen Sie Ihren Originalinhalt ein.
              </p>
            </div>
            <ContentInput
              title={title}
              body={body}
              tone={tone}
              audience={audience}
              brandGuidelines={brandGuidelines}
              onTitleChange={setTitle}
              onBodyChange={setBody}
              onToneChange={setTone}
              onAudienceChange={setAudience}
              onBrandGuidelinesChange={setBrandGuidelines}
            />
          </section>

          {/* Center: Channel Selector + Generate */}
          <section className="flex flex-col gap-6 lg:border-x lg:border-slate-100 lg:px-6">
            <div>
              <h2 className="text-base font-bold text-slate-800">Kanäle</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Wählen Sie die Ausgabekanäle.
              </p>
            </div>
            <ChannelSelector selected={channels} onChange={setChannels} />

            <div className="mt-auto">
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-navy-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-navy-950/20 transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Generiere…" : "Inhalte generieren"}
              </button>
              {!canGenerate && !loading && (
                <p className="mt-2 text-center text-xs text-slate-400">
                  Titel, Text und mind. 1 Kanal erforderlich
                </p>
              )}
            </div>
          </section>

          {/* Right: Results */}
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-bold text-slate-800">Ergebnisse</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Kanaloptimierte Varianten Ihres Inhalts.
              </p>
            </div>
            <div className="min-h-[400px] flex-1 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <ResultsPanel results={results} loading={loading} error={error} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-4 text-center text-xs text-slate-400">
        RepubliAI MVP · Mock AI Engine (kein echter LLM-Aufruf) ·{" "}
        <span className="text-slate-300">→ Swap-in Point: lib/repurpose.ts</span>
      </footer>
    </div>
  );
}
