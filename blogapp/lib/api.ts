// ── Types matching blog-api response shapes ──────────────────────────────────

export type ApiPost = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role?: string;
  createdAt: string;
};

export type AuthResponse = {
  user: ApiUser;
  token: string;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const { headers: extraHeaders, ...rest } = options ?? {};
  const res = await fetch(`${BASE_URL}/api/v1${path}`, {
    ...rest,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string; details?: { message: string }[] };
    const detail = body.details?.map((d) => d.message).join(", ");
    throw new Error(detail ?? body.error ?? `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<ApiPost[]> {
  const data = await apiFetch<{ posts: ApiPost[] }>("/posts");
  return data.posts;
}

export async function getPostById(id: string): Promise<ApiPost> {
  const data = await apiFetch<{ post: ApiPost }>(`/posts/${id}`);
  return data.post;
}

export async function createPost(
  payload: { title: string; content: string },
  token: string
): Promise<ApiPost> {
  const data = await apiFetch<{ post: ApiPost }>("/posts", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.post;
}

export async function updatePost(
  id: string,
  payload: { title?: string; content?: string },
  token: string
): Promise<ApiPost> {
  const data = await apiFetch<{ post: ApiPost }>(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.post;
}

export async function deletePost(id: string, token: string): Promise<void> {
  await apiFetch(`/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function register(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMe(token: string): Promise<ApiUser> {
  const data = await apiFetch<{ user: ApiUser }>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user;
}

export async function updateMe(
  payload: { name?: string; avatar?: string },
  token: string
): Promise<ApiUser> {
  const data = await apiFetch<{ user: ApiUser }>("/auth/me", {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.user;
}

// ── Image embed helpers ───────────────────────────────────────────────────────

const IMAGE_PREFIX = "[image]: ";

export function embedImage(content: string, imageUrl: string): string {
  if (!imageUrl.trim()) return content;
  return `${IMAGE_PREFIX}${imageUrl.trim()}\n\n${content}`;
}

export function extractImage(content: string): { imageUrl: string; body: string } {
  if (content.startsWith(IMAGE_PREFIX)) {
    const newline = content.indexOf("\n");
    const imageUrl = content.slice(IMAGE_PREFIX.length, newline).trim();
    const body = content.slice(newline).trim();
    return { imageUrl, body };
  }
  return { imageUrl: "", body: content };
}

// ── UI helpers ────────────────────────────────────────────────────────────────

// Deterministic image from post id (no external category needed)
const UNSPLASH_TOPICS = [
  "technology", "travel", "nature", "architecture",
  "business", "food", "lifestyle", "photography",
];

export function postImage(postId: string): string {
  const idx = postId.charCodeAt(0) % UNSPLASH_TOPICS.length;
  const topic = UNSPLASH_TOPICS[idx];
  return `https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60&topic=${topic}&seed=${postId}`;
}

export function authorAvatar(authorId: string): string {
  const num = (authorId.charCodeAt(0) % 70) + 1;
  return `https://i.pravatar.cc/40?img=${num}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function readTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}
