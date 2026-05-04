export default function Logo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Paw print */}
      {/* Main pad */}
      <ellipse cx="50" cy="65" rx="18" ry="15" fill="#2563eb" />

      {/* Top left toe */}
      <ellipse cx="28" cy="45" rx="8" ry="12" fill="#2563eb" />

      {/* Top middle toe */}
      <ellipse cx="50" cy="38" rx="8" ry="12" fill="#2563eb" />

      {/* Top right toe */}
      <ellipse cx="72" cy="45" rx="8" ry="12" fill="#2563eb" />

      {/* Pound symbol overlay */}
      <text
        x="50"
        y="70"
        fontSize="32"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        £
      </text>
    </svg>
  );
}
