import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { getBottomMenu } from "../services/authService";

export function BottomNav({ active, onChange }) {
  const navigate = useNavigate();
  const [navData, setNavData] = useState([]);
  const [centerData, setCenterData] = useState({});
  const [userData, setUserData] = useState(null);

  const getIcon = (name) => {
    if (!name) return Icons.Home;
    return Icons[name] || Icons.Home;
  };

  // ✅ Load user
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    } catch (e) {
      console.log("User parse error:", e);
    }
  }, []);

  // ✅ Load menu
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const cachedMenu = localStorage.getItem("bottomMenu");

        if (cachedMenu) {
          const parsed = JSON.parse(cachedMenu);

          setNavData(
            parsed.nav.map((item) => ({
              ...item,
              icon: getIcon(item.icon),
            }))
          );

          setCenterData(parsed.center);
          return;
        }

        const res = await getBottomMenu({
          user_id:
            JSON.parse(localStorage.getItem("user"))?.id || "",
        });

        if (res?.success) {
          const nav = res.data?.nav || [];
          const center = res.data?.earn_card || {};

          localStorage.setItem(
            "bottomMenu",
            JSON.stringify({ nav, center })
          );

          setNavData(
            nav.map((item) => ({
              ...item,
              icon: getIcon(item.icon),
            }))
          );

          setCenterData(center);
        } else {
          setDefaultCenter();
        }
      } catch (err) {
        console.log(err);
        setDefaultCenter();
      }
    };

    loadMenu();
  }, []);

  const setDefaultCenter = () => {
    setCenterData({
      amount: 200,
      label: "Get ₹200",
      path: "/earn",
      image: "",
    });
  };

  const handleClick = (key, path) => {
    onChange(key);
    navigate(path);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        zIndex: 100,
        height: "9%",
      }}
    >
      <div
        style={{
          position: "relative",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          padding: "14px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-end",
          }}
        >
          {navData.slice(0, 2).map((item) => (
            <NavItem
              key={item.key}
              item={item}
              active={active === item.key}
              onClick={() => handleClick(item.key, item.path)}
            />
          ))}

          <div style={{ width: 60 }} />

          {navData.slice(2).map((item) => (
            <NavItem
              key={item.key}
              item={item}
              active={active === item.key}
              onClick={() => handleClick(item.key, item.path)}
            />
          ))}
        </div>

        {/* 🔥 CENTER BUTTON */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: -32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => handleClick("center", centerData.path)}
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              border: "4px solid white",
              background:
                "linear-gradient(135deg,#ff4d4f,#ffcc00)",
              color: "white",
              fontWeight: 800,
              fontSize: 14,
              boxShadow:
                "0 6px 20px rgba(255,77,79,0.5)",
              cursor: "pointer",
              animation: "pulse 2s infinite",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {centerData.image ? (
              <img
                src={centerData.image}
                alt="center"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              `₹${centerData.amount || 0}`
            )}
          </button>

          <span
            style={{
              fontSize: 11,
              marginTop: 4,
              color: "#666",
              fontWeight: 600,
            }}
          >
            {centerData.label}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        @keyframes pop {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes slideUp {
          0% { transform: translateY(6px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ✅ Nav Item Component
function NavItem({ item, active, onClick }) {
  const IconComponent = item.icon;

  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: 11,
        cursor: "pointer",
        transform: active
          ? "translateY(-6px) scale(1.1)"
          : "translateY(0) scale(1)",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          padding: 6,
          borderRadius: 12,
          background: active
            ? "linear-gradient(135deg,#7c3aed,#9d5cf5)"
            : "transparent",
          boxShadow: active
            ? "0 6px 16px rgba(124,58,237,0.4)"
            : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          transition: "all 0.3s ease",
          animation: active ? "pop 0.3s ease" : "none",
        }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.label}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <IconComponent
            size={20}
            strokeWidth={2.5}
            color={active ? "#fff" : "#999"}
          />
        )}
      </div>
      <span
        style={{
          marginTop: 4,
          fontWeight: 600,
          color: active ? "#7c3aed" : "#999",
          animation: active ? "slideUp 0.3s ease" : "none",
        }}
      >
        {item.label}
      </span>
    </button>
  );
}