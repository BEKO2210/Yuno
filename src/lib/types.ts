export type AssetKind = "wallpaper" | "ringtone" | "notification";

/** A single downloadable asset (a wallpaper image or an audio file). */
export type Asset = {
  id: string;
  created_at: string;
  kind: AssetKind;
  title: string;
  /** public storage path inside the relevant bucket */
  file_path: string;
  /** optional preview image (for audio: a cover/visual) */
  preview_path: string | null;
  tags: string[];
  download_count: number;
  /** width/height for wallpapers, duration (s) for audio — optional */
  width: number | null;
  height: number | null;
  duration: number | null;
};
