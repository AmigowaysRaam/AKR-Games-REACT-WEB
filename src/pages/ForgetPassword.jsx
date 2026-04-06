import { ChevronDown, ChevronLeft, EyeIcon, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOtpLogin,
  verifyOtp,
  resetPassword,
} from "../services/authService";

export default function ForgetPassword() {
  const navigate = useNavigate();

  const [showCountry, setShowCountry] = useState(false);
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("9876543110");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [uId, setuId] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  // ✅ NEW: validation errors
  const [errors, setErrors] = useState({});

  const countries = [
    { name: "India", code: "+91" },
    { name: "Pakistan", code: "+92" },
    { name: "Bangladesh", code: "+880" },
    { name: "Malaysia", code: "+60" },
    { name: "Singapore", code: "+65" },
    { name: "Turkey", code: "+90" },
    { name: "Russia", code: "+7" },
    { name: "South Africa", code: "+27" },
  ];

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const isValidPhone = (num) => /^[0-9]{10}$/.test(num);
  const isValidOtp = (code) => /^[0-9]{4}$/.test(code);

  // ✅ SEND OTP
  const handleSendOtp = async () => {
    let newErrors = {};

    if (!isValidPhone(phone)) {
      newErrors.phone = "Enter valid 10-digit phone number";
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setOtpLoading(true);
      const res = await getOtpLogin(phone, countryCode, "forgetPassword");
      if (res?.success) {
        showToast(res?.message || "OTP sent", "success");
        setTimer(30);
      } else {
        showToast(res?.message || "OTP failed", "error");
      }
    } catch {
      showToast("Error sending OTP", "error");
    } finally {
      setOtpLoading(false);
    }
  };

  // ✅ VERIFY OTP
  const handleNext = async () => {
    let newErrors = {};

    if (!isValidPhone(phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!isValidOtp(otp)) {
      newErrors.otp = "Enter valid 4-digit OTP";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);
      const res = await verifyOtp({
        phone: phone,
        otp,
        country_code: countryCode,
        flag: "forgetPassword",
      });

      if (res?.success) {
        setuId(res?.data?.id);
        showToast("OTP Verified", "success");
        setStep(2);
      } else {
        showToast(res?.message || "Invalid OTP", "error");
      }
    } catch {
      showToast("Verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESET PASSWORD
  const handleResetPassword = async () => {
    let newErrors = {};

    if (!password.trim() || password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      setLoading(true);
      const res = await resetPassword({
        id: uId,
        newPassword: password,
        confirmPassword,
        flag: "forgetPassword",
        country_code: countryCode,
      });

      if (res?.success) {
        showToast("Password reset successful", "success");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showToast(res?.message || "Reset failed", "error");
      }
    } catch {
      showToast("Error resetting password", "error");
    } finally {
      setLoading(false);
    }
  };

  const CountrySelect = ({ countries, onChange, onClose }) => {
    return (
      <div className="absolute top-10 left-0 bg-white border rounded shadow z-50 w-36 p-3">
        {countries.map((c) => (
          <div
            key={c.code}
            onClick={() => {
              onChange(c.code);
              onClose();
            }}
            className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
          >
            {c.code} {c.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-[#e9eaee] overflow-hidden">
      {/* TOAST */}
      {toast && (
        <div className="fixed top-10 right-10 z-50">
          <div
            className={`px-4 py-2 rounded-lg text-white text-sm ${toast.type === "error" ? "bg-red-500" : "bg-green-500"
              }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div className="flex-1" />
      <div className="w-[420px] bg-white h-full flex flex-col">
        {/* HEADER */}
        <div className="h-[50px] flex items-center px-4 border-b relative">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>

          <h2 className="absolute left-1/2 -translate-x-1/2 text-sm font-bold">
            Forget Password
          </h2>
        </div>

        <div className="flex-1 px-6 pt-8">
          {step === 1 && (
            <>
              <p className="text-sm mb-2 text-gray-500">Phone Number</p>

              <div className="flex items-center border-b pb-2 mb-1 gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowCountry((prev) => !prev)}
                    className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded flex items-center gap-1"
                  >
                    {countryCode}
                    <ChevronDown size={12} />
                  </button>

                  {showCountry && (
                    <CountrySelect
                      countries={countries}
                      onChange={setCountryCode}
                      onClose={() => setShowCountry(false)}
                    />
                  )}
                </div>

                <input
                placeholder="Enter phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  className="flex-1 outline-none text-sm font-semibold"
                />
              </div>

              {errors.phone && (
                <p className="text-xs text-red-500 mb-4">
                  {errors.phone}
                </p>
              )}

              <p className="text-sm mb-2 text-gray-500 mt-5">Enter OTP</p>

              <div className="flex items-center border-b pb-2 mb-1 ">
                <input
                  placeholder="OTP"
                  type="tel"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className="flex-1 outline-none text-sm font-semibold"
                />

                <button
                  onClick={handleSendOtp}
                  disabled={otpLoading || timer > 0}
                  className="ml-2 text-xs px-3 py-1 rounded bg-purple-100 text-purple-600"
                >
                  {otpLoading
                    ? "Sending..."
                    : timer > 0
                      ? `Resend (${timer}s)`
                      : "GET OTP"}
                </button>
              </div>

              {errors.otp && (
                <p className="text-xs text-red-500 mb-6">
                  {errors.otp}
                </p>
              )}

              <button
                onClick={handleNext}
                disabled={loading}
                className="w-full py-3 mt-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
              >
                {loading ? "Verifying..." : "NEXT"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm mb-2 text-gray-500">New Password</p>

              <div className="flex items-center border-b pb-2 mb-1">
                <input
                placeholder='New Password'
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 outline-none text-sm font-semibold"
                />
                <span onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <EyeIcon size={16} />}
                </span>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500 mb-4">
                  {errors.password}
                </p>
              )}

              <p className="text-sm mb-2 text-gray-500  mt-4">Confirm Password</p>

              <div className="flex items-center border-b pb-2 mb-1">
                <input
                placeholder="Confirm Password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1 outline-none text-sm font-semibold"
                />
                <span onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={16} /> : <EyeIcon size={16} />}
                </span>
              </div>

              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mb-6">
                  {errors.confirmPassword}
                </p>
              )}

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-3 mt-4 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
              >
                {loading ? "Updating..." : "RESET PASSWORD"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1" />
    </div>
  );
}