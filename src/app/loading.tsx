export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div
        className="w-14 h-14 rounded-xl animate-pulse"
        style={{
          background: "linear-gradient(145deg,#0e9fe0,#063d78)",
          boxShadow: "0 0 30px rgba(22,185,223,.3)",
        }}
      />
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-brand-blue animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-[#63748a] text-sm">Loading...</p>
    </div>
  );
}
