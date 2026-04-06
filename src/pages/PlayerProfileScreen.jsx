import { useNavigate } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
export default function PlayerProfileScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [profileImg, setProfileImg] = useState("");
  const [copied, setCopied] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newName, setNewName] = useState("");
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => {
      setToast({ show: false, msg: "", type: "success" });
    }, 2000);
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.profile_image) {
        setProfileImg(parsedUser.profile_image);
      }
    }
  }, []);
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const previewUrl = URL.createObjectURL(file);
      setProfileImg(previewUrl);
      const formdata = new FormData();
      formdata.append("image", file);
      formdata.append("id", user?.id);
      formdata.append("flag", 'image');
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://akrlottery.com/api/?url=update-profile`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: formdata,
        }
      );
      const text = await response.text();
      let result = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch (err) {
        console.warn("⚠️ Non-JSON response:", text);
      }

      // 👇 Handle HTTP errors
      if (!response.ok) {
        throw new Error(result?.message || `Upload failed: ${response.status}`);
      }

      // 👇 Success handling
      console?.log(result);
      if (result?.success || Object.keys(result).length === 0) {
        const uploadedUrl =
          result?.data?.url ||
          result?.url ||
          result?.image ||
          previewUrl;
        const updatedUser = {
          ...(user || {}),
          profile_image: uploadedUrl,
        };
        setUser(updatedUser);
        setProfileImg(uploadedUrl);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        showToast(result?.message || "Profile image updated");
      } else {
        showToast(result?.message || "Upload failed", "error");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      showToast(error.message || "Something went wrong while uploading", "error");
    }
  };

  const maskPhone = (phone) => {
    if (!phone) return "----";
    return phone.slice(0, 3) + "****" + phone.slice(-3);
  };

  const handleAddClick = () => fileInputRef.current.click();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(user?.id?.toString() || "");
    setCopied(true);
    showToast("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  const openEdit = () => {
    setNewName(user?.username || "");
    setShowEdit(true);
  };
  const handleSaveName = async () => {
    if (!newName.trim()) {
      showToast("Username cannot be empty", "error");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://akrlottery.com/api/?url=update-profile",
        {
          method: "POST",
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: newName.trim(),
            flag: "username",
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Update failed: ${response.status}`);
      }
      const text = await response.text();
      // console.log("API response:", text);
      let result = null;
      try {
        result = text ? JSON.parse(text) : null;
      } catch { }
      const updatedUser = result?.data || {
        ...user,
        username: newName.trim(),
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setShowEdit(false);
      showToast(result?.message || "Username updated successfully");
    } catch (error) {
      console.error("❌ Username update error:", error);
      showToast("Something went wrong", "error");
    }
  };
  const avatars = [
    // "https://i.pravatar.cc/100?img=1",
    // "https://i.pravatar.cc/100?img=2",
    // "https://i.pravatar.cc/100?img=3",
    // "https://i.pravatar.cc/100?img=4",
  ];
  return (
    <div style={container}>
      {/* 🔥 TOAST */}
      {toast.show && (
        <div
          style={{
            ...toastStyle,
            background: toast.type === "error" ? "#ef4444" : "#22c55e",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <div style={header}>
        <button onClick={() => navigate(-1)} style={backBtn}>
          <ChevronLeft />
        </button>
        My Profile
      </div>

      {/* PROFILE */}
      <div style={profileBox}>
        <div style={avatarBox}>
          <img src={profileImg} alt="" style={avatarImg} />
        </div>

        <div style={avatarList}>
          {avatars.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setProfileImg(img)}
              style={smallAvatar}
            />
          ))}

          <div onClick={handleAddClick} style={addBtn}>
            +
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        <div style={usernameRow}>
          <span style={badge}>V0</span>
          <span>{user?.username || "Player"}</span>
          <span onClick={openEdit} style={{ cursor: "pointer" }}>
            ✏️
          </span>
        </div>
      </div>

      {/* INFO */}
      <div style={card}>
        <div style={row}>
          <span>📱 Phone</span>
          <span>{maskPhone(user?.phone)}</span>
        </div>

        <div style={row}>
          <span>🔒 Password</span>
          <span>****** ›</span>
        </div>

        <div onClick={handleCopy} style={{ ...row, borderBottom: "none" }}>
          <span>🆔 User ID</span>
          <span>
            {user?.id || "----"} {copied ? "✔" : "📋"}
          </span>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEdit && (
        <>
          <div style={overlay} onClick={() => setShowEdit(false)} />

          <div style={modal}>
            <div style={modalHeader}>
              <span>Edit Username</span>
              <X onClick={() => setShowEdit(false)} style={{ cursor: "pointer" }} />
            </div>

            <input
            maxLength={20}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new username"
              style={input}
            />

            <button onClick={handleSaveName} style={saveBtn}>
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* 🔥 TOAST STYLE */
const toastStyle = {
  position: "fixed",
  top: 20,
  left: "50%",
  transform: "translateX(-50%)",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: 8,
  fontWeight: 500,
  zIndex: 999,
};

/* EXISTING STYLES (UNCHANGED) */
const container = {
  maxWidth: 430,
  margin: "0 auto",
  background: "#f2f2f2",
  minHeight: "100vh",
};

const header = {
  background: "#fff",
  padding: 12,
  textAlign: "center",
  fontWeight: 700,
  position: "relative",
};

const backBtn = {
  position: "absolute",
  left: 10,
  top: 10,
  background: "none",
  border: "none",
};

const profileBox = {
  textAlign: "center",
  padding: 20,
  background: "#f7f7f7",
};

const avatarBox = {
  width: 90,
  height: 90,
  borderRadius: "50%",
  overflow: "hidden",
  margin: "auto",
};

const avatarImg = { width: "100%", height: "100%" };

const avatarList = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
  marginTop: 10,
};

const smallAvatar = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  cursor: "pointer",
};

const addBtn = {
  width: 50,
  height: 50,
  borderRadius: "50%",
  background: "#eee",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
  color: "#7c3aed",
};

const usernameRow = {
  marginTop: 10,
  display: "flex",
  justifyContent: "center",
  gap: 6,
  alignItems: "center",
};

const badge = {
  background: "#d9e6ff",
  padding: "2px 6px",
  borderRadius: 6,
  fontSize: 12,
};

const card = {
  background: "#fff",
  margin: 14,
  borderRadius: 12,
  padding: 14,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #eee",
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  backdropFilter: "blur(4px)",
  zIndex: 50,
};

const modal = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  width: 300,
  zIndex: 60,
};

const modalHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10,
  fontWeight: 600,
};

const input = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
  marginBottom: 12,
};

const saveBtn = {
  width: "100%",
  padding: 10,
  borderRadius: 10,
  border: "none",
  background: "#7c3aed",
  color: "#fff",
  fontWeight: 600,
};