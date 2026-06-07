"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  acceptFor,
  bucketFor,
  buildPath,
  KIND_LABELS,
  publicUrl,
} from "@/lib/assets";
import type { Asset, AssetKind } from "@/lib/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KINDS: AssetKind[] = ["wallpaper", "ringtone", "notification"];

/** Read width/height of an image file in the browser. */
function imageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = URL.createObjectURL(file);
  });
}

/** Read duration (seconds) of an audio file in the browser. */
function audioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const a = document.createElement("audio");
    a.preload = "metadata";
    a.onloadedmetadata = () => resolve(Math.round(a.duration));
    a.onerror = () => resolve(0);
    a.src = URL.createObjectURL(file);
  });
}

export function AdminDashboard({ initialAssets }: { initialAssets: Asset[] }) {
  const router = useRouter();
  const supabase = createClient();

  const [kind, setKind] = useState<AssetKind>("wallpaper");
  const [tags, setTags] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    setFiles(Array.from(e.dataTransfer.files));
  }, []);

  async function refresh() {
    const { data } = await supabase
      .from("assets")
      .select("*")
      .order("created_at", { ascending: false });
    setAssets((data as Asset[]) ?? []);
  }

  async function handleUpload() {
    if (!files.length) return;
    setBusy(true);
    setError("");
    const bucket = bucketFor(kind);
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`Uploading ${i + 1}/${files.length}: ${file.name}`);
        const path = buildPath(kind, file.name, crypto.randomUUID().slice(0, 8));

        const { error: upErr } = await supabase.storage
          .from(bucket)
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (upErr) throw upErr;

        let width: number | null = null;
        let height: number | null = null;
        let duration: number | null = null;
        if (kind === "wallpaper") {
          const s = await imageSize(file);
          width = s.width;
          height = s.height;
        } else {
          duration = await audioDuration(file);
        }

        const title = file.name.replace(/\.[^.]+$/, "");
        const { error: insErr } = await supabase.from("assets").insert({
          kind,
          title,
          file_path: path,
          tags: tagList,
          width,
          height,
          duration,
        });
        if (insErr) throw insErr;
      }

      setFiles([]);
      setTags("");
      setProgress("");
      await refresh();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      setProgress("");
    }
  }

  async function handleDelete(asset: Asset) {
    if (!confirm(`Delete "${asset.title}"?`)) return;
    setError("");
    try {
      await supabase.storage.from(bucketFor(asset.kind)).remove([asset.file_path]);
      const { error: delErr } = await supabase.from("assets").delete().eq("id", asset.id);
      if (delErr) throw delErr;
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-12">
      {/* Upload */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Upload</h2>
          <form action="/auth/signout" method="post">
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground">
              Sign out
            </button>
          </form>
        </div>

        {/* kind selector */}
        <div className="mt-5 flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <button
              key={k}
              onClick={() => {
                setKind(k);
                setFiles([]);
              }}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                kind === k
                  ? "bg-foreground text-background"
                  : "border border-border text-muted hover:text-foreground"
              }`}
            >
              {KIND_LABELS[k]}
            </button>
          ))}
        </div>

        {/* dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`mt-5 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
            dragging ? "border-accent bg-accent/5" : "border-border hover:border-muted"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={acceptFor(kind)}
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          />
          {files.length ? (
            <div className="text-sm">
              <p className="font-medium">{files.length} file(s) selected</p>
              <p className="mt-1 max-w-md truncate text-muted">
                {files.map((f) => f.name).join(", ")}
              </p>
            </div>
          ) : (
            <div className="text-sm text-muted">
              <p className="font-medium text-foreground">
                Drag & drop {KIND_LABELS[kind].toLowerCase()} files here
              </p>
              <p className="mt-1">or click to choose ({acceptFor(kind)})</p>
            </div>
          )}
        </div>

        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated) — e.g. dark, minimal, nature"
          className="mt-4 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent"
        />

        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={handleUpload}
            disabled={busy || !files.length}
            className="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {busy ? "Uploading…" : `Upload ${files.length || ""}`}
          </button>
          {progress && <span className="text-sm text-muted">{progress}</span>}
        </div>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      {/* Library */}
      <div>
        <h2 className="mb-5 text-lg font-semibold">
          Library <span className="text-muted">({assets.length})</span>
        </h2>
        {assets.length === 0 ? (
          <p className="text-sm text-muted">Nothing uploaded yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((a) => {
              const url = publicUrl(SUPABASE_URL, bucketFor(a.kind), a.file_path);
              return (
                <div key={a.id} className="overflow-hidden rounded-xl border border-border bg-surface">
                  {a.kind === "wallpaper" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={a.title} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-surface-2 p-4">
                      <audio controls src={url} className="w-full" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted">{KIND_LABELS[a.kind]}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(a)}
                      className="shrink-0 rounded-md border border-border px-2 py-1 text-xs text-muted hover:border-red-400 hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
