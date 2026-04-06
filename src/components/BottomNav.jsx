import React from "react";
import { Home, Clock, Gift, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function BottomNav({ active, onChange }) {
  const navigate = useNavigate();

  const handleClick = (key, path) => {
    onChange(key);
    navigate(path);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100%",
      maxWidth: 430,
      zIndex: 100,
      // padding:'1%'
      height:"9%"
    }}>

      {/* GLASS NAV BAR */}
      <div style={{
        position: "relative",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: "14px 0 14px 0",
      }}>

        <div style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-end",
        }}>
          <NavItem
            icon={Home}
            label="Home"
            active={active === "home"}
            onClick={() => handleClick("home", "/")}
          />

          <NavItem
            icon={Clock}
            label="Earn"
            active={active === "earn"}
            onClick={() => handleClick("earn", "/earn")}
          />

          {/* SPACE FOR CENTER */}
          <div style={{ width: 60 }} />

          <NavItem
            icon={Gift}
            label="Promo"
            active={active === "promo"}
            onClick={() => handleClick("promo", "/promo")}
          />

          <NavItem
            icon={User}
            label="Profile"
            active={active === "profile"}
            onClick={() => handleClick("profile", "/profile")}
          />
        </div>

        {/* CENTER BUTTON */}
        <div style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: -32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          {/*  */}
          <button
            onClick={() => handleClick("center", "/earn")}
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              border: "4px solid white",
              background: "linear-gradient(135deg,#ff4d4f,#ffcc00)",
              color: "white",
              fontWeight: 800,
              fontSize: 14,
              boxShadow: "0 6px 20px rgba(255,77,79,0.5)",
              cursor: "pointer",
              transition: "all 0.2s",
              animation: "bounce 2s infinite",
            }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.9)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >
            ₹200
          </button>

          <span style={{
            fontSize: 11,
            marginTop: 4,
            color: "#666",
            fontWeight: 600,
          }}>
            Get ₹200
          </span>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: 11,
        cursor: "pointer",
        transform: active ? "scale(1.1)" : "scale(1)",
        transition: "all 0.2s",
      }}
    >
      <div style={{
        padding: 6,
        borderRadius: 12,
        background: active
          ? "linear-gradient(135deg,#7c3aed,#9d5cf5)"
          : "transparent",
        boxShadow: active
          ? "0 4px 12px rgba(124,58,237,0.4)"
          : "none",
        transition: "all 0.2s",
      }}>
        <Icon
          size={20}
          strokeWidth={2.5}
          color={active ? "#fff" : "#999"}
        />
      </div>
      <span style={{
        marginTop: 4,
        fontWeight: 600,
        color: active ? "#7c3aed" : "#999",
        transition: "all 0.2s",
      }}>
        {label}
      </span>
    </button>
  );
}