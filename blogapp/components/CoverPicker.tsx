"use client";

import { useState, useRef } from "react";
import { Upload, Link2, Smile, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PostImage from "@/components/PostImage";

const EMOJIS = [
  "🌍","🌅","🌆","🌇","🏔️","🏖️","🌿","🌸","🔥","💡",
  "🚀","✈️","🎨","📸","🎵","📚","💻","🤖","🧠","⚡",
  "🏆","❤️","🌈","🎭","🍕","☕","🎯","🔬","💼","🛸",
  "🌙","⭐","🦋","🐉","🎪","🎸","🧩","🌺","🦁","🐬",
];

type Tab = "url" | "upload" | "emoji";

type Props = {
  value: string;             // current cover value (url, data-url, or "emoji:🎨")
  onChange: (val: string) => void;
};

export default function CoverPicker({ value, onChange }: Props) {
  const [tab, setTab] = useState<Tab>("url");
  const [urlInput, setUrlInput] = useState(value.startsWith("emoji:") ? "" : value);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── preview logic ───────────────────────────────────────────────────────────
  const isEmoji = value.startsWith("emoji:");
  const emojiChar = isEmoji ? value.slice(6) : "";

  // ── image upload → canvas compress → base64 ──────────────────────────────
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 900;
        const scale = img.width > MAX ? MAX / img.width : 1;
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        onChange(dataUrl);
        setUploading(false);
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div>
      {/* ── tabs ────────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-3">
        {([
          { id: "url",    icon: <Link2 className="h-3.5 w-3.5" />,   label: "URL"    },
          { id: "upload", icon: <Upload className="h-3.5 w-3.5" />,  label: "Upload" },
          { id: "emoji",  icon: <Smile className="h-3.5 w-3.5" />,   label: "Emoji"  },
        ] as { id: Tab; icon: React.ReactNode; label: string }[]).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              tab === t.id
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── URL tab ─────────────────────────────────────────────────────────── */}
      {tab === "url" && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => onChange(urlInput.trim())}
            className="shrink-0 rounded-xl border-slate-200 text-sm"
          >
            Apply
          </Button>
        </div>
      )}

      {/* ── Upload tab ──────────────────────────────────────────────────────── */}
      {tab === "upload" && (
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-slate-200 rounded-xl py-6 flex flex-col items-center gap-2 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
          >
            <Upload className="h-6 w-6" />
            <span className="text-sm font-medium">
              {uploading ? "Processing…" : "Click to upload image"}
            </span>
            <span className="text-xs">JPG, PNG, WEBP — auto-compressed</span>
          </button>
        </div>
      )}

      {/* ── Emoji tab ───────────────────────────────────────────────────────── */}
      {tab === "emoji" && (
        <div className="border border-slate-200 rounded-xl p-3">
          <div className="grid grid-cols-10 gap-1">
            {EMOJIS.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => onChange(`emoji:${em}`)}
                className={cn(
                  "text-xl p-1.5 rounded-lg hover:bg-blue-50 transition-colors",
                  value === `emoji:${em}` && "bg-blue-100 ring-2 ring-blue-400"
                )}
              >
                {em}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Preview ─────────────────────────────────────────────────────────── */}
      <div className="mt-3 h-44 w-full rounded-xl overflow-hidden border border-slate-100">
        {!value ? (
          <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-300 gap-2">
            <ImageOff className="h-8 w-8" />
            <span className="text-xs">No cover selected</span>
          </div>
        ) : isEmoji ? (
          <div className="flex items-center justify-center h-full bg-linear-to-br from-blue-50 to-slate-100 text-8xl">
            {emojiChar}
          </div>
        ) : (
          <PostImage src={value} alt="Cover preview" />
        )}
      </div>

      {value && (
        <button
          type="button"
          onClick={() => { onChange(""); setUrlInput(""); }}
          className="mt-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors"
        >
          Remove cover
        </button>
      )}
    </div>
  );
}
