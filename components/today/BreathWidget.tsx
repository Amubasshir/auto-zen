export function BreathWidget() {
  return (
    <div className="p-7 border border-zen-line rounded-[18px] bg-zen-raised flex flex-col gap-5 justify-between">
      <h3 className="m-0 text-[13px] tracking-[0.02em] text-zen-text font-medium">
        Mindful moment
      </h3>

      <div className="flex flex-col items-center gap-4">
        {/* Animated breathing circle */}
        <div
          className="w-[180px] h-[180px] rounded-full border border-jade-line relative grid place-items-center"
          style={{
            boxShadow: "inset 0 0 60px oklch(0.8 0.07 162 / 0.1)",
            animation: "breathe 7s ease-in-out infinite",
          }}
        >
          {/* Inner dashed ring */}
          <span
            className="absolute inset-[18px] rounded-full border border-dashed border-jade-line opacity-50"
            aria-hidden
          />
          <span className="font-serif italic text-[20px] text-zen-text-2 relative z-10">
            Breathe
          </span>
        </div>

        <p className="text-center font-mono text-[11px] text-zen-text-4 tracking-[0.08em] m-0">
          INHALE 4S · HOLD 4S · EXHALE 4S
        </p>
      </div>

      <p className="text-[12.5px] text-zen-text-4 text-center m-0 leading-relaxed">
        A calm mind learns faster. Take 30 seconds before your session.
      </p>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(0.9); }
          50% { transform: scale(1.04); }
        }
      `}</style>
    </div>
  );
}
