import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, RefreshCcw } from "lucide-react";
import { getEarningDetails, handleResetLinkApi } from "../services/authService";
import GameLoader from "./LoaderComponet";
export default function InviteFriends() {
  const navigate = useNavigate();
  const [data, SetApiData] = useState(null);
  const copyCode = () => {
    if (!JSON.parse(localStorage.getItem("user"))?.id) {
      showToast("User not found", "error");
      navigate('/login');
      return;
    }
    navigator.clipboard.writeText(data?.referral_code);
    showToast('Copy to Clipboard', "success");
  };
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => {
      setToast({ show: false, msg: "", type: "success" });
    }, 2000);
  };

  const handleShareLink = async () => {
    const url = `${window.location.origin}/Sign?ref=${data.referral_code}`;
    const shareData = {
      title: "Join me on AKR Lottery!",
      text: `Use my invite code ${data?.referral_code}`,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("Shared successfully!", "success");
        return;
      } catch (err) {
      }
    }
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(data?.referral_code);
        showToast("Link copied!", "success");
        return;
      } catch (err) {

      }
    }
    try {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed"; // avoid scroll
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      document.execCommand("copy");
      document.body.removeChild(textarea);

      showToast("Link copied!", "success");
    } catch (err) {
      showToast("Failed to copy link", "error");
    }
  };
  const handleResetLink = async () => {
    if (!JSON.parse(localStorage.getItem("user"))?.id) {
      showToast("User not found", "error");
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const resp = await handleResetLinkApi({
        userId: JSON.parse(localStorage.getItem("user"))?.id,
      });
      if (resp?.success) {
        showToast(resp?.message, "success");
      }
      else {
        showToast(resp?.message, "error");
      }
      fetchEarning();
    } catch (err) {
      console.log(err);
      showToast("Failed to reset referral code", "error");
    } finally {
      setLoading(false);
    }
  }
  const [loading, setLoading] = useState(false);
  const fetchEarning = async () => {
    try {
      setLoading(true);

      const res = await getEarningDetails({
        userId: JSON.parse(localStorage.getItem("user"))?.id,
      });
      const api = res?.data;
      SetApiData(api)
    } catch (err) {
      console.log(err);
      showToast("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEarning();
  }, []);

  return (
    <div style={container}>
      <div style={header}>
        <span onClick={() => navigate(-1)} style={back}>
          <ChevronLeft
            className="cursor-pointer" />
        </span>
        <span style={title}>Invite Friends</span>
        <button className="cursor-pointer" onClick={() => navigate('/RulesScreeen')} style={rulesBtn}>Rules</button>
      </div>
      {toast?.show && (
        <div
          style={{
            ...toastStyle,
            background: toast.type === "error" ? "#ef4444" : "#22c55e",
          }}
        >
          {toast?.msg}
        </div>
      )}
      {/* {JSON.stringify(data)} */}
      {
        loading ?
          <GameLoader />
          :
          <>
            <div style={content}>
              <div className="px-4 py-2" style={{
                banner,
                backgroundImage: `url(${data?.image})`,
                position: "relative",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}>

                <div style={{
                  position: "relative", zIndex: 2, paddingTop: "45%",
                }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#f3f4f6",
                      borderRadius: "12px",
                      padding: "10px 12px",
                      padding: "6px 10px", borderRadius: "10px",
                      background: "linear-gradient(90deg, rgba(255,215,0,0.9), rgba(255,255,255,0.1))",
                      backdropFilter: "blur(12px)",
                      display: "flex", alignItems: "center", gap: "10px"

                    }}
                  >
                    <span
                      style={{
                        fontWeight: "600",
                        fontSize: "25px",
                        letterSpacing: "1px",
                        color: "#111",
                        alignSelf: "center"
                      }}
                    >
                      {data?.referral_code || `${' - - - - - - '}`}
                    </span>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "6px 10px", borderRadius: "20px"
                    }}>
                      {/* <p>{JSON.stringify(data,null,2)}</p> */}
                      <span

                        onClick={() => handleResetLink()}
                        style={{
                          fontSize: "12px",
                          color: data?.referral_code ? "#fff" : "#777",
                          cursor: "pointer",
                          fontWeight: "500",
                          background: data?.referral_code ? "#7c3aed" : "#e5e5e5",
                          padding: "6px 10px",
                          borderRadius: "20px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        Reset link <RefreshCcw size={14} />
                      </span>
                      <button
                        onClick={copyCode}
                        style={{
                          padding: "6px 16px",
                          borderRadius: "20px",
                          border: "none",
                          color: data?.referral_code ? "#fff" : "#777",
                          cursor: "pointer",
                          fontWeight: "500",
                          background: data?.referral_code ? "#7c3aed" : "#e5e5e5",
                          fontSize: "12px",
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      padding: "10px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      maxWidth: "400px",
                      width: "100%",
                      fontFamily: "Arial, sans-serif",
                      margin: "20px auto 0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "5px"
                      }}
                    >
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#777",
                            marginBottom: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px"
                          }}
                        >
                          💰 <span>Cumulative Income</span>
                        </div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "#222"
                          }}
                        >
                          ₹{data?.cumulative_income || 0}
                        </div>
                      </div>
                      <div
                        style={{
                          width: "1px",
                          height: "40px",
                          background: "#e5e5e5"
                        }}
                      ></div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "13px", color: "#777",
                            marginBottom: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                          }}                        >
                          👥 <span>Total Invited</span>
                        </div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "#222"
                          }}
                        >
                          {data?.total_invited_count || 0}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderTop: "1px solid #eee",
                        paddingTop: "12px",
                        fontSize: "11px"
                      }}
                    >
                      <span
                        onClick={() => {
                          if (!JSON.parse(localStorage.getItem("user"))?.id) {
                            showToast("User not found", "error");
                            navigate('/login');
                            return;
                          }
                          navigate('/invitationRecord')
                        }}
                        style={{
                          color: "#4a90e2", cursor: "pointer",
                          fontWeight: "500", display: "flex",
                          alignItems: "center",
                          gap: "5px"
                        }}
                      >
                        📜 Invitation Record
                      </span>
                      <span
                        onClick={() => {
                          if (!JSON.parse(localStorage.getItem("user"))?.id) {
                            showToast("User not found", "error");
                            navigate('/login');
                            return;
                          }
                          navigate('/RulesScreeen')
                        }}
                        style={{
                          color: "#4a90e2",
                          cursor: "pointer",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px"
                        }}
                      >
                        📘 Reward Rules
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={list}>
                {data?.inviteRules?.map((b, index) => (
                  <div key={index} style={card}>
                    <div style={cardHeader}>
                      <span>{b?.title}</span>
                      <span style={{ color: "#7c3aed" }}>₹{b.bonusAmount}</span>
                    </div>
                    <div style={grayRow}>
                      <span>Number of invitees</span>
                      <span>{b?.noOfPeople}</span>
                    </div>
                    <div style={grayRow}>
                      <span>Recharge per people</span>
                      <span style={{ color: "#7c3aed" }}>
                        ₹{b?.rechargePerPerson}
                      </span>
                    </div>
                    <div style={progressRow}>
                      <div>
                        <span style={highlight}>
                          {b?.inviteProgress?.split("/")?.[0]}
                        </span>
                        /{b?.noOfPeople}
                        <div style={smallText}>Invitees</div>
                      </div>
                      <div>
                        <span style={highlight}>
                          {b?.depositProgress?.split("/")?.[0]}
                        </span>
                        /{b.noOfPeople}
                        <div style={smallText}>Deposits</div>
                      </div>
                    </div>
                    {/* <p>{JSON.stringify(b,null,2)}</p> */}
                    <button
                      onClick={() => !b?.isCompleted && handleShareLink()}
                      disabled={b?.isCompleted}
                      className={`px-4 py-2 rounded-lg text-white transition-all w-full
                        my-4
    ${b?.isCompleted
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-violet-500 active:scale-95"
                        }
  `}
                    >
                      {b?.isCompleted ? "Completed" : "Go Complete"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
      }
    </div>
  );
}
const container = {
  maxWidth: 430, margin: "0 auto",
  height: "100vh", display: "flex", flexDirection: "column", background: "#f5f5f5",
}; const content = {
  flex: 1, overflowY: "auto",
  paddingBottom: "20%",
}; const header = {
  height: 55, background: "#7c3aed", color: "white", display: "flex",
  alignItems: "center", justifyContent: "space-between", padding: "0 12px",
  flexShrink: 0,
}; const back = { fontSize: 15, cursor: "pointer" }; const title = { fontWeight: "bold" };
const rulesBtn = {
  background: "white", border: "none", padding: "4px 10px",
  borderRadius: 6, color: "#7c3aed",
}; const banner = {};
const list = { padding: "0 12px", };
const card = {
  background: "white", borderRadius: 12, padding: 12, marginBottom: 12,
};
const cardHeader = {
  display: "flex", justifyContent: "space-between",
  marginBottom: 10, fontWeight: "bold",
}; const grayRow = {
  background: "#f1f1f1",
  padding: 8, borderRadius: 6, display: "flex", justifyContent: "space-between",
  marginBottom: 6,
}; const toastStyle = {
  position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", color: "#fff",
  padding: "10px 16px", borderRadius: 8, fontWeight: 500, zIndex: 999,
}; const progressRow = { display: "flex", justifyContent: "space-between", marginTop: 10, };
const highlight = { color: "#7c3aed", fontWeight: "bold", };
const smallText = { fontSize: 10, color: "#777", };
