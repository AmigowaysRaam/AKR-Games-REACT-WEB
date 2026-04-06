import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RulesScreen() {
  const navigate = useNavigate();

  const inviteData = [
    { people: "1 People", deposit: "₹200", bonus: "₹50" },
    { people: "5 People", deposit: "₹200", bonus: "₹300" },
    { people: "10 People", deposit: "₹200", bonus: "₹1,000" },
    { people: "30 People", deposit: "₹200", bonus: "₹3,000" },
    { people: "100 People", deposit: "₹200", bonus: "₹7,500" },
    { people: "200 People", deposit: "₹200", bonus: "₹22,000" },
    { people: "500 People", deposit: "₹200", bonus: "₹55,000" },
    { people: "1000 People", deposit: "₹200", bonus: "₹1,11,000" },
    { people: "5000 People", deposit: "₹200", bonus: "₹5,55,000" },
    { people: "10000 People", deposit: "₹200", bonus: "₹12,10,000" },
    { people: "20000 People", deposit: "₹200", bonus: "₹25,00,000" },
  ];

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <ChevronLeft size={22} onClick={() => navigate(-1)} />
        <span style={styles.headerTitle}>Invitation Rules</span>
      </div>

      {/* INFO */}
      <div style={styles.infoBox}>
        <p>
          Invite friends and recharge to get additional platform rewards!
        </p>
        <p style={{ marginTop: 6 }}>
          Rewards will be credited to your wallet within 10 minutes after claim.
        </p>
      </div>

      {/* TABLE */}
      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <span>Invite Account</span>
          <span>Deposit Account</span>
          <span>Bonus</span>
        </div>

        {inviteData.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.row,
              background: index % 2 === 0 ? "#fde1e1" : "#fbd2d2",
            }}
          >
            <span>{item.people}</span>
            <span>{item.deposit}</span>
            <span>{item.bonus}</span>
          </div>
        ))}
      </div>

      {/* 🔥 IMPROVED RULES CARD */}
      <div style={styles.rulesWrapper}>
        <div style={styles.rulesHeader}>Rules</div>

        <div style={styles.rulesContent}>
          {rules.map((rule, index) => (
            <div key={index} style={styles.ruleItem}>
              <span style={styles.bullet} />
              <span style={styles.ruleText}>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const rules = [
  "Only when the number of invited accounts is reached and each account meets the recharge amount can you receive the bonus.",
  "If invitation meets requirements but recharge does not, the bonus cannot be claimed.",
  "Please claim rewards within the event period. Bonuses will be cleared after expiry.",
  "Complete tasks within the event period. Invitation records will be cleared after expiry.",
];

const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    background: "#f6f7fb",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },

  header: {
    display: "flex",
    alignItems: "center",
    padding: 16,
    background: "#fff",
    position: "relative",
    fontWeight: "bold",
  },

  headerTitle: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 14,
  },

  infoBox: {
    background: "#fff",
    margin: 16,
    padding: 12,
    borderRadius: 10,
    fontSize: 13,
    color: "#555",
  },

  table: {
    margin: "0 16px",
    borderRadius: 10,
    overflow: "hidden",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: 11,
    background: "#ff6b6b",
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    fontSize: 12,
    color: "#333",
  },

  /* 🔥 NEW RULES DESIGN */
  rulesWrapper: {
    margin: 16,
    borderRadius: 16,
    border: "2px solid #8e2de2",
    background: "#fff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },

  rulesHeader: {
    margin: 10,
    borderRadius: 10,
    padding: "10px 0",
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    background: "linear-gradient(90deg, #7b1fa2, #d946ef)",
  },

  rulesContent: {
    padding: "10px 14px 16px",
  },

  ruleItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },

  bullet: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#a855f7",
    marginTop: 6,
    flexShrink: 0,
  },

  ruleText: {
    fontSize: 12,
    color: "#555",
    lineHeight: 1.5,
  },
};