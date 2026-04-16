import { LoaderPinwheel } from "lucide-react";

export default function GameLoader({ text = "Processing..." }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(circle at center, rgba(0,0,0,0.6), #ccc)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        overflow: "hidden",
      }}
    >
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#a855f7",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.6,
            animation: `float ${3 + i * 0.3}s linear infinite`,
          }}
        />
      ))}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          zIndex: 2,
        }}
      >
        {/* Outer glow pulse */}
        <div
          style={{
            position: "absolute",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(124,58,237,0.2)",
            filter: "blur(20px)",
            animation: "pulseGlow 2s ease-in-out infinite",
          }}
        />

        {/* Rotating ring */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background:
              "conic-gradient(#7c3aed, #a855f7, #c084fc, #7c3aed)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "spin 1.2s linear infinite",
            boxShadow: "0 0 30px rgba(124,58,237,0.8)",
          }}
        >
          {/* Inner core */}
          <div
            style={{
              width: 65,
              height: 65,
              borderRadius: "50%",
              background: "#0f0f0f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "inset 0 0 10px rgba(255,255,255,0.1)",
            }}
          >
            <LoaderPinwheel
              size={28}
              color="#a855f7"
              style={{
                animation: "iconBounce 1s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Animated dots */}
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#c084fc",
                animation: `bounce 0.6s ${i * 0.2}s infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* Text */}
        <p
          style={{
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: 1,
            textShadow: "0 0 10px rgba(168,85,247,0.8)",
          }}
        >
          {text}
        </p>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes bounce {
            from { transform: translateY(0px); opacity: 0.5; }
            to { transform: translateY(-10px); opacity: 1; }
          }

          @keyframes pulseGlow {
            0%,100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.4); opacity: 1; }
          }

          @keyframes iconBounce {
            0%,100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }

          @keyframes float {
            0% {
              transform: translateY(0px);
              opacity: 0.2;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(-40px);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}