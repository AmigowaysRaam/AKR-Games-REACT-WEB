import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyCommission() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <ChevronLeft size={22} onClick={() => navigate(-1)} />
        <span>Commission Detail</span>
      </div>

      {/* SEARCH */}
      <input placeholder="Search Phone number" style={styles.search} />

      {/* CARD */}
      <div style={styles.card}>
        <div style={styles.rowBetween}>
          <div>
            <div style={styles.label}>Total Commission</div>
            <div style={styles.amount}>₹0.00</div>
          </div>

          <button
            style={styles.rebateBtn}
            onClick={() => setShowModal(true)}
          >
            Rebate ▶
          </button>
        </div>

        {/* TIERS */}
        <div style={styles.tiers}>
          {["Tier 1", "Tier 2", "Tier 3", "Tier 4"].map((t, i) => (
            <div key={i} style={{ ...styles.tier, background: tierColors[i] }}>
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            
            {/* HEADER */}
            <div style={styles.modalHeader}>
              <span style={{ fontWeight: "bold" }}>Commission Rate</span>
              <span style={styles.close} onClick={() => setShowModal(false)}>
                ✕
              </span>
            </div>

            {/* TABLE */}
            <div style={styles.table}>
              <div style={styles.tableHead}>
                <span>Type</span>
                <span>T1</span>
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
              </div>

              {dummyRates.map((item, i) => (
                <div key={i} style={styles.tableRow}>
                  <span>{item.name}</span>
                  <span>{item.t1}</span>
                  <span>{item.t2}</span>
                  <span>{item.t3}</span>
                  <span>{item.t4}</span>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div style={styles.footer}>
              Invite More Friends To Upgrade To Lv2 Earn Higher Commissions.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* DATA */
const dummyRates = [
  { name: "Recharge", t1: "0.00%", t2: "0.00%", t3: "0.00%", t4: "0.00%" },
  { name: "Kerala", t1: "10%", t2: "1%", t3: "0.1%", t4: "0.01%" },
  { name: "Satta", t1: "4%", t2: "1%", t3: "0.5%", t4: "0.25%" },
  { name: "3Digit", t1: "3%", t2: "0.75%", t3: "0.5%", t4: "0.25%" },
  { name: "Quick 3D", t1: "0.8%", t2: "0.3%", t3: "0.12%", t4: "0.05%" },
  { name: "Color", t1: "0.8%", t2: "0.3%", t3: "0.12%", t4: "0.05%" },
  { name: "Dice", t1: "0.8%", t2: "0.3%", t3: "0.12%", t4: "0.05%" },
  { name: "Scratch", t1: "0.2%", t2: "0.21%", t3: "0.08%", t4: "0.01%" },
  { name: "Casino", t1: "0.45%", t2: "0.25%", t3: "0.09%", t4: "0.04%" },
];

const tierColors = ["#fca5a5", "#93c5fd", "#fde68a", "#a5b4fc"];

/* STYLES */
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
    gap: 10,
    padding: 16,
    background: "#fff",
    fontWeight: "bold",
  },

  search: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ddd",
    width: "calc(100% - 32px)",
  },

  card: {
    background: "#fff",
    margin: "0 16px",
    padding: 16,
    borderRadius: 12,
  },

  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: { color: "#777" },

  amount: {
    fontSize: 22,
    fontWeight: "bold",
  },

  rebateBtn: {
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: 20,
    cursor: "pointer",
  },

  tiers: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 16,
  },

  tier: {
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 12,
  },

  /* MODAL */
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modal: {
    width: "90%",
    maxWidth: 380,
    maxHeight: "80vh",
    overflowY: "auto",
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    animation: "scaleIn 0.25s ease",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  close: {
    cursor: "pointer",
    fontSize: 18,
  },

  table: {
    fontSize: 13,
  },

  tableHead: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
    fontWeight: "bold",
    background: "#f1f1f1",
    padding: 8,
    borderRadius: 6,
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
    padding: 8,
    borderBottom: "1px solid #eee",
  },
  footer: {
    marginTop: 12,
    background: "linear-gradient(90deg,#7c3aed,#9333ea)",
    color: "#fff",
    textAlign: "center",
    padding: 10,
    borderRadius: 20,
    fontSize: 12,
  },
};
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
`, styleSheet.cssRules.length);