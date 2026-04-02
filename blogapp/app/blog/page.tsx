import { getPosts } from "@/lib/api";
import PostCard from "@/components/PostCard";

export const revalidate = 30;

export default async function BlogPage() {
  const posts = await getPosts().catch(() => []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Blog</h1>
      <p className="text-slate-400 text-sm mb-8">
        {posts.length} article{posts.length !== 1 ? "s" : ""} published
      </p>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-64 text-slate-400 gap-2">
          <p className="font-semibold">No posts yet.</p>
          <p className="text-sm">Start the blog-api and create some posts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
