import { useId, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import { api, getErrorMessage } from "../lib/api";
import { isImageUrl } from "../lib/image";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUpload({
  label,
  value,
  type,
  onChange,
}: {
  label: string;
  value: string;
  type: "dish" | "logo";
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const urlId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the user pick the same file again
    if (!file) return;

    if (!ALLOWED.includes(file.type)) {
      setError("Choose a JPG, PNG or WebP image");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("The image must be smaller than 5 MB");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("image", file);
      const { data } = await api.post<{ url: string }>(
        `/api/uploads/image?type=${type}`,
        body
      );
      onChange(data.url);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  const invalidLink = value.trim() !== "" && !isImageUrl(value);

  return (
    <div className="space-y-2">
      <span className="text-sm text-slate-700">{label}</span>

      <div className="flex items-center gap-3">
        <div className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center text-slate-400">
          {isImageUrl(value) ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6" />
          )}
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-slate-300 bg-white text-sm px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor={urlId} className="text-xs text-slate-500">
          or paste an image link
        </label>
        <input
          id={urlId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {invalidLink && (
        <p className="text-sm text-amber-600">
          The link must start with http:// or https://
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}