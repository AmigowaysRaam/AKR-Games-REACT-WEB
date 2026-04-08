import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export default function InviteFriends() {
  const navigate = useNavigate();
  const [data] = useState({
    code: "IB4YZV7M",
    income: 0,
    totalInvited: 0,
    rechargePerPerson: 200,
    bonuses: [
      { id: 1, reward: 50, invites: 1, progress: 0 },
      { id: 2, reward: 300, invites: 5, progress: 0 },
    ],
  });

  const copyCode = () => {
    navigator.clipboard.writeText(data.code);
  };

  return (
    <div style={container}>
      {/* HEADER (Fixed properly) */}
      <div style={header}>
        <span onClick={() => navigate(-1)} style={back}>
          <ChevronLeft />
        </span>
        <span style={title}>Invite Friends</span>
        <button onClick={() => navigate('/RulesScreeen')} style={rulesBtn}>Rules</button>
      </div>

      {/* CONTENT */}
      <div style={content}>

        {/* BANNER */}
        <div style={banner}>
          <div style={overlay} />
          <div style={{
            position: "relative", zIndex: 2, paddingTop: "45%",
          }}>
            <div style={codeWrapper}>
              <div style={codeLeft}>
                <span style={codeText}>{data.code}</span>
              </div>

              <div style={codeRight}>
                <button onClick={copyCode} style={copyBtn}>
                  Copy
                </button>
              </div>
            </div>

            {/* STATS */}
            <div style={statsCard}>
              <div style={statRow}>
                <div style={statItem}>
                  <div style={label}>Cumulative income</div>
                  <div style={value}>₹{data.income}</div>
                </div>

                <div style={dividerVertical}></div>

                <div style={statItem}>
                  <div style={label}>Total Invited</div>
                  <div style={value}>{data.totalInvited}</div>
                </div>
              </div>

              <div style={linksRow}>
                <span>Invitation record</span>
                <span>Reward rules</span>
              </div>
            </div>
          </div>
        </div>

        {/* BONUS LIST */}
        <div style={list}>
          {data.bonuses.map((b) => (
            <div key={b.id} style={card}>

              <div style={cardHeader}>
                <span>Bonus {b.id}</span>
                <span style={{ color: "#7c3aed" }}>₹{b.reward}</span>
              </div>

              <div style={grayRow}>
                <span>Number of invitees</span>
                <span>{b.invites}</span>
              </div>

              <div style={grayRow}>
                <span>Recharge per people</span>
                <span style={{ color: "#7c3aed" }}>
                  ₹{data.rechargePerPerson}
                </span>
              </div>
              <div style={progressRow}>
                <div>
                  <span style={highlight}>{b.progress}</span>/{b.invites}
                  <div style={smallText}>Invitees</div>
                </div>

                <div>
                  <span style={highlight}>{b.progress}</span>/{b.invites}
                  <div style={smallText}>Deposits</div>
                </div>
              </div>

              <button style={btn}>Go Complete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
const container = {
  maxWidth: 430,
  margin: "0 auto",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "#f5f5f5",
  overflow: "hidden",
};
const header = {
  height: 55,
  background: "#7c3aed",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 12px",
  flexShrink: 0,
};
const content = {
  flex: 1,
  overflowY: "auto",
};
const back = { fontSize: 22, cursor: "pointer" };
const title = { fontWeight: "bold" };
const rulesBtn = {
  background: "white",
  border: "none",
  padding: "4px 10px",
  borderRadius: 6,
  color: "#7c3aed",
};

const banner = {
  position: "relative",
  padding: 16,
  backgroundImage:
    "url('https://www.singamlottery.com/static/media/invitation-bg.3645bbb7789ffd4ed47d.webp')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.3)",
};

const inviteText = {
  color: "white",
  fontWeight: "bold",
  marginBottom: 12,

};

const codeWrapper = {
  display: "flex",
  background: "#facc15",
  borderRadius: 8,
  overflow: "hidden",
};

const codeLeft = {
  flex: 1,
  background: "#eee",
  padding: 12,
  textAlign: "center",
};

const codeRight = {
  width: 90,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const codeText = {
  letterSpacing: 4,
  fontWeight: "bold",
};

const copyBtn = {
  background: "#7c3aed",
  color: "white",
  border: "none",
  padding: "6px 14px",
  borderRadius: 20,
};

const statsCard = {
  background: "white",
  marginTop: 12,
  borderRadius: 10,
  padding: 12,
};

const statRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const statItem = {
  flex: 1,
  textAlign: "center",
};

const dividerVertical = {
  width: 1,
  height: 40,
  background: "#eee",
};

const label = {
  fontSize: 12,
  color: "#666",
};

const value = {
  fontWeight: "bold",
  fontSize: 18,
};

const linksRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 10,
  fontSize: 12,
};

const list = {
  padding: 12,
};

const card = {
  background: "white",
  borderRadius: 12,
  padding: 12,
  marginBottom: 12,
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10,
  fontWeight: "bold",
};

const grayRow = {
  background: "#f1f1f1",
  padding: 8,
  borderRadius: 6,
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 6,
};

const progressRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 10,
};

const highlight = {
  color: "#7c3aed",
  fontWeight: "bold",
};

const smallText = {
  fontSize: 11,
  color: "#777",
};

const btn = {
  width: "100%",
  marginTop: 10,
  padding: 12,
  borderRadius: 25,
  border: "none",
  background: "linear-gradient(90deg,#7c3aed,#a855f7)",
  color: "white",
  fontWeight: "bold",
};