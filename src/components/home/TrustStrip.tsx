export function TrustStrip() {
  const items = [
    { icon: "✦", text: "Excellence" },
    { icon: "✧", text: "Innovation" },
    { icon: "◇", text: "Integrity" },
    { icon: "⌁", text: "Knowledge Sharing" },
    { icon: "↗", text: "Continuous growth" },
  ];

  return (
    <div className="bg-white border-b border-[#dde8f5]">
      <div className="wrap grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3 py-4 sm:py-5">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 font-medium text-[0.94rem] text-[#2f4466] ${index === items.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <span className="flex-none w-[38px] h-[38px] grid place-items-center rounded-[10px] bg-[#e8f4fd] text-[#0a58a8] text-[1.05rem]">
              {item.icon}
            </span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
