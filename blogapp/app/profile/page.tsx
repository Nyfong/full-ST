"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { updateMe } from "@/lib/api";
import { getToken, getUser, updateStoredUser } from "@/lib/auth";
import { Camera, User, Check } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string; avatar: string | null } | null>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.replace("/login"); return; }
    setUser(u);
    setName(u.name);
    setAvatar(u.avatar ?? null);
  }, [router]);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const SIZE = 200;
        const canvas = document.createElement("canvas");
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d")!;
        // crop to square centre
        const min = Math.min(img.width, img.height);
        const sx = (img.width - min) / 2;
        const sy = (img.height - min) / 2;
        ctx.drawImage(img, sx, sy, min, min, 0, 0, SIZE, SIZE);
        setAvatar(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError("Name cannot be empty."); return; }
    setError(""); setSaving(true);
    try {
      const token = getToken();
      if (!token) { router.replace("/login"); return; }
      const updated = await updateMe({ name: name.trim(), avatar: avatar ?? "" }, token);
      updateStoredUser({ name: updated.name, avatar: updated.avatar });
      setUser((u) => u ? { ...u, name: updated.name, avatar: updated.avatar } : u);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-8">Profile</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-slate-100 bg-slate-100 flex items-center justify-center">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-slate-300" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-500 transition-colors shadow"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          {avatar && (
            <button type="button" onClick={() => setAvatar(null)} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
              Remove photo
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border border-slate-100 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl py-2.5 gap-2"
        >
          {saved ? <><Check className="h-4 w-4" /> Saved!</> : saving ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
