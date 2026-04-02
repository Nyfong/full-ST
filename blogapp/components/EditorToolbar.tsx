"use client";

import { useRef } from "react";
import { Heading2, Quote, Code2, Minus } from "lucide-react";

type Props = {
  value: string;
  onChange: (val: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

type Snippet = {
  label: string;
  icon: React.ReactNode;
  title: string;
  insert: (selected: string) => { text: string; cursorOffset: number };
};

const SNIPPETS: Snippet[] = [
  {
    label: "H2",
    icon: <Heading2 className="h-4 w-4" />,
    title: "Section heading",
    insert: (sel) => ({
      text: `## ${sel || "Section Title"}`,
      cursorOffset: sel ? 0 : -"Section Title".length,
    }),
  },
  {
    label: "Quote",
    icon: <Quote className="h-4 w-4" />,
    title: "Blockquote",
    insert: (sel) => ({
      text: `> ${sel || "Your quote here"}`,
      cursorOffset: sel ? 0 : -"Your quote here".length,
    }),
  },
  {
    label: "Code",
    icon: <Code2 className="h-4 w-4" />,
    title: "Code block",
    insert: (sel) => {
      const body = sel || "// your code here";
      return {
        text: `\`\`\`javascript\n${body}\n\`\`\``,
        cursorOffset: sel ? 0 : -"\n```".length - body.length,
      };
    },
  },
  {
    label: "Divider",
    icon: <Minus className="h-4 w-4" />,
    title: "Horizontal divider",
    insert: () => ({ text: "\n---\n", cursorOffset: 0 }),
  },
];

const LANGUAGES = ["javascript", "typescript", "bash", "python", "json", "css", "html", "sql"];

export default function EditorToolbar({ value, onChange, textareaRef }: Props) {
  const langRef = useRef("javascript");

  function insertAtCursor(snippet: Snippet) {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = value.slice(start, end);

    // For code blocks, use the selected language
    let { text, cursorOffset } = snippet.insert(selected);
    if (snippet.label === "Code") {
      text = text.replace("javascript", langRef.current);
    }

    const before = value.slice(0, start);
    const after = value.slice(end);

    // Add newlines around block-level snippets if needed
    const needsLeadingNewline = before.length > 0 && !before.endsWith("\n\n");
    const prefix = needsLeadingNewline ? "\n\n" : "";
    const suffix = after.length > 0 && !after.startsWith("\n") ? "\n\n" : "";

    const newValue = before + prefix + text + suffix + after;
    onChange(newValue);

    // Restore focus and move cursor
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + prefix.length + text.length + (cursorOffset < 0 ? cursorOffset : 0) + suffix.length;
      el.setSelectionRange(pos, pos);
    });
  }

  return (
    <div className="flex items-center gap-1 flex-wrap border border-slate-200 rounded-t-xl bg-slate-50 px-3 py-2">
      {/* Snippet buttons */}
      {SNIPPETS.map((s) => (
        <button
          key={s.label}
          type="button"
          title={s.title}
          onClick={() => insertAtCursor(s)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all border border-transparent hover:border-slate-200"
        >
          {s.icon}
          <span>{s.label}</span>
        </button>
      ))}

      {/* Divider */}
      <div className="w-px h-5 bg-slate-200 mx-1" />

      {/* Language selector for code blocks */}
      <div className="flex items-center gap-1.5">
        <Code2 className="h-3.5 w-3.5 text-slate-400" />
        <select
          defaultValue="javascript"
          onChange={(e) => { langRef.current = e.target.value; }}
          className="text-xs text-slate-600 bg-transparent border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Language for code blocks"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Hint */}
      <span className="ml-auto text-xs text-slate-300 hidden sm:block">
        Select text then click a button to wrap it
      </span>
    </div>
  );
}
