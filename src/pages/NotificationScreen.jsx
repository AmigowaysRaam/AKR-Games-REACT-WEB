import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("announcements");
  const announcements = [];
  const systemMessages = [
    {
      id: 1,
      title: "Welcome!",
      desc: "Your account has been successfully created.",
      date: "2026-03-27",
    },
    {
      id: 2,
      title: "Update",
      desc: "New features have been added.",
      date: "2026-03-26",
    },
  ];

  const data =
    activeTab === "announcements" ? announcements : systemMessages;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <ChevronLeft
          size={22}
          onClick={() => navigate(-1)}
          style={{ zIndex: 1 }}
        />
        <span style={styles.headerTitle}>Notification</span>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        <div
          style={{
            ...styles.tab,
            borderBottom:
              activeTab === "announcements"
                ? "2px solid purple"
                : "none",
            color:
              activeTab === "announcements" ? "#000" : "#777",
          }}
          onClick={() => setActiveTab("announcements")}
        >
          Announcements
        </div>

        <div
          style={{
            ...styles.tab,
            borderBottom:
              activeTab === "system"
                ? "2px solid purple"
                : "none",
            color: activeTab === "system" ? "#000" : "#777",
          }}
          onClick={() => setActiveTab("system")}
        >
          System Messages
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ paddingTop: 40 }}>
        {data.length === 0 ? (
          <div style={styles.emptyContainer}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
              alt="no data"
              style={styles.emptyImage}
            />
            <p style={styles.emptyText}>No Data</p>
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.rowBetween}>
                <span style={{ fontWeight: "bold" }}>
                  {item.title}
                </span>
                <span style={{ fontSize: 12, color: "#999" }}>
                  {item.date}
                </span>
              </div>
              <p style={{ marginTop: 8, color: "#555" }}>
                {item.desc}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    background: "#f6f7fb",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },

  header: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    padding: 16,
    background: "#fff",
    fontWeight: "bold",
  },

  headerTitle: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 16,
  },

  tabs: {
    display: "flex",
    background: "#fff",
    borderBottom: "1px solid #eee",
  },

  tab: {
    flex: 1,
    textAlign: "center",
    padding: 12,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
  },

  emptyContainer: {
    textAlign: "center",
    marginTop: 80,
    color: "#888",
  },
  emptyImage: {
    width: 100,
    opacity: 0.7,
    position: "absolute",
    left: "40%",
    bottom: "65%"
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
  },
  card: {
    background: "#fff",
    margin: "10px 16px",
    padding: 16,
    borderRadius: 12,
  },

  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};