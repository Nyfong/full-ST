"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createPost, embedImage } from "@/lib/api";
import { getToken, getUser } from "@/lib/auth";
import CoverPicker from "@/components/CoverPicker";
import EditorToolbar from "@/components/EditorToolbar";
import { FileCode2, Lightbulb, BookOpen, Zap, X } from "lucide-react";

// ── Templates ───────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "code-tutorial",
    icon: <FileCode2 className="h-4 w-4 text-cyan-500" />,
    label: "Code Tutorial",
    cover: "emoji:💻",
    title: "How to Build [Feature] with [Technology]",
    content: `## Introduction

Brief overview of what we're building and why it matters.

## Prerequisites

\`\`\`bash
node --version   # v18+
npm --version    # v9+
\`\`\`

## Step 1: Setup

\`\`\`bash
mkdir my-project && cd my-project
npm init -y
npm install express
\`\`\`

## Step 2: Core Implementation

\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
\`\`\`

## Step 3: Testing

\`\`\`bash
node index.js
curl http://localhost:3000
\`\`\`

## Conclusion

What we built and what you can do next.`,
  },
  {
    id: "concept-explainer",
    icon: <BookOpen className="h-4 w-4 text-purple-500" />,
    label: "Concept Explainer",
    cover: "emoji:🧠",
    title: "Understanding [Concept]: A Developer's Guide",
    content: `## What is [Concept]?

A clear, one-paragraph definition. Explain it like the reader is smart but unfamiliar.

## Why Does It Matter?

> "[Concept] is important because..." — explain the real-world impact.

## How It Works

\`\`\`typescript
// A minimal example that demonstrates the concept
type Example = {
  key: string;
  value: unknown;
};

function demonstrate(input: Example): string {
  return \`\${input.key}: \${JSON.stringify(input.value)}\`;
}
\`\`\`

## Common Mistakes

\`\`\`typescript
// ❌ Wrong approach
const bad = doThingWrong();

// ✓ Correct approach
const good = doThingRight();
\`\`\`

## When to Use It

- Use when you need X
- Avoid when Y is the case
- Consider Z as an alternative`,
  },
  {
    id: "quick-tip",
    icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
    label: "Quick Tip",
    cover: "emoji:⚡",
    title: "[Language] Tip: [What It Does]",
    content: `## The Problem

What issue does this tip solve? Keep it to 1-2 sentences.

## The Solution

\`\`\`typescript
// Before — the painful way
const result = someArray
  .filter(item => item !== null)
  .map(item => item.value);

// After — the clean way
const result = someArray.flatMap(item =>
  item !== null ? [item.value] : []
);
\`\`\`

## Why This Works

Brief explanation of the underlying mechanism.

> Pro tip: this pattern also works for [related use case].`,
  },
];

export default function CreatePostPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", cover: "", content: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) router.replace("/login");
    else setUser(u);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const token = getToken();
      if (!token) { router.replace("/login"); return; }
      const finalContent = embedImage(form.content, form.cover);
      const post = await createPost({ title: form.title, content: finalContent }, token);
      router.push(`/blog/${post.id}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create post";
      if (msg.toLowerCase().includes("invalid token")) {
        const { clearAuth } = await import("@/lib/auth");
        clearAuth();
        router.replace("/login");
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function applyTemplate(tpl: typeof TEMPLATES[0]) {
    setForm({ title: tpl.title, cover: tpl.cover, content: tpl.content });
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  if (!user) return null;

  const wordCount = form.content.trim() ? form.content.trim().split(/\s+/).length : 0;

  return (
    <div className="min-h-screen bg-[#f0f4f8] dark:bg-[#080c14]">

      {/* Top bar */}
      <div className="sticky top-16 z-40 bg-white/90 dark:bg-[#0d1321]/95 backdrop-blur-md border-b border-slate-200 dark:border-cyan-500/15 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-cyan-500" />
          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">New Post</span>
          <span className="text-slate-400 dark:text-slate-600 font-mono text-xs ml-2">// {user.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 dark:text-slate-600">{wordCount}w</span>
          <Button
            type="submit"
            form="post-form"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 text-white dark:text-cyan-300 border border-transparent dark:border-cyan-500/40 font-semibold rounded-lg px-5 text-sm dark:shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all"
          >
            {loading ? "Publishing…" : "Publish_"}
          </Button>
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
              <X className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        </div>
      )}

      {/* ── Split layout ──────────────────────────────────────────────────── */}
      <form id="post-form" onSubmit={handleSubmit}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT: Config panel ──────────────────────────────────────── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-4 lg:sticky lg:top-36">

            {/* Title */}
            <div className="bg-white dark:bg-[#0d1321] rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <label className="block text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">
                // title
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Post title…"
                className="w-full text-base font-bold text-slate-900 dark:text-slate-50 placeholder:text-slate-300 dark:placeholder:text-slate-700 border-0 focus:outline-none bg-transparent"
              />
            </div>

            {/* Cover */}
            <div className="bg-white dark:bg-[#0d1321] rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <label className="block text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                // cover_image <span className="normal-case font-normal opacity-60">(optional)</span>
              </label>
              <CoverPicker
                value={form.cover}
                onChange={(val) => setForm((f) => ({ ...f, cover: val }))}
              />
            </div>

            {/* Templates */}
            <div className="bg-white dark:bg-[#0d1321] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <FileCode2 className="h-4 w-4 text-cyan-500" />
                <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-widest">// templates</span>
              </div>
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-cyan-500/5 transition-colors group"
                  >
                    <div className="mt-0.5">{tpl.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {tpl.label}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate font-mono mt-0.5">
                        {tpl.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-4 py-2.5 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400 dark:text-slate-600 font-mono">
                  click any template to load it into the editor →
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 text-white dark:text-cyan-300 border border-transparent dark:border-cyan-500/40 font-semibold rounded-lg dark:shadow-[0_0_12px_rgba(34,211,238,0.15)] transition-all"
              >
                {loading ? "Publishing…" : "Publish Post"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setForm({ title: "", cover: "", content: "" })}
                className="text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-lg"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* ── RIGHT: Editor ────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-[#0d1321] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">// editor</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-300 dark:text-slate-700">{wordCount} words</span>
                </div>
              </div>
              <EditorToolbar
                value={form.content}
                onChange={(val) => setForm((f) => ({ ...f, content: val }))}
                textareaRef={textareaRef}
              />
              <textarea
                ref={textareaRef}
                required
                rows={32}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder={`Start writing here…\n\nOr pick a template from the left panel to get a pre-built structure with code blocks, headings, and quotes already set up.\n\nFormatting:\n  ## Heading\n  > Blockquote\n  \`\`\`js code \`\`\``}
                className="w-full border-0 px-5 py-4 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700 leading-7 focus:outline-none resize-none font-mono bg-transparent"
              />
              <div className="px-5 py-2.5 border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex gap-3 text-xs font-mono text-slate-400 dark:text-slate-600">
                <code className="text-cyan-600 dark:text-cyan-700">## Heading</code>
                <code className="text-purple-600 dark:text-purple-700">&gt; Quote</code>
                <code className="text-amber-600 dark:text-amber-700">```lang code```</code>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
