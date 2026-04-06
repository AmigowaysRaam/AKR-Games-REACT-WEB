import { ChevronLeft, MoreVertical, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChatDetailScreen() {
  const navigate = useNavigate();

  const messages = [
    {
      id: 1,
      title: "Dice 1 minute",
      code: "20260327010907",
      time: "03:05pm",
      people: 22,
    },
    {
      id: 2,
      title: "Dice 1 minute",
      code: "20260327010908",
      time: "03:06pm",
      people: 86,
    },
    {
      id: 3,
      title: "Dice 1 minute",
      code: "20260327010909",
      time: "03:07pm",
      people: 15,
    },
  ];

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <ChevronLeft color="#fff" onClick={() => navigate(-1)} />

        <div style={styles.headerInfo}>
          <img
            src="https://chatzol.scriptzol.in/assets/images/test1.png"
            style={styles.headerAvatar}
          />
          <div>
            <div style={styles.headerTitle}>
              Dice Game Predictions ✔
            </div>
            <div style={styles.subTitle}>
              395,222 subscribers
            </div>
          </div>
        </div>

        <div style={styles.headerIcons}>
          <Info size={18} color="#fff" />
          <MoreVertical size={18} color="#fff" />
        </div>
      </div>

      {/* BODY */}
      <div style={styles.body}>
        <div style={styles.date}>03/27/2026</div>

        {messages.map((msg) => (
          <div key={msg.id} style={styles.card}>
            {/* TOP */}
            <div style={styles.cardTop}>
              <div>
                <div style={styles.cardTitle}>
                  {msg.title}
                </div>
                <div style={styles.cardCode}>
                  {msg.code}
                </div>
              </div>

              <div style={styles.drawTime}>
                Draw time
                <br />
                27-03-26 03:06:00
              </div>
            </div>

            {/* CONTENT */}
            <div style={styles.cardContent}>
              <div>forecast accuracy: 80%</div>
              <div>forecast results: 🎲 🎲 🎲</div>
            </div>

            {/* FOOTER */}
            <div style={styles.cardFooter}>
              <div>{msg.people} people</div>
              <button style={styles.button}>
                Prize drawn
              </button>
            </div>

            {/* SEEN */}
            <div style={styles.seen}>
              ✔✔ 348,876 Seen
              <span style={{ float: "right" }}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div style={styles.muted}>
        All members are muted
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0b1f2a",
    color: "#fff",
  },

  header: {
    display: "flex",
    alignItems: "center",
    padding: 12,
    gap: 10,
    background: "#0b1f2a",
  },

  headerInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },

  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
  },

  headerTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },

  subTitle: {
    fontSize: 11,
    color: "#9ca3af",
  },

  headerIcons: {
    display: "flex",
    gap: 10,
  },

  body: {
    flex: 1,
    padding: 10,
    overflowY: "auto",
    backgroundImage:
      "url('https://www.transparenttextures.com/patterns/cubes.png')",
  },

  date: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 12,
    opacity: 0.7,
  },

  card: {
    background: "#1f3b4d",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  cardTitle: {
    fontWeight: "bold",
  },

  cardCode: {
    fontSize: 12,
    opacity: 0.7,
  },

  drawTime: {
    fontSize: 11,
    textAlign: "right",
    opacity: 0.7,
  },

  cardContent: {
    fontSize: 13,
    marginBottom: 10,
  },

  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  button: {
    background: "#3b82f6",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    color: "#fff",
    cursor: "pointer",
  },

  seen: {
    marginTop: 8,
    fontSize: 11,
    opacity: 0.7,
  },

  muted: {
    padding: 10,
    textAlign: "center",
    background: "#1a2e3a",
    fontSize: 12,
  },
};