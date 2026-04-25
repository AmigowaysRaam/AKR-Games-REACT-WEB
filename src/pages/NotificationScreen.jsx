import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotificationList } from "../services/authService";

export default function NotificationScreen() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("system");
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchNotifications(parsedUser.id);
    }
  }, [activeTab]);

  const fetchNotifications = async (userId) => {
    try {
      const res = await getNotificationList({
        id: userId,
        tab: activeTab,
      });
      if (res?.success) {
        setNotifications(res.data || []);
      }
    } catch (err) {
      console.log("API Error:", err);
    }
  };

  const filteredData = notifications.filter((item) => {
    return activeTab === "announcement"
      ? item.type === "announcement"
      : item.type === "system";
  });

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <ChevronLeft
          size={22}
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        <span style={styles.headerTitle}>Notification</span>
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        <div
          style={{
            ...styles.tab,
            borderBottom:
              activeTab === "announcement"
                ? "2px solid purple"
                : "none",
            color: activeTab === "announcement" ? "#000" : "#777",
          }}
          onClick={() => setActiveTab("announcement")}
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
      <div style={styles.content}>
        {filteredData.length === 0 ? (
          <div style={styles.emptyContainer}>
            <p style={styles.emptyText}>No Data</p>
          </div>
        ) : (
          filteredData?.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.rowBetween}>
                <span style={{ fontWeight: "bold" }}>
                  {item.title}
                </span>
                <span style={{ fontSize: 12, color: "#999" }}>
                  {item.time}
                </span>
              </div>

              <p style={{ marginTop: 8, color: "#555" }}>
                {item.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const HEADER_HEIGHT = 60;
const TAB_HEIGHT = 48;

const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    background: "#f6f7fb",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },

  header: {
    position: "fixed",
    top: 0,
    width: "100%",
    maxWidth: 430,
    height: HEADER_HEIGHT,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    background: "#fff",
    fontWeight: "bold",
    zIndex: 1000,
    borderBottom: "1px solid #eee",
  },

  headerTitle: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 16,
  },

  tabs: {
    position: "fixed",
    top: HEADER_HEIGHT,
    width: "100%",
    maxWidth: 430,
    display: "flex",
    background: "#fff",
    borderBottom: "1px solid #eee",
    zIndex: 999,
  },

  tab: {
    flex: 1,
    textAlign: "center",
    padding: 12,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
  },

  content: {
    paddingTop: HEADER_HEIGHT + TAB_HEIGHT + 10,
  },

  emptyContainer: {
    textAlign: "center",
    marginTop: 80,
    color: "#888",
  },

  emptyImage: {
    width: "20%",
    opacity: 0.7,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
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