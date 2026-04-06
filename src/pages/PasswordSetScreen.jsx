import { ChevronLeft, EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PasswordSetScreen() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ field errors
  const [errors, setErrors] = useState({});

  const [toast, setToast] = useState({ message: "", type: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };

  // ✅ OTP API (mock)
  const handleGetOtp = async () => {
    try {
      showToast("OTP sent successfully", "success");
    } catch (err) {
      showToast("Failed to send OTP");
    }
  };

  // ✅ validation with inline errors
  const validate = () => {
    let newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6 || password.length > 15) {
      newErrors.password = "Password must be 6–15 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!otp) {
      newErrors.otp = "OTP is required";
    } else if (otp.length !== 4) {
      newErrors.otp = "OTP must be 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit with API
  const handleSubmit = async () => {
    
    // always validate on click (even if button looks inactive)
    if (!validate()) {
      showToast("Please fix the errors", "error");
      return;
    }
    if (!validate()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://akrlottery.com/api/?url=set-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ password, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Something went wrong");
      }

      showToast("Password set successfully", "success");
      navigate(-1);
    } catch (err) {
      showToast(err.message || "API error");
    } finally {
      setLoading(false);
    }
  };

  const isActive =
    password && confirmPassword && otp && password === confirmPassword && otp.length === 4;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <span onClick={() => navigate(-1)} style={styles.back}>
          <ChevronLeft size={25} />
        </span>
        <span style={styles.headerTitle}>Set Password</span>
      </div>

      <div style={styles.form}>
        {/* PASSWORD */}
        <div>
          <div style={styles.inputBox}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter Password (6-15)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            <span onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={16} /> : <EyeIcon size={16} />}
            </span>
          </div>
          {errors.password && <p style={styles.error}>{errors.password}</p>}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <div style={styles.inputBox}>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
            />
            <span onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff size={16} /> : <EyeIcon size={16} />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p style={styles.error}>{errors.confirmPassword}</p>
          )}
        </div>

        {/* OTP */}
        <div>
          <div style={styles.otpRow}>
            <input
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 4) setOtp(value);
              }}
              style={{ ...styles.input, flex: 1 }}
            />
            <button style={styles.otpBtn} onClick={handleGetOtp}>
              GET OTP
            </button>
          </div>
          {errors.otp && <p style={styles.error}>{errors.otp}</p>}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          style={{ ...styles.submitBtn, opacity: isActive ? 1 : 0.5 }}
        >
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>

      {/* LOADER */}
      {loading && (
        <div style={styles.loaderOverlay}>
          <div style={styles.spinner}></div>
        </div>
      )}

      {/* TOAST */}
      {toast.message && (
        <div
          style={{
            ...styles.toast,
            background: toast.type === "error" ? "#ff4d4f" : "#28a745",
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    minHeight: "100vh",
    background: "#f6f7fb",
    fontFamily: "sans-serif",
  },

  header: {
    display: "flex",
    alignItems: "center",
    padding: 16,
    background: "#fff",
    position: "relative",
  },

  back: {
    cursor: "pointer",
    zIndex: 1,
  },

  headerTitle: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    fontWeight: "bold",
  },

  form: {
    padding: 20,
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
  },

  input: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "12px 0",
    fontSize: 14,
    background: "transparent",
  },

  otpRow: {
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
    gap: 10,
  },

  otpBtn: {
    padding: "8px 12px",
    fontSize: 12,
    borderRadius: 6,
    border: "none",
    background: "#e6e9f2",
    cursor: "pointer",
  },

  error: {
    color: "#ff4d4f",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 10,
  },

  submitBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 25,
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
    color: "#fff",
    marginTop: 20,
  },

  loaderOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #fff",
    borderTop: "4px solid #555",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  toast: {
    position: "absolute",
    top: 30,
    left: "50%",
    transform: "translateX(-50%)",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 20,
    fontSize: 13,
  },
};
