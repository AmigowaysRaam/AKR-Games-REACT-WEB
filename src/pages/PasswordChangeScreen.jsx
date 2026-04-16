import { ChevronLeft, EyeIcon, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changepassword, getOtpLogin } from "../services/authService";
export default function PasswordSetScreen() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showOldPass, setShowOldPass] = useState(false); // ✅ NEW
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };

  // ✅ OTP
  const handleGetOtp = async () => {
    if (!user?.phone) {
      showToast("User phone not found", 'error');
      return;
    }
    try {
      setOtpLoading(true);
      const res = await getOtpLogin(user?.phone, user?.country_code, "changePassword");
      if (res?.success) {
        showToast(res?.message || "OTP Sent", "success");
        setTimer(30);
      } else {
        showToast(res?.message || "OTP failed");
        console.log("OTP Error:", res);
      }
    } catch {
      showToast("Something went wrong");
    } finally {
      setOtpLoading(false);
    }
  };
  // ✅ VALIDATION
  const validate = () => {
    let newErrors = {};
    if (!oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }
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

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await changepassword({
        oldPassword: oldPassword,
        newPassword: password,
        confirmPassword: confirmPassword,
        otp: otp,
        flag: "changePassword"
      });
      if (res?.success) {
        showToast(res?.message || "Password changed", "success");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showToast(res?.message || "Failed");
      }
    } catch {
      showToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isActive =
    oldPassword &&
    password &&
    confirmPassword &&
    otp &&
    password === confirmPassword &&
    otp.length === 4;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <span onClick={() => navigate(-1)} style={styles.back}>
          <ChevronLeft className="cursor-pointer" size={25} />
        </span>
        <span style={styles.headerTitle}>Change Password</span>
      </div>

      <div style={styles.form}>
        {/* OLD PASSWORD */}
        <div>
          <p style={styles.label}>Enter old password</p>
          <div style={styles.inputBox}>
            <input
              type={showOldPass ? "text" : "password"}
              placeholder="Enter Old Password"
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setErrors((prev) => ({ ...prev, oldPassword: "" }));
              }}
              style={{ ...styles.input, flex: 1, padding: "15px 0" }}
            />
            <span onClick={() => setShowOldPass(!showOldPass)}>
              {showOldPass ? <EyeOff size={16} /> : <EyeIcon size={16} />}
            </span>
          </div>
          {errors.oldPassword && (
            <p style={styles.error}>{errors.oldPassword}</p>
          )}
        </div>

        {/* NEW PASSWORD */}
        <div>
          <p style={styles.label}>Enter New password</p>
          <div style={styles.inputBox}>
            <input
              maxLength={15}
              type={showPass ? "text" : "password"}
              placeholder="Enter Password (6-15)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              style={{ ...styles.input, flex: 1, padding: "15px 0" }}
            />
            <span onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={16} /> : <EyeIcon size={16} />}
            </span>
          </div>
          {errors.password && <p style={styles.error}>{errors.password}</p>}
        </div>
        <div>
          <p style={styles.label}>Confirm password</p>
          <div style={styles.inputBox}>
            <input
              maxLength={15}
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              style={{ ...styles.input, flex: 1, padding: "15px 0" }}
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
          <p style={styles.label}>Enter OTP</p>
          <div style={styles.otpRow}>
            <input
              maxLength={4}
              type="number"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 4) {
                  setOtp(value);
                  setErrors((prev) => ({ ...prev, otp: "" }));
                }
              }}
              style={{ ...styles.input, flex: 1, padding: "15px 0" }}
            />

            <button
              style={styles.otpBtn}
              onClick={handleGetOtp}
              disabled={timer > 0 || otpLoading}
            >
              {otpLoading
                ? "Sending..."
                : timer > 0
                  ? `Resend (${timer}s)`
                  : "GET OTP"}
            </button>
          </div>
          {errors.otp && <p style={styles.error}>{errors.otp}</p>}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
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
  label: {
    color: "#555",
    fontSize: 13,
    marginBottom: 1,
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
    marginBottom: 6,

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