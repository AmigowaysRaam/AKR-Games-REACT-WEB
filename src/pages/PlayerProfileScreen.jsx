import { useNavigate } from "react-router-dom";
import { ChevronLeft, ImagePlus, LogOutIcon, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import BankList from "./BankDetails";

export default function PlayerProfileScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [profileImg, setProfileImg] = useState("");
  const [copied, setCopied] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [newName, setNewName] = useState("");

  // ✅ NEW STATE
  const [showLogout, setShowLogout] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("wallet");
    localStorage.clear();
    sessionStorage.clear();
    showToast("Logged out successfully");

    setTimeout(() => {
      navigate("/"); // change if needed
    }, 800);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      setProfileImg(previewUrl);
      const formdata = new FormData();
      formdata.append("image", file);
      formdata.append("id", user?.id);
      formdata.append("flag", "image");
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
      } catch { }

      if (!response.ok) {
        throw new Error(result?.message || `Upload failed`);
      }

      const uploadedUrl =
        result?.data?.url || result?.url || result?.image || previewUrl;

      const updatedUser = {
        ...(user || {}),
        profile_image: uploadedUrl,
      };

      setUser(updatedUser);
      setProfileImg(uploadedUrl);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      showToast(result?.message || "Profile image updated");
    } catch (error) {
      showToast(error.message || "Upload failed", "error");
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
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: newName.trim(),
            flag: "username",
          }),
        }
      );

      if (!response.ok) throw new Error();

      const updatedUser = {
        ...user,
        username: newName.trim(),
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setShowEdit(false);
      showToast("Username updated successfully");
    } catch {
      showToast("Something went wrong", "error");
    }
  };

  return (
    <div style={container}>
      {/* TOAST */}
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
        {/* ✅ LOGOUT ICON */}
        <LogOutIcon
          onClick={() => setShowLogout(true)}
          style={{ position: "absolute", right: 10, top: 12, cursor: "pointer" }}
        />
      </div>
      <div style={profileBox}>
        {/* Avatar */}
        <div style={avatarWrapper}>
          {profileImg ? (
            <div style={avatarBox}>
              <img src={profileImg} alt="" style={avatarImg} />
            </div>
          ) : (
            <div
              className="rounded-full flex items-center justify-center bg-gray-200 overflow-hidden"
              style={avatarBox}
            >
              <span style={{ fontSize: "50px", fontWeight: "bold" }}>
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* 🔥 Floating Add Icon */}
          <div style={addIconWrapper} onClick={handleAddClick}>
            <ImagePlus size={18} color="#fff" />
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          accept="image/*"
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        {/* Username Row */}
        <div style={usernameRow}>
          <span style={badge}>V0</span>
          <span>{user?.username || "Player"}</span>
          <span onClick={openEdit} style={{ cursor: "pointer" }}>✏️</span>
        </div>
      </div>
      <div style={card}>
        <div style={row}>
          <span>📱 Phone</span>
          <span>{maskPhone(user?.phone)}</span>
        </div>
        <div style={row} onClick={() => navigate('/PasswordChangeScreen')}>
          <span>🔒 Password</span>
          <span>****** ›</span>
        </div>

        <div onClick={handleCopy} style={{ ...row, borderBottom: "none" }}>
          <span>🆔 User ID</span>
          <span>{user?.id || "----"} {copied ? "✔" : "📋"}</span>
        </div>
      </div>
      <BankList />
      {
        showEdit && (
          <>
            <div style={overlay} onClick={() => setShowEdit(false)} />
            <div style={modal}>
              <div style={modalHeader}>
                <span>Edit Username</span>
                <X onClick={() => setShowEdit(false)} />
              </div>

              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={input}
              />

              <button onClick={handleSaveName} style={saveBtn}>Save</button>
            </div>
          </>
        )
      }

      {
        showLogout && (
          <>
            <div style={overlay} onClick={() => setShowLogout(false)} />
            <div style={modal}>
              <div style={modalHeader}>
                <span>Confirm Logout</span>
                <X
                  className="cursor-pointer"
                  onClick={() => setShowLogout(false)} />
              </div>

              <p style={{ marginBottom: 15 }}>
                Are you sure you want to logout?
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="cursor-pointer"
                  onClick={() => setShowLogout(false)}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ddd",
                  }}
                >
                  Cancel
                </button>
                <button
                  className="cursor-pointer"
                  onClick={handleLogout}
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRadius: 10,
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )
      }
    </div >
  );
}
const toastStyle = {
  position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
  color: "#fff", padding: "10px 16px", borderRadius: 8, zIndex: 999,
};
const container = { maxWidth: 430, margin: "0 auto", background: "#f2f2f2", minHeight: "100vh" };
const header = { background: "#fff", padding: 12, textAlign: "center", fontWeight: 700, position: "relative" };
const backBtn = { position: "absolute", left: 10, top: 10, border: "none", background: "none" };
const profileBox = { textAlign: "center", padding: 20 };
const avatarWrapper = {
  position: "relative", width: 120, height: 120,
  margin: "0 auto", borderWidth: 2, borderColor: "#7c3aed", borderStyle: "solid", borderRadius: "50%",
}; const avatarBox = {
  width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#e5e7eb",
}; const avatarImg = {
  width: "100%", height: "100%", objectFit: "cover",
}; const addIconWrapper = { position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderRadius: "50%", background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "3px solid #fff", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", }; const usernameRow = { marginTop: 10, display: "flex", justifyContent: "center", gap: 6 };
const badge = { background: "#d9e6ff", padding: "2px 6px", borderRadius: 6 };
const card = { background: "#fff", margin: 14, borderRadius: 12, padding: 14 };
const row = { display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #eee" }; const overlay = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
  zIndex: 50,
};
const modal = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "#fff", padding: 20, borderRadius: 16, width: "400px", zIndex: 60 };
const modalHeader = { display: "flex", justifyContent: "space-between", marginBottom: 10 };
const input = { width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", marginBottom: 12 };
const saveBtn = { width: "100%", padding: 10, borderRadius: 10, background: "#7c3aed", color: "#fff", border: "none" };