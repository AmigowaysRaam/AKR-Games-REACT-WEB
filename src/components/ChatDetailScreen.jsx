import { ChevronLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getSyncConvo, getInitData } from "../services/authService";
import { useEffect, useRef, useState } from "react";

export default function ChatDetailScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessionList, setSessionList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [topicLabel, setTopicLabel] = useState("Support Chat");
  const bottomRef = useRef(null);
  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetchData(parsed.id);
      fnInitFUnction(parsed.id);
    }
  }, []);

  const fnInitFUnction = async (userId) => {
    try {
      setLoading(true);
      const res = await getInitData({ id: userId });
      console.log(res, "init data");
      if (res?.success) {
        // ✅ only session list
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchData = async (userId) => {
    try {
      setLoading(true);
      const res = await getSyncConvo({ id: userId });
      if (res?.success) {
        // ✅ only session list
        setSessionList(res.session_list || []);
        // ✅ set current session
        const currentSession = res.current_session;
        setSessionId(currentSession?.session_id || null);
        setTopicLabel(currentSession?.topic_label || "Support Chat");
        bindMessages(res.all_messages, currentSession?.session_id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- BIND MESSAGES ---------------- */
  const bindMessages = (allMessages, sId) => {
    const filtered = (allMessages || []).filter(
      (m) =>
        m.session_id === sId || m.type === "date_separator"
    );
    setMessages(filtered);
  };

  /* ---------------- CLICK SESSION ---------------- */
  const openSession = (session, allMessages) => {
    setSessionId(session.session_id);
    setTopicLabel(session.topic_label);

    bindMessages(allMessages, session.session_id);
  };
  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      sender: "user",
      message: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "message",
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <ChevronLeft
          color="#fff"
          size={22}
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />
        <div>
          <div style={styles.headerTitle}>
            {sessionId ? topicLabel : "Support Chats"}
          </div>
          <div style={styles.subText}>Support Bot</div>
        </div>
      </div>
      <div style={styles.body}>
        {loading ? (
          <div style={styles.loader}>Loading...</div>
        ) : !sessionId ? (
          <div style={styles.list}>
            {sessionList.map((s) => (
              <div
                key={s.session_id}
                style={styles.listItem}
                onClick={() => openSession(s, window.__ALL_MESSAGES__)}
              >
                <div>
                  <div style={styles.listTitle}>
                    {s.topic_label}
                  </div>
                  <div style={styles.listMsg}>
                    {s.last_message || "No messages yet"}
                  </div>
                </div>

                <div style={styles.listTime}>
                  {formatTime(s.last_message_time)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ---------------- CHAT VIEW ---------------- */
          <>
            <div style={styles.chatArea}>
              {messages.map((msg, i) => {
                if (msg.type === "date_separator") {
                  return (
                    <div key={i} style={styles.date}>
                      {msg.label}
                    </div>
                  );
                }

                if (msg.type !== "message") return null;

                const isUser = msg.sender === "user";

                return (
                  <div
                    key={msg.id || i}
                    style={{
                      ...styles.messageRow,
                      justifyContent: isUser
                        ? "flex-end"
                        : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        ...styles.bubble,
                        background: isUser
                          ? "#2563eb"
                          : "#1e293b",
                      }}
                    >
                      {msg.message}
                      <div style={styles.time}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div style={styles.inputWrap}>
              <input
                style={styles.input}
                placeholder="Type message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div style={styles.sendBtn} onClick={handleSend}>
                <Send size={18} color="#fff" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */
const formatTime = (ts) => {
  if (!ts) return "";
  const date = new Date(Number(ts));
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ---------------- STYLES ---------------- */
const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#020617",
    color: "#fff",
  },

  header: {
    padding: 12,
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "linear-gradient(90deg,#1e3a8a,#2563eb)",
  },

  headerTitle: {
    fontWeight: "600",
    fontSize: 15,
  },

  subText: {
    fontSize: 11,
    opacity: 0.6,
  },

  body: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  loader: {
    textAlign: "center",
    marginTop: 40,
  },

  /* LIST */
  list: {
    padding: 10,
  },

  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    borderBottom: "1px solid #1e293b",
    cursor: "pointer",
  },

  listTitle: {
    fontWeight: "600",
    fontSize: 14,
  },

  listMsg: {
    fontSize: 12,
    opacity: 0.6,
  },

  listTime: {
    fontSize: 11,
    opacity: 0.6,
  },

  /* CHAT */
  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: 10,
  },

  date: {
    textAlign: "center",
    fontSize: 11,
    opacity: 0.6,
    margin: "10px 0",
  },

  messageRow: {
    display: "flex",
    marginBottom: 10,
  },

  bubble: {
    maxWidth: "75%",
    padding: "10px 12px",
    borderRadius: 14,
    fontSize: 13,
  },

  time: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 4,
    textAlign: "right",
  },

  inputWrap: {
    display: "flex",
    gap: 8,
    padding: 10,
    borderTop: "1px solid #1e293b",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "none",
    background: "#1e293b",
    color: "#fff",
  },

  sendBtn: {
    background: "#2563eb",
    padding: 10,
    borderRadius: "50%",
    cursor: "pointer",
  },
};