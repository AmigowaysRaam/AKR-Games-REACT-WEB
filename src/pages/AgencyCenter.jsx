import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function AgencyCenter() {
  const navigate = useNavigate();

  const stats = [
    { label: "Today Invite", value: 0 },
    { label: "Yesterday", value: 0 },
    { label: "Total Invite", value: 0 },
  ];

  const commissions = [
    { name: "User 1", amount: "₹85,077.24" },
    { name: "User 2", amount: "₹64,125.87" },
    { name: "User 3", amount: "₹49,913.12" },
    { name: "User 4", amount: "₹39,654.52" },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ChevronLeft />
        </button>
        Agency Center
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <img
          src="https://i.pravatar.cc/100"
          alt=""
          style={styles.avatar}
        />
        <div>
          <div style={{ fontWeight: 600 }}>Child</div>
          <div style={{ fontSize: 12, color: "#888" }}>
            UID: 483590051
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        {stats.map((item, i) => (
          <div key={i} style={styles.statBox}>
            <div style={styles.statValue}>{item.value}</div>
            <div style={styles.statLabel}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Wallet Section */}
      <div style={styles.wallet}>
        <div>
          <div style={{ fontSize: 12, color: "#666" }}>
            Daily Income (₹)
          </div>
          <div style={styles.money}>₹0.00</div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#666" }}>
            Total Income (₹)
          </div>
          <div style={styles.money}>₹0.00</div>
        </div>
      </div>

      {/* Invitation Card */}
      <div style={styles.inviteCard}>
        <div>
          <div style={{ fontWeight: 600 }}>Invitation Code</div>
          <div style={{ fontSize: 18, letterSpacing: 2 }}>
            184YZVM
          </div>
        </div>
        <button style={styles.copyBtn}>Copy</button>
      </div>

      <button style={styles.inviteBtn}>INVITATION LINK</button>

      {/* Menu List */}
      <div style={styles.menu}>
        <div style={styles.row}>Team report</div>
        <div style={styles.row}>Commission detail</div>
        <div style={styles.row}>Invitation rules</div>
        <div style={styles.row}>Agent data customer service</div>
      </div>

      {/* Commission List */}
      <div style={styles.commissionSection}>
        <div style={styles.sectionTitle}>Commission Ranking</div>
        {commissions.map((item, i) => (
          <div key={i} style={styles.row}>
            <span>{item.name}</span>
            <span>{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    background: "#f5f5f5",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },
  header: {
    background: "#fff",
    padding: "12px",
    textAlign: "center",
    fontWeight: 700,
    position: "relative",
    borderBottom: "1px solid #eee",
  },
  backBtn: {
    position: "absolute",
    left: 10,
    top: 8,
    border: "none",
    background: "none",
    cursor: "pointer",
  },
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 15,
    background: "#fff",
    marginTop: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: "50%",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "space-around",
    background: "#fff",
    marginTop: 10,
    padding: 10,
  },
  statBox: {
    textAlign: "center",
  },
  statValue: {
    fontWeight: 700,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  wallet: {
    display: "flex",
    justifyContent: "space-around",
    background: "#fff",
    marginTop: 10,
    padding: 15,
  },
  money: {
    fontWeight: 700,
    marginTop: 5,
  },
  inviteCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#ffeaa7",
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  copyBtn: {
    background: "#ff7675",
    border: "none",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
  inviteBtn: {
    width: "90%",
    margin: "0 auto",
    display: "block",
    padding: 12,
    borderRadius: 20,
    border: "none",
    background: "linear-gradient(90deg,#a29bfe,#6c5ce7)",
    color: "#fff",
    fontWeight: 600,
  },
  menu: {
    background: "#fff",
    marginTop: 15,
  },
  row: {
    padding: 15,
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
  },
  commissionSection: {
    background: "#fff",
    marginTop: 15,
  },
  sectionTitle: {
    padding: 15,
    fontWeight: 600,
  },
};