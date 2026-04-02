"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getToken, getUser } from "@/lib/auth";

export default function DeletePostButton({ postId, authorId }: { postId: string; authorId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = getUser();
  if (!user || user.id !== authorId) return null;

  async function handleDelete() {
    setLoading(true);
    try {
      const token = getToken();
      await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/");
      router.refresh();
    } catch {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Delete this post?</span>
        <Button size="sm" variant="destructive" onClick={handleDelete} disabled={loading} className="rounded-xl">
          {loading ? "Deleting…" : "Yes, delete"}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setConfirming(false)} className="rounded-xl">
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => setConfirming(true)}
      className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl gap-1.5"
    >
      <Trash2 className="h-4 w-4" />
      Delete
    </Button>
  );
}
