"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, PenLine, LogOut, Sun, Moon, User, LayoutDashboard, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useCallback } from "react";
import type { ApiPost } from "@/lib/api";
import { getUser, clearAuth } from "@/lib/auth";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { theme, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  function handleLogout() {
    clearAuth();
    setUser(null);
    router.push("/");
  }

  const search = useCallback((q: string) => {
    if (q.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data: { posts: ApiPost[] }) => {
        const lower = q.toLowerCase();
        setResults((data.posts ?? []).filter((p) => p.title.toLowerCase().includes(lower)).slice(0, 5));
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  function handleQueryChange(val: string) {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  }

  function handleSelect(id: string) {
    setQuery(""); setResults([]); setSearchOpen(false);
    router.push(`/blog/${id}`);
  }

  return (
    <header className="w-full sticky top-0 z-50 bg-white/90 dark:bg-[#080c14]/95 border-b border-slate-200 dark:border-cyan-500/20 backdrop-blur-md dark:shadow-[0_1px_0_0_rgba(34,211,238,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="bg-cyan-500/10 dark:bg-cyan-500/20 p-1.5 rounded-lg border border-cyan-500/20 dark:border-cyan-500/40 group-hover:border-cyan-500/60 transition-colors">
            <Zap className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-cyan-500 dark:text-cyan-400">Meta</span>
            <span className="text-slate-900 dark:text-slate-100">Blog</span>
          </span>
        </Link>

        <div className="flex-1" />

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">

          {/* Search */}
          <div className="relative">
            <div className={cn(
              "flex items-center gap-2 border rounded-lg px-3 py-1.5 transition-all duration-200",
              searchOpen
                ? "w-64 border-cyan-500/50 dark:border-cyan-500/60 bg-white dark:bg-slate-900/80 shadow-[0_0_12px_rgba(34,211,238,0.15)]"
                : "w-36 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
            )}>
              <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => { setSearchOpen(false); setResults([]); }, 200)}
                placeholder="Search..."
                className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none w-full"
              />
              {query && (
                <button onClick={() => { setQuery(""); setResults([]); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {searchOpen && query.trim().length >= 2 && (
              <div className="absolute top-full mt-2 left-0 w-80 bg-white dark:bg-[#0d1321] rounded-xl border border-slate-200 dark:border-cyan-500/20 shadow-xl dark:shadow-[0_4px_30px_rgba(34,211,238,0.1)] overflow-hidden z-50">
                {loading && <div className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500">Searching…</div>}
                {!loading && results.length > 0 && results.map((p) => (
                  <button key={p.id} onMouseDown={() => handleSelect(p.id)}
                    className="w-full text-left px-4 py-3 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100 line-clamp-1 block">{p.title}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{new Date(p.createdAt).toLocaleDateString()}</span>
                  </button>
                ))}
                {!loading && results.length === 0 && (
                  <div className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500">No results for &quot;{query}&quot;</div>
                )}
              </div>
            )}
          </div>

          {/* Contact */}
          <Link href="/contact" className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
            pathname === "/contact"
              ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}>
            Contact
          </Link>

          {/* Dark mode toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}
            className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button variant="ghost" size="icon"
                    className="text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10"
                    title="Admin">
                    <LayoutDashboard className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Link href="/profile">
                <Button variant="ghost" size="icon"
                  className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10"
                  title="Profile">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/create">
                <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 text-white dark:text-cyan-300 border border-transparent dark:border-cyan-500/40 rounded-lg gap-1.5 font-semibold transition-all dark:shadow-[0_0_12px_rgba(34,211,238,0.2)] dark:hover:shadow-[0_0_18px_rgba(34,211,238,0.35)]">
                  <PenLine className="h-3.5 w-3.5" />
                  Write
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}
                className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline"
                className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-500/60 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <Button variant="ghost" size="icon" className="md:hidden text-slate-500 dark:text-slate-400"
          onClick={() => setMobileOpen((o) => !o)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-[#0d1321] border-t border-slate-100 dark:border-cyan-500/10 px-4 pb-4 pt-3 space-y-1">
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900/50 mb-2">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <input value={query} onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search posts..."
              className="bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none w-full" />
          </div>
          {query.trim().length >= 2 && results.map((p) => (
            <button key={p.id} onClick={() => { handleSelect(p.id); setMobileOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors">
              <span className="text-sm font-medium text-slate-800 dark:text-slate-100 line-clamp-1 block">{p.title}</span>
            </button>
          ))}
          <Link href="/contact" onClick={() => setMobileOpen(false)}
            className={cn("flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === "/contact"
                ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800")}>
            Contact
          </Link>
          <button onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 w-full">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10">
                  <LayoutDashboard className="h-4 w-4" /> Admin
                </Link>
              )}
              <Link href="/profile" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                <User className="h-4 w-4" /> Profile
              </Link>
              <Link href="/create" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10">
                <PenLine className="h-4 w-4" /> Write a post
              </Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 w-full">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10">
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
