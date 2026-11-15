import { ArrowLeft, ArrowRight } from "lucide-react";

export default function StepButtons({
  isFirst,
  isLast,
  loading,
  onBack,
}: {
  isFirst: boolean;
  isLast: boolean;
  loading: boolean;
  onBack: () => void;
}) {
  return (
    <div className="flex gap-3 pt-2">
      {!isFirst && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )}
      <button
        type="submit"
        disabled={loading}
        className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2.5 disabled:opacity-60"
      >
        {isLast ? (
          loading ? "Sending…" : "Submit application"
        ) : (
          <>
            Continue
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </div>
  );
}