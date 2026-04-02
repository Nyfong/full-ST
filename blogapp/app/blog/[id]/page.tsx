import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostCard from "@/components/PostCard";
import PostImage from "@/components/PostImage";
import {
  getPostById,
  getPosts,
  extractImage,
  authorAvatar,
  formatDate,
  readTime,
} from "@/lib/api";
import { ArrowLeft, Clock, Calendar, ImageOff, Zap } from "lucide-react";
import DeletePostButton from "@/components/DeletePostButton";

export const revalidate = 30;

export async function generateStaticParams() {
  const posts = await getPosts().catch(() => []);
  return posts.map((p) => ({ id: p.id }));
}

export default async function BlogPostPage(props: PageProps<"/blog/[id]">) {
  const { id } = await props.params;

  const post = await getPostById(id).catch(() => null);
  if (!post) notFound();

  const { imageUrl, body } = extractImage(post.content);
  const allPosts = await getPosts().catch(() => []);
  const relatedPosts = allPosts.filter((p) => p.id !== id).slice(0, 3);
  const paragraphs = body.split("\n\n");

  return (
    <div className="bg-[#f0f4f8] dark:bg-[#080c14] min-h-screen">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-72 md:h-110 overflow-hidden">
        {imageUrl.startsWith("emoji:") ? (
          <div className="w-full h-full bg-linear-to-br from-cyan-950/30 to-purple-950/40 dark:from-cyan-950 dark:to-purple-950 flex items-center justify-center text-9xl">
            {imageUrl.slice(6)}
          </div>
        ) : imageUrl ? (
          <PostImage src={imageUrl} alt={post.title} />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center gap-3">
            <ImageOff className="h-12 w-12 text-slate-400 dark:text-slate-600" />
            <span className="text-sm text-slate-400 dark:text-slate-600 font-mono">// no cover image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#f0f4f8] dark:from-[#080c14] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/40 to-transparent" />
      </div>

      {/* ── Article ────────────────────────────────────────────────────────── */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative">

        {/* Meta card */}
        <div className="bg-white dark:bg-[#0d1321] rounded-xl border border-slate-200 dark:border-slate-800 dark:hover:border-cyan-500/20 px-6 py-5 mb-8 shadow-sm transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-500 tracking-widest uppercase flex items-center gap-1">
              <Zap className="h-3 w-3" /> Article
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 leading-tight tracking-tight mb-5">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Image
                src={authorAvatar(post.authorId)}
                alt="Author"
                width={32}
                height={32}
                className="rounded-full ring-2 ring-cyan-500/30"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-200">Author</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <Calendar className="h-3.5 w-3.5 text-cyan-500/60" />
              <span className="text-slate-500 dark:text-slate-400">{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <Clock className="h-3.5 w-3.5 text-purple-500/60" />
              <span className="text-slate-500 dark:text-slate-400">{readTime(body)}</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 leading-relaxed mb-16">
          {paragraphs.map((block, i) => {
            if (block.startsWith("## ")) {
              return (
                <h2 key={i} className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50 mt-10 mb-1 flex items-center gap-2">
                  <span className="text-cyan-500 dark:text-cyan-400 font-mono text-lg">//</span>
                  {block.slice(3)}
                </h2>
              );
            }
            if (block.startsWith("> ")) {
              return (
                <blockquote key={i} className="pl-5 py-3 border-l-2 border-cyan-500 dark:border-cyan-500/60 italic text-slate-600 dark:text-slate-300 bg-cyan-50/50 dark:bg-cyan-500/5 rounded-r-lg pr-4 my-6">
                  {block.slice(2)}
                </blockquote>
              );
            }
            if (block.startsWith("```")) {
              const lines = block.split("\n");
              const lang = lines[0].slice(3).trim() || "code";
              const code = lines.slice(1, lines[lines.length - 1] === "```" ? -1 : undefined).join("\n");
              return (
                <div key={i} className="rounded-xl overflow-hidden border border-slate-200 dark:border-cyan-500/15 my-4 shadow-sm dark:shadow-[0_0_20px_rgba(34,211,238,0.05)]">
                  <div className="flex items-center justify-between bg-slate-800 dark:bg-[#0a0f1e] px-4 py-2 border-b border-slate-700 dark:border-cyan-500/10">
                    <span className="text-xs font-mono text-cyan-400/80">{lang}</span>
                    <span className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/60" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <span className="w-3 h-3 rounded-full bg-green-500/60" />
                    </span>
                  </div>
                  <pre className="bg-slate-900 dark:bg-[#060a12] text-slate-100 px-5 py-4 text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre">
                    <code>{code}</code>
                  </pre>
                </div>
              );
            }
            return (
              <p key={i} className="text-base leading-8 text-slate-700 dark:text-slate-300">{block}</p>
            );
          })}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mb-12" />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-4 w-1 bg-purple-500 dark:bg-purple-400 rounded-full" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Related Posts</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedPosts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}

        <div className="flex items-center justify-between mb-16">
          <Link href="/"
            className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-sm font-medium hover:text-cyan-800 dark:hover:text-cyan-300 transition-colors font-mono">
            <ArrowLeft className="h-4 w-4" />
            cd ~/home
          </Link>
          <DeletePostButton postId={id} authorId={post.authorId} />
        </div>
      </article>
    </div>
  );
}
