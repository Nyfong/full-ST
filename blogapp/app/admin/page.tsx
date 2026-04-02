"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from "recharts";
import {
  Trash2, ExternalLink, FileText, Users,
  BarChart3, Clock, TrendingUp, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getToken, getUser } from "@/lib/auth";
import { extractImage, formatDate, readTime } from "@/lib/api";
import type { ApiPost } from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "posts">("overview");

  useEffect(() => {
    const user = getUser();
    if (!user) { router.replace("/login"); return; }
    if (user.role !== "admin") { router.replace("/"); return; }
    fetchPosts();
  }, [router]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const token = getToken();
      await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalWords = posts.reduce((acc, p) => {
    const { body } = extractImage(p.content);
    return acc + body.trim().split(/\s+/).length;
  }, 0);
  const avgReadTime = posts.length ? Math.max(1, Math.round(totalWords / posts.length / 200)) : 0;
  const authorMap: Record<string, string> = {};
  const postsByAuthor: Record<string, number> = {};
  posts.forEach((p) => {
    postsByAuthor[p.authorId] = (postsByAuthor[p.authorId] ?? 0) + 1;
    if (!authorMap[p.authorId]) authorMap[p.authorId] = p.authorId.slice(0, 6);
  });
  const uniqueAuthors = Object.keys(postsByAuthor).length;

  // Posts per author chart data
  const authorChartData = Object.entries(postsByAuthor)
    .map(([id, count]) => ({ name: authorMap[id] ?? id.slice(0, 6), posts: count }))
    .sort((a, b) => b.posts - a.posts);

  // Posts over time (by day, last 14 days)
  const now = Date.now();
  const dayMs = 86400000;
  const timelineData = Array.from({ length: 14 }, (_, i) => {
    const day = new Date(now - (13 - i) * dayMs);
    const label = day.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const count = posts.filter((p) => {
      const d = new Date(p.createdAt);
      return d.toDateString() === day.toDateString();
    }).length;
    return { label, count };
  });

  // Recent 5 posts for overview
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-xl">
              <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage content and monitor activity</p>
            </div>
          </div>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {(["overview", "posts"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── OVERVIEW TAB ─────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<FileText className="h-5 w-5 text-blue-500" />}
                label="Total Posts" value={posts.length} sub="all time" color="blue" />
              <StatCard icon={<Users className="h-5 w-5 text-violet-500" />}
                label="Authors" value={uniqueAuthors} sub="contributors" color="violet" />
              <StatCard icon={<BarChart3 className="h-5 w-5 text-emerald-500" />}
                label="Total Words" value={totalWords.toLocaleString()} sub="across all posts" color="emerald" />
              <StatCard icon={<Clock className="h-5 w-5 text-amber-500" />}
                label="Avg Read Time" value={`${avgReadTime} min`} sub="per post" color="amber" />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Posts over time */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Posts — last 14 days</h2>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0", fontSize: 12 }}
                      formatter={(v) => [v, "posts"]}
                    />
                    <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2}
                      dot={{ r: 3, fill: "#2563eb" }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Posts per author */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-violet-500" />
                  <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Posts per author</h2>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={authorChartData} barSize={28}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "0.75rem", border: "1px solid #e2e8f0", fontSize: 12 }}
                      formatter={(v) => [v, "posts"]}
                    />
                    <Bar dataKey="posts" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent posts */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Recent Posts</h2>
                <button onClick={() => setActiveTab("posts")}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium">View all →</button>
              </div>
              {loading ? (
                <div className="px-5 py-8 text-center text-slate-400 text-sm">Loading…</div>
              ) : (
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {recentPosts.map((post) => {
                    const { body } = extractImage(post.content);
                    return (
                      <div key={post.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{post.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{formatDate(post.createdAt)} · {readTime(body)}</p>
                        </div>
                        <Link href={`/blog/${post.id}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-500">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── POSTS TAB ────────────────────────────────────────────────────── */}
        {activeTab === "posts" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">All Posts</h2>
              <Badge className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 rounded-full text-xs">
                {posts.length} total
              </Badge>
            </div>

            {loading ? (
              <div className="px-6 py-12 text-center text-slate-400 text-sm">Loading posts…</div>
            ) : posts.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400 text-sm">No posts found.</div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {posts.map((post) => {
                  const { body } = extractImage(post.content);
                  return (
                    <div key={post.id} className="px-6 py-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate max-w-xs">{post.title}</span>
                          <Badge className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-0 rounded-full font-normal">
                            {readTime(body)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 dark:text-slate-500">
                          <span>{formatDate(post.createdAt)}</span>
                          <span className="font-mono">ID: {post.id.slice(0, 8)}…</span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">{body.slice(0, 120)}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Link href={`/blog/${post.id}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500" title="View">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        {confirmId === post.id ? (
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="destructive" className="h-7 text-xs rounded-lg"
                              disabled={deletingId === post.id}
                              onClick={() => handleDelete(post.id)}>
                              {deletingId === post.id ? "…" : "Delete"}
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg"
                              onClick={() => setConfirmId(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                            title="Delete" onClick={() => setConfirmId(post.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  color: "blue" | "violet" | "emerald" | "amber";
}) {
  const bg: Record<string, string> = {
    blue:    "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900",
    violet:  "bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-900",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900",
    amber:   "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900",
  };
  return (
    <div className={`rounded-2xl p-5 border ${bg[color]}`}>
      <div className="mb-3">{icon}</div>
      <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-none">{value}</div>
      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">{label}</div>
      <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</div>
    </div>
  );
}
