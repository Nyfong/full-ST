import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-[#050810] border-t border-slate-800 dark:border-cyan-500/10 mt-20">
      {/* Neon top accent */}
      <div className="h-px bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-cyan-500/10 p-1.5 rounded-lg border border-cyan-500/20">
                <Zap className="h-4 w-4 text-cyan-400" />
              </div>
              <span className="font-bold text-lg">
                <span className="text-cyan-400">Meta</span>
                <span className="text-white">Blog</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              A tech-forward blog exploring code, systems, and the future — for curious minds.
            </p>
            <p className="text-xs text-slate-500 font-mono">
              <span className="text-slate-400">// </span>hello@metablog.com
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-300 font-semibold text-xs mb-4 uppercase tracking-widest font-mono">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {["Home", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-slate-500 hover:text-cyan-400 transition-colors font-mono text-xs"
                  >
                    <span className="text-cyan-600/40 mr-1">&gt;</span> {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-slate-300 font-semibold text-xs mb-4 uppercase tracking-widest font-mono">
              Topics
            </h4>
            <ul className="space-y-2.5 text-sm">
              {["JavaScript", "TypeScript", "Next.js", "React", "APIs", "DevOps"].map((c) => (
                <li key={c}>
                  <Link href="/blog" className="text-slate-500 hover:text-cyan-400 transition-colors font-mono text-xs">
                    <span className="text-purple-500/40 mr-1">#</span>{c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-slate-300 font-semibold text-xs mb-4 uppercase tracking-widest font-mono">
              Newsletter
            </h4>
            <p className="text-xs text-slate-400 mb-4 font-mono leading-relaxed">
              // Weekly drops. No spam.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-slate-800/80 border border-slate-700 focus:border-cyan-500/60 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:shadow-[0_0_8px_rgba(34,211,238,0.2)] font-mono transition-all"
              />
              <button className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 hover:border-cyan-500/60 text-cyan-300 font-semibold rounded-lg py-2.5 text-sm transition-all hover:shadow-[0_0_12px_rgba(34,211,238,0.2)] font-mono">
                Subscribe_
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600 font-mono">
            <span className="text-cyan-600/50">©</span> {new Date().getFullYear()} MetaBlog — All rights reserved
          </p>
          <div className="flex gap-5 text-xs text-slate-600 font-mono">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <Link key={item} href="#" className="hover:text-cyan-400 transition-colors">{item}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
