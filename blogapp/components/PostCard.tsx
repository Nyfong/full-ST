import Link from "next/link";
import Image from "next/image";
import type { ApiPost } from "@/lib/api";
import { extractImage, authorAvatar, formatDate, readTime } from "@/lib/api";
import PostImage from "@/components/PostImage";

export default function PostCard({ post }: { post: ApiPost }) {
  const { imageUrl, body } = extractImage(post.content);

  return (
    <article className="group flex flex-col bg-white dark:bg-[#0d1321] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-cyan-300 dark:hover:border-cyan-500/40 transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_4px_24px_rgba(34,211,238,0.08)]">

      {/* Cover */}
      <Link href={`/blog/${post.id}`} className="block overflow-hidden">
        <div className="relative h-44 w-full">
          {imageUrl.startsWith("emoji:") ? (
            <div className="w-full h-full bg-linear-to-br from-cyan-950/40 to-purple-950/40 dark:from-cyan-950/60 dark:to-purple-950/60 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform duration-300 border-b border-slate-100 dark:border-slate-800">
              {imageUrl.slice(6)}
            </div>
          ) : imageUrl ? (
            <PostImage src={imageUrl} alt={post.title} className="group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
              <span className="text-4xl opacity-40">📝</span>
            </div>
          )}
          {/* Neon bottom line on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-cyan-500/0 via-cyan-500/60 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Tag */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-500 tracking-widest uppercase">
            // Article
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-600 font-mono ml-auto">{readTime(body)}</span>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.id}`}>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-snug line-clamp-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Author row */}
        <div className="mt-auto flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Image
            src={authorAvatar(post.authorId)}
            alt="Author"
            width={24}
            height={24}
            className="rounded-full ring-1 ring-cyan-500/30 dark:ring-cyan-500/20"
          />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Author</span>
          <span className="text-slate-300 dark:text-slate-600 text-xs ml-auto font-mono">{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}
