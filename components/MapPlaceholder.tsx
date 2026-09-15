"use client";

interface MapPlaceholderProps {
  variant?: "booking" | "tracking";
  driverLabel?: string;
  className?: string;
}

export default function MapPlaceholder({
  variant = "booking",
  driverLabel,
  className = "",
}: MapPlaceholderProps) {
  return (
    <div
      className={`relative h-full min-h-[260px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-100 via-indigo-50 to-emerald-50 ${className}`}
    >
      <svg
        viewBox="0 0 400 300"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="400" height="300" fill="#eef2ff" />
        <g stroke="#c7d2fe" strokeWidth="6">
          <path d="M0 60 H400" />
          <path d="M0 150 H400" />
          <path d="M0 230 H400" />
          <path d="M70 0 V300" />
          <path d="M180 0 V300" />
          <path d="M300 0 V300" />
        </g>
        <g stroke="#a5b4fc" strokeWidth="2" opacity="0.6">
          <path d="M0 30 H400" />
          <path d="M0 100 H400" />
          <path d="M0 190 H400" />
          <path d="M0 265 H400" />
          <path d="M35 0 V300" />
          <path d="M125 0 V300" />
          <path d="M240 0 V300" />
          <path d="M350 0 V300" />
        </g>
        <g fill="#ddd6fe" opacity="0.7">
          <rect x="90" y="70" width="40" height="30" rx="4" />
          <rect x="200" y="170" width="55" height="35" rx="4" />
          <rect x="310" y="60" width="35" height="45" rx="4" />
          <rect x="30" y="180" width="30" height="30" rx="4" />
        </g>
        {variant === "booking" ? (
          <>
            <path
              d="M60 220 C120 180, 180 200, 220 140 S320 80, 340 70"
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeDasharray="2 10"
              strokeLinecap="round"
            />
            <circle cx="60" cy="220" r="8" fill="#22c55e" stroke="white" strokeWidth="3" />
            <circle cx="340" cy="70" r="8" fill="#ef4444" stroke="white" strokeWidth="3" />
          </>
        ) : (
          <>
            <path
              d="M50 250 C110 210, 150 230, 190 170 S280 100, 330 60"
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="50" cy="250" r="7" fill="#22c55e" stroke="white" strokeWidth="3" />
            <circle cx="330" cy="60" r="7" fill="#ef4444" stroke="white" strokeWidth="3" />
            <g transform="translate(190,170)">
              <circle r="14" fill="#4f46e5" opacity="0.15">
                <animate
                  attributeName="r"
                  values="14;22;14"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0;0.3"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="9" fill="#4f46e5" stroke="white" strokeWidth="2" />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fontSize="10"
                fill="white"
                fontWeight="bold"
              >
                🚗
              </text>
            </g>
          </>
        )}
      </svg>
      {variant === "tracking" && driverLabel ? (
        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-700 shadow">
          {driverLabel}
        </div>
      ) : null}
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-white/80 px-2 py-1 text-[10px] font-medium text-gray-500">
        Stylized map preview
      </div>
    </div>
  );
}
