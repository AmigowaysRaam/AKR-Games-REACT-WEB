import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { addBankAccont, getOtpLogin, updateBankAccont } from "../services/authService";
import GameLoader from "./LoaderComponet";
import { set } from "date-fns";

export default function AddbankAccount() {
  const navigate = useNavigate();
  const location = useLocation();


  const state =
    location.state?.bank ||
    JSON.parse(localStorage.getItem("editBank")) ||
    null;

  const isEdit = !!state;

  const [form, setForm] = useState({
    name: "",
    ifsc: "",
    account: "",
    confirmAccount: "",
    upi: "",
    email: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 2500);
  };

  useEffect(() => {
    if (state) {
      setForm({
        name: state.account_name || "",
        ifsc: state.ifsc_code || "",
        account: state.account_number_full || "",
        confirmAccount: state.account_number_full || "",
        upi: state.upi_address || "",
        email: state.email || "",
      });
    }
  }, [state]);

  // OTP TIMER
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // GET OTP
  const handleGetOtp = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    // alert(JSON.stringify(user))
    // return;
    if (!user.phone || user.phone.length < 10) {
      showToast('Error');
      return;
    }
    try {
      setLoading(true);
      const res = await getOtpLogin(user.phone, user.country_code, "updatebank");
      if (res?.success) {
        showToast(res?.message);
        setTimer(30);
        setOtpSent(true); // ✅ IMPORTANT
      } else {
        showToast(res?.message, "error");
        setOtpSent(false);
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Something went wrong", "error");
      setOtpSent(false);
    } finally {
      setLoading(false);
    }
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

    if (!form.upi && !/^[\w.-]+@[\w]+$/.test(form.upi)) {
      err.upi = "Invalid UPI ID";
    }

    if (!form.email) {
      err.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      err.email = "Invalid email";
    }

    // ✅ OTP validation
    if (!otp) {
      err.otp = "OTP is required";
    } else if (otp.length < 4) {
      err.otp = "Invalid OTP";
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
      otp: otp, // ✅ added OTP
    };

    if (isEdit && state?.id) {
      payload.id = state.id;
    }

    try {
      setLoading(true);

      const res = isEdit
        ? await updateBankAccont(payload)
        : await addBankAccont(payload);

      if (res?.success) {
        showToast(
          res?.message || (isEdit ? "Bank updated" : "Bank added"),
          "success"
        );
        setTimeout(() => navigate(-1), 1000);
      } else {
        showToast(res?.message, "error");
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
    otp &&
    form.account === form.confirmAccount;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <span onClick={() => navigate(-1)} style={styles.back}>
          <ChevronLeft size={24} />
        </span>
        <span style={styles.title}>
          {isEdit ? "Edit Bank Account" : "Add Bank Card"}
        </span>
      </div>

      <div style={styles.card}>
        <Field label="Account name" value={form.name} onChange={(v) => handleChange("name", v)} error={errors.name} />
        <Field label="IFSC Code" value={form.ifsc} onChange={(v) => handleChange("ifsc", v.toUpperCase())} error={errors.ifsc} />
        <Field label="Account Number" value={form.account} onChange={(v) => handleChange("account", v)} error={errors.account} type="number" />
        <Field label="Account Number Again" value={form.confirmAccount} onChange={(v) => handleChange("confirmAccount", v)} error={errors.confirmAccount} type="number" />
        <Field label="Enter UPI Address" value={form.upi} onChange={(v) => handleChange("upi", v)} error={errors.upi} />
        <Field label="Email" value={form.email} onChange={(v) => handleChange("email", v)} error={errors.email} />

        {/* ✅ OTP FIELD */}
        <div style={{ marginBottom: 18 }}>

          <div
            style={{
              ...styles.inputWrapper,
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderColor: errors.otp ? "#ff4d4f" : "#ddd",
            }}
          >
            <label style={{ ...styles.floatingLabel, top: 4, left: 12, fontSize: 11 }}>
              Enter OTP
            </label>
            <input
              type="number"
              value={otp}
              // VALIDATE OTP INPUT TO ONLY ALLOW NUMBERS AND 4 DIGITS
              onChange={(e) => { otpSent && setOtp(e.target.value.replace(/\D/g, "").slice(0, 4)) }}
              placeholder="Enter OTP"
              style={{ ...styles.input, flex: 1 }}
            />

            <button
              onClick={handleGetOtp}
              disabled={timer > 0}
              style={{
                ...styles.otpBtn,
                opacity: timer > 0 ? 0.6 : 1,
              }}
            >
              {timer > 0 ? `Resend (${timer}s)` : "Get OTP"}
            </button>
          </div>

          {errors.otp && <p style={styles.error}>{errors.otp}</p>}
        </div>
      </div>

      {/* BUTTON */}
      <div style={{ padding: 20 }}>
        <button
          onClick={handleSubmit}
          style={{ ...styles.btn, opacity: isActive ? 1 : 0.5 }}
        >
          {loading ? "Processing..." : isEdit ? "Update" : "Confirm"}
        </button>
      </div>

      {loading && <GameLoader />}

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

const Field = ({ label, value, onChange, error, type = "text" }) => {
  const [focus, setFocus] = useState(false);

  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          ...styles.inputWrapper,
          borderColor: error ? "#ff4d4f" : focus ? "#7b2ff7" : "#ddd",
        }}
      >
        <label
          style={{
            ...styles.floatingLabel,
            top: value || focus ? 4 : "50%",
            fontSize: value || focus ? 11 : 14,
          }}
        >
          {label}
        </label>

        <input
          maxLength={type === "number" ? 20 : 30}
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

const styles = {
  container: {
    maxWidth: 430,
    margin: "0 auto",
    minHeight: "100vh",
    background: "#f3f4f6",
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
  },
  inputWrapper: {
    position: "relative",
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "16px 12px 6px",
    background: "#fafafa",
  },
  floatingLabel: {
    position: "absolute",
    left: 12,
    transform: "translateY(-50%)",
    background: "#fafafa",
    padding: "0 4px",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    marginTop: 8,
  },
  error: {
    color: "#ff4d4f",
    fontSize: 12,
    marginTop: 6,
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
  otpBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    cursor: "pointer",
    background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
    transition: "all 0.3s ease",
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