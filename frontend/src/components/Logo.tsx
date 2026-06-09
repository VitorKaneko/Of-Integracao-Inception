interface LogoProps {
  size?: number;
  showLabel?: boolean;
}

export function Logo({ size = 40, showLabel = true }: LogoProps) {
  return (
    <div className="logo" style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <img
        src="/inception-logo.png"
        alt="Inception 3D"
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
      {showLabel && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.18em" }}>
            INCEPTION
          </span>
          <span
            style={{
              fontSize: 11,
              color: "var(--brand)",
              letterSpacing: "0.12em",
              marginTop: 4,
            }}
          >
            ◇ 3D
          </span>
        </div>
      )}
    </div>
  );
}
