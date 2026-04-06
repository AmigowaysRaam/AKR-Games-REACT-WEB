import { ChevronLeft, Sun, Moon } from "lucide-react";
import { useNavigate, useNavigationType } from "react-router-dom";
import { useState, useEffect } from "react";

export default function CustomerSupport() {
  const navigate = useNavigate();

  const [dark, setDark] = useState(true);

  // Optional: persist theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDark(saved === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const chats = [
    {
      id: 1,
      name: "Dice Game Predictions",
      message: "Predictive Event...",
      time: "15:22",
      unread: "99+",
      verified: true,
      avatar:
        "https://chatzol.scriptzol.in/assets/images/test1.png",
    },
    {
      id: 2,
      name: "Customer Service",
      message: "[language card]",
      time: "10:47",
      unread: 2,
      avatar:
        "https://cdn-icons-png.flaticon.com/512/4712/4712027.png",
    },
    {
      id: 3,
      name: "Live Color Prediction",
      message: "Predictive Event...",
      time: "15:16",
      unread: "99+",
      verified: true,
      avatar:
        "https://chatzol.scriptzol.in/assets/images/test2.png",
    },
    {
      id: 4,
      name: "Singam Official Channel",
      message: "Photo",
      time: "14:29",
      unread: 75,
      verified: true,
      avatar:
        "https://chatzol.scriptzol.in/assets/images/test3.png",
    },
    {
      id: 5,
      name: "Sapna",
      message: "Hi sir this is Sapna from Singam Lottery!!!",
      time: "2026/3/12 11:57",
      avatar:
        "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  const theme = dark ? darkStyles : lightStyles;
  return (
    <div style={{ ...styles.container, ...theme.container }}>
      {/* HEADER */}
      <div style={{ ...styles.header, ...theme.header }}>
        <ChevronLeft
          size={24}
          color={theme.iconColor}
          onClick={() => navigate(-1)}
        />

        <span style={{ ...styles.headerTitle, color: theme.text }}>
          Chats
        </span>

        {/* THEME TOGGLE */}
        <div
          onClick={() => setDark(!dark)}
          style={styles.themeBtn}
        >
          {dark ? (
            <Sun size={18} color="#fff" />
          ) : (
            <Moon size={18} color="#000" />
          )}
        </div>
      </div>

      {/* CHAT LIST */}
      <div>
        {chats.map((chat) => (
          <div
          onClick={()=>navigate('/ChatDetailScreen')}
            key={chat.id}
            style={{
              ...styles.chatItem,
              borderBottom: `1px solid ${theme.border}`,
            }}
          >
            {/* Avatar */}
            <img src={chat.avatar} style={styles.avatar} />

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div style={styles.rowBetween}>
                <div style={{ display: "flex", gap: 6 }}>
                  <span
                    style={{ ...styles.name, color: theme.text }}
                  >
                    {chat.name}
                  </span>

                  {chat.verified && (
                    <span style={styles.verify}>✔</span>
                  )}
                </div>

                <span style={{ ...styles.time }}>
                  {chat.time}
                </span>
              </div>

              <div style={styles.rowBetween}>
                <span
                  style={{
                    ...styles.message,
                    color: theme.subText,
                  }}
                >
                  {chat.message}
                </span>

                {chat.unread && (
                  <div style={styles.badge}>
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* BASE STYLES */
const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    transition: "0.3s",
  },

  header: {
    display: "flex",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },

  themeBtn: {
    cursor: "pointer",
  },

  chatItem: {
    display: "flex",
    gap: 12,
    padding: "12px 16px",
    cursor: "pointer",
    transition: "0.2s",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
  },

  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontWeight: "bold",
    fontSize: 14,
  },

  verify: {
    color: "#22c55e",
    fontSize: 12,
  },

  time: {
    fontSize: 12,
    color: "#22c55e",
  },

  message: {
    fontSize: 13,
    marginTop: 4,
  },

  badge: {
    background: "#22c55e",
    color: "#000",
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 20,
    fontWeight: "bold",
  },
};
const darkStyles = {
  container: {
    background: "#06141D",
    color: "#fff",
  },
  header: {
    background: "#06141D",
  },
  text: "#fff",
  subText: "#9ca3af",
  border: "rgba(255,255,255,0.05)",
  iconColor: "#fff",
};
const lightStyles = {
  container: {
    background: "#f6f7fb",
    color: "#000",
  },
  header: {
    background: "#fff",
  },
  text: "#000",
  subText: "#555",
  border: "#eee",
  iconColor: "#000",
};