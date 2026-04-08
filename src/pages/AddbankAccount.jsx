import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBankAccont } from "../services/authService";

export default function AddbankAccount() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    ifsc: "",
    account: "",
    confirmAccount: "",
    upi: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
    
  };


  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };
  const validate = () => {
    let err = {};
    if (!form.name.trim()) err.name = "Account name is required";
    if (!form.ifsc) {
      err.ifsc = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)) {
      err.ifsc = "Invalid IFSC code";
    }
    if (!form.account) {
      err.account = "Account number is required";
    } else if (form.account.length < 6) {
      err.account = "Invalid account number";
    }
    if (!form.confirmAccount) {
      err.confirmAccount = "Please confirm account number";
    } else if (form.account !== form.confirmAccount) {
      err.confirmAccount = "Account numbers do not match";
    }
    if (form.upi && !/^[\w.-]+@[\w]+$/.test(form.upi)) {
      err.upi = "Invalid UPI ID";
    }

    if (!form.email) {
      err.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      err.email = "Invalid email";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) return;
    const user = JSON.parse(localStorage.getItem("user"));
    const payload = {
      user_id: user?.id,
      account_name: form.name,
      ifsc_code: form.ifsc,
      account_number: form.account,
      confirm_account_number: form.confirmAccount,
      upi_address: form.upi,
      email: form.email,
    };
    try {
      setLoading(true);
      const res = await addBankAccont(payload);
      console.log(res, 'res bank data add bank account');
      if (res?.success) {
        showToast(res?.message, "success");
        setTimeout(() => navigate(-1), 1000);
      } else {
        showToast(res?.message || "Failed to add bank");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isActive =
    form.name &&
    form.ifsc &&
    form.account &&
    form.confirmAccount &&
    form.email &&
    form.account === form.confirmAccount;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <span onClick={() => navigate(-1)} style={styles.back}>
          <ChevronLeft size={24} />
        </span>
        <span style={styles.title}>Add Bank Card</span>
      </div>

      {/* FORM */}
      <div style={styles.card}>
        <Field label="Account name" value={form.name} onChange={(v) => handleChange("name", v)} error={errors.name} />

        <Field label="IFSC Code" value={form.ifsc} onChange={(v) => handleChange("ifsc", v.toUpperCase())} error={errors.ifsc} />

        <Field label="Account Number" value={form.account} onChange={(v) => handleChange("account", v)} error={errors.account} type="number" />

        <Field label="Account Number Again" value={form.confirmAccount} onChange={(v) => handleChange("confirmAccount", v)} error={errors.confirmAccount} type="number" />

        <Field label="Enter UPI Address" value={form.upi} onChange={(v) => handleChange("upi", v)} error={errors.upi} />

        <Field label="Email" value={form.email} onChange={(v) => handleChange("email", v)} error={errors.email} />
      </div>

      {/* BUTTON */}
      <div style={{ padding: 20 }}>
        <button
          onClick={handleSubmit}
          style={{
            ...styles.btn,
            opacity: isActive ? 1 : 0.5,
          }}
        >
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>

      {/* LOADER */}
      {loading && (
        <div style={styles.overlay}>
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

// 🔥 NEW MODERN FIELD UI
const Field = ({ label, value, onChange, error, type = "text" }) => {
  const [focus, setFocus] = useState(false);

  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          ...styles.inputWrapper,
          borderColor: error ? "#ff4d4f" : focus ? "#7b2ff7" : "#ddd",
          boxShadow: focus ? "0 0 0 2px rgba(123,47,247,0.1)" : "none",
        }}
      >
        <label
          style={{
            ...styles.floatingLabel,
            top: value || focus ? 4 : "50%",
            fontSize: value || focus ? 11 : 14,
            color: error ? "#ff4d4f" : focus ? "#7b2ff7" : "#888",
          }}
        >
          {label}
        </label>

        <input
          type={type}
          value={value}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
        />
      </div>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

// 🎨 UPDATED STYLES
const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    minHeight: "100vh",
    background: "#f3f4f6",
    fontFamily: "sans-serif",
  },

  header: {
    display: "flex",
    alignItems: "center",
    padding: 16,
    background: "#fff",
    position: "relative",
  },

  back: { cursor: "pointer" },

  title: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    fontWeight: "bold",
  },

  card: {
    background: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  inputWrapper: {
    position: "relative",
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "16px 12px 6px",
    background: "#fafafa",
    transition: "0.2s",
  },

  floatingLabel: {
    position: "absolute",
    left: 12,
    transform: "translateY(-50%)",
    background: "#fafafa",
    padding: "0 4px",
    transition: "0.2s",
    pointerEvents: "none",
  },

  input: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: 14,
    background: "transparent",
    marginTop: 8,
    padding: 1,
  },

  error: {
    color: "#ff4d4f",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },

  btn: {
    width: "100%",
    padding: 14,
    borderRadius: 25,
    border: "none",
    fontWeight: "bold",
    color: "#fff",
    background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
  },

  overlay: {
    position: "fixed",
    inset: 0,
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
    position: "fixed",
    top: 30,
    left: "50%",
    transform: "translateX(-50%)",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 20,
  },
};