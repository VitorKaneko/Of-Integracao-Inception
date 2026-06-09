interface DecoSquareProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  style?: React.CSSProperties;
}

const positionStyle: Record<string, React.CSSProperties> = {
  "top-left": { top: 24, left: 24 },
  "top-right": { top: 24, right: 24 },
  "bottom-left": { bottom: 24, left: 24 },
  "bottom-right": { bottom: 24, right: 24 },
};

export function DecoSquare({ position = "bottom-right", size = 88, style }: DecoSquareProps) {
  return (
    <div
      className="deco-square"
      style={{
        ...positionStyle[position],
        width: size,
        height: size,
        ...style,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="6"
          y="6"
          width="52"
          height="52"
          rx="3"
          transform="rotate(45 32 32)"
          fill="none"
          stroke="#14b8a6"
          strokeWidth="2"
        />
        <rect
          x="14"
          y="14"
          width="36"
          height="36"
          rx="2"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
