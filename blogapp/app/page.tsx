import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/PostCard";
import { getPosts, postImage, authorAvatar, formatDate, extractImage } from "@/lib/api";
import { Zap, ArrowRight } from "lucide-react";

export const revalidate = 30;

export default async function Home() {
  const allPosts = await getPosts().catch(() => []);

  if (allPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4 text-center px-4">
        <div className="text-5xl">⚡</div>
        <p className="text-lg font-bold text-slate-700 dark:text-slate-200">No posts yet.</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">Start the blog-api and seed some content.</p>
      </div>
    );
  }

  const [featured, ...latestPosts] = allPosts;
  const { imageUrl: featuredImage } = extractImage(featured.content);
  const heroImage = featuredImage && !featuredImage.startsWith("emoji:") ? featuredImage : postImage(featured.id);

  return (
    <div className="bg-[#f0f4f8] dark:bg-[#080c14]">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-130 overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-60 dark:opacity-100 z-10" />

        <Image src={heroImage} alt={featured.title} fill className="object-cover" priority />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-900/60 to-transparent z-20" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent z-20" />

        {/* Neon accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-cyan-500/60 via-purple-500/40 to-transparent z-30" />

        <div className="absolute inset-0 flex items-end z-30">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-14">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-sm px-3 py-1 text-xs font-mono tracking-widest uppercase">
                  <Zap className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
              <Link href={`/blog/${featured.id}`}>
                <h1 className="text-white font-bold text-3xl md:text-4xl leading-tight mb-5 hover:text-cyan-300 transition-colors">
                  {featured.title}
                </h1>
              </Link>
              <div className="flex items-center gap-3">
                <Image
                  src={authorAvatar(featured.authorId)}
                  alt="Author"
                  width={34}
                  height={34}
                  className="rounded-full ring-2 ring-cyan-500/40"
                />
                <div>
                  <span className="text-slate-200 text-sm font-semibold">Author</span>
                  <span className="text-slate-400 text-xs ml-2 font-mono">{formatDate(featured.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trending bar ──────────────────────────────────────────────────── */}
      {latestPosts.length > 0 && (
        <div className="bg-white dark:bg-[#0a0f1e] border-y border-slate-200 dark:border-cyan-500/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4 text-sm overflow-x-auto">
            <span className="bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 dark:border-cyan-500/40 font-bold text-xs px-3 py-1 rounded-sm font-mono tracking-widest whitespace-nowrap uppercase">
              Trending
            </span>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 shrink-0" />
            {latestPosts.slice(0, 4).map((p, i) => (
              <Link key={p.id} href={`/blog/${p.id}`}
                className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 group">
                <span className="text-cyan-500/50 dark:text-cyan-500/40 font-bold text-xs font-mono">0{i + 1}</span>
                <span className="text-xs font-medium truncate max-w-48 group-hover:underline underline-offset-2">{p.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Latest Posts ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-4 w-1 bg-cyan-500 dark:bg-cyan-400 rounded-full" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Latest Posts</h2>
            </div>
            <p className="text-slate-500 dark:text-slate-500 text-sm font-mono pl-3">Fresh articles & insights</p>
          </div>
          <Link href="/blog">
            <Button variant="outline"
              className="text-cyan-600 dark:text-cyan-400 border-cyan-300 dark:border-cyan-500/40 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 text-sm font-medium rounded-lg gap-1.5">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {latestPosts.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-500 text-sm font-mono">Only one post so far — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {latestPosts.length >= 6 && (
          <div className="flex justify-center mt-12">
            <Button variant="outline"
              className="border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-cyan-400 dark:hover:border-cyan-500/60 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 px-8 rounded-lg font-medium">
              Load More Posts
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
