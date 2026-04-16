import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRulesDataINvite } from "../services/authService";
import GameLoader from "./LoaderComponet";

export default function RulesScreen() {
  const navigate = useNavigate();

  const [data, seApitData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRulesData();
  }, []);

  const fetchRulesData = async () => {
    try {
      setLoading(true);
      const res = await getRulesDataINvite({
        userId: JSON.parse(localStorage.getItem("user"))?.id,
      });

      if (res?.success) {
        seApitData(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <GameLoader />;
  }

  return (
    <div style={styles.container}>
      {/* ✅ FIXED HEADER */}
      <div style={styles.header}>
        <ChevronLeft size={22} onClick={() => navigate(-1)} />
        <span style={styles.headerTitle}>{data?.info?.title}</span>
      </div>

      {/* ✅ SCROLLABLE CONTENT */}
      <div style={styles.content}>
        {/* INFO */}
        <div style={styles.infoBox}>
          <p style={{ marginTop: 6 }}>{data?.info?.description}</p>
        </div>

        {/* TABLE */}
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>Invite Account</span>
            <span>Deposit Account</span>
            <span>Bonus</span>
          </div>

          {data?.inviteTable?.map((item, index) => (
            <div
              key={index}
              style={{
                ...styles.row,
                background: index % 2 === 0 ? "#fde1e1" : "#fbd2d2",
              }}
            >
              <span>{item?.people}</span>
              <span>{item?.deposit}</span>
              <span>{item?.bonus}</span>
            </div>
          ))}
        </div>

        {/* RULES */}
        <div style={styles.rulesWrapper}>
          <div style={styles.rulesHeader}>Rules</div>
          <div style={styles.rulesContent}>
            {data?.rules?.map((rule, index) => (
              <div key={index} style={styles.ruleItem}>
                <span style={styles.bullet} />
                <span style={styles.ruleText}>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const HEADER_HEIGHT = 60;

const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    background: "#f6f7fb",
    minHeight: "100vh",
    fontFamily: "sans-serif",
  },

  // ✅ FIXED HEADER
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    maxWidth: 430,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    padding: 16,
    height: HEADER_HEIGHT,
    background: "#fff",
    fontWeight: "bold",
    zIndex: 1000,
    borderBottom: "1px solid #eee",
  },

  headerTitle: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: 14,
  },

  // ✅ CONTENT OFFSET (IMPORTANT)
  content: {
    paddingTop: HEADER_HEIGHT + 10,
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