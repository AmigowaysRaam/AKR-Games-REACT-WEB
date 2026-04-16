import { ChevronDown, ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCountryCodeFromIP } from "../utils/fetchCountry";
import { getOtpLogin, getRegister } from "../services/authService";
export default function SignUpPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [allowNotifications, setAllowNotifications] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const phoneRef = useRef(null);
  const navigate = useNavigate();
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // ✅ COUNTRY LIST
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
  const countryMap = {
    IN: "+91",
    PK: "+92",
    BD: "+880",
    MY: "+60",
    SG: "+65",
    TR: "+90",
    RU: "+7",
    ZA: "+27",
  };
  // ✅ isValid
  const isValid =
    phone.length >= 10 &&
    otp.length >= 4 &&
    email &&
    password.length >= 6 &&
    confirmPassword === password &&
    ageConfirmed &&
    allowNotifications
  useEffect(() => {
    fetchCountryCodeFromIP()
      .then((c) => setCountryCode(countryMap[c] || "+91"))
      .catch(console.error);
  }, []);

  // ⏱ timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);
  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 2500);
  };
  const isValidEmail = (e) =>
    /^[a-z][^\s@]*@[^\s@]+\.[^\s@]+$/.test(e);
  const validateFields = () => {
    let e = {};
    if (!phone || phone.length < 10) e.phone = "Enter valid phone number";
    if (!otp || otp.length < 4) e.otp = "Enter valid OTP";
    if (!email || !isValidEmail(email)) e.email = "Enter valid email";
    if (!password || password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (!confirmPassword)
      e.confirmPassword = "Confirm your password";
    else if (confirmPassword !== password)
      e.confirmPassword = "Passwords do not match";
    if (!ageConfirmed) e.age = "You must confirm age";
    if (!allowNotifications) e.notify = "Please allow notifications";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setErrors((prev) => ({ ...prev, phone: "Enter valid phone number" }));
      phoneRef.current?.focus();
      return;
    }
    try {
      setOtpLoading(true);
      const res = await getOtpLogin(phone,
        countryCode,
        "signup");
      if (res?.success) {
        showToast(res?.message || "OTP Sent");
        setTimer(30);
      } else {
        showToast(res?.message, "error");
      }
    } catch {
      showToast("Failed to send OTP ❌", "error");
    } finally {
      setOtpLoading(false);
    }
  };
  
  const handleSignup = async () => {
    if (!validateFields()) return;
    try {
      setLoading(true);
      const res = await getRegister({
        phone: `${phone}`,
        otp,
        email, password,
        referral_code: referral,
        allow_notifications: allowNotifications,
        is_18plus: ageConfirmed,
        confirmPassword,
        country_code: countryCode
      });
      // console.log("Signup response:", res);
      if (res?.success) {
        showToast(res?.message, "success");
        setTimeout(() => navigate("/login"), 100);
      } else {
        showToast(res?.message, "error");
      }
    } catch {
      showToast("Something went wrong ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-[#e9eaee] overflow-hidden">
      {
        toast &&
        (
          <div className="fixed right-45 top-15 z-50">
            <div className={`px-4 py-2 rounded text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
              {toast.message}
            </div>
          </div>
        )}

      <div className="flex-1"></div>

      <div className="w-[420px] bg-white h-full flex flex-col">
        {/* HEADER */}
        <div className="h-[50px] flex items-center px-4 border-b relative">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-sm font-bold">
            SIGN UP
          </h2>
        </div>
        <div className="flex-1 px-6 pt-6">
          {/* PHONE */}
          <label className="text-xs text-gray-500 mb-1 block">Phone Number</label>
          <div className="flex items-center border-b pb-4 mb-2 relative">
            <span
              className="text-gray-500 mr-2 cursor-pointer bg-blue-100 px-2 py-1 rounded"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            >
              {countryCode}
              <ChevronDown
                size={14}
                className={`inline-block ml-1 transition-transform ${showCountryDropdown ? "rotate-90" : ""
                  }`}
              />
            </span>

            {showCountryDropdown && (
              <div className="absolute top-10 left-0 bg-white shadow-md rounded w-48 z-50 border max-h-60 overflow-auto">
                {countries.map((c) => (
                  <div
                    key={c.code}
                    onClick={() => {
                      setCountryCode(c.code);
                      setShowCountryDropdown(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {c.name} ({c.code})
                  </div>
                ))}
              </div>
            )}

            <input
              maxLength={15}
              ref={phoneRef}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, ""));
                setErrors((prev) => ({ ...prev, phone: "" }));
              }}
              placeholder="Enter Phone Number"
              className="flex-1 outline-none font-semibold"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mb-4">{errors.phone}</p>}

          {/* OTP */}
          <label className="text-xs text-gray-500 mb-1 block">OTP</label>
          <div className="flex items-center border-b pb-4 mb-2">
            <input
              maxLength={4}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setErrors((prev) => ({ ...prev, otp: "" }));
              }}
              placeholder="Enter OTP"
              className="flex-1 outline-none font-semibold"
            />
            <button
              onClick={handleSendOtp}
              className="text-xs px-3 py-1 bg-gray-200 rounded ml-2"
            >
              {timer > 0 ? `${timer}s` : otpLoading ? "Sending..." : "GET OTP"}
            </button>
          </div>
          {errors.otp && <p className="text-red-500 text-xs mb-4">{errors.otp}</p>}

          {/* EMAIL */}
          <label className="text-xs text-gray-500 mb-1 block">Email</label>
          <div className="border-b pb-4 mb-2">
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              placeholder="Enter Email"
              className="w-full outline-none font-semibold"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mb-4">{errors.email}</p>}

          {/* PASSWORD */}
          <label className="text-xs text-gray-500 mb-1 block">Password</label>
          <div className="flex items-center border-b pb-4 mb-2">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="Enter Password"
              className="flex-1 outline-none font-semibold"
            />
            <button onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mb-4">{errors.password}</p>
          )}

          {/* CONFIRM PASSWORD */}
          <label className="text-xs text-gray-500 mb-1 block">Confirm Password</label>
          <div className="flex items-center border-b pb-4 mb-2">
            <input
              type={showConfirmPass ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              placeholder="Confirm Password"
              className="flex-1 outline-none font-semibold"
            />
            <button onClick={() => setShowConfirmPass(!showConfirmPass)}>
              {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mb-4">{errors.confirmPassword}</p>
          )}

          {/* REFERRAL */}
          <label className="text-xs text-gray-500 mb-1 block">Referral Code</label>
          <div className="border-b pb-4 mb-8">
            <input
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              placeholder="Referral Code"
              className="w-full outline-none font-semibold"
            />
          </div>

          {/* CHECKBOXES */}
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              checked={ageConfirmed}
              onChange={() => {
                setAgeConfirmed(!ageConfirmed);
                setErrors((prev) => ({ ...prev, age: "" }));
              }}
              className="mr-2 accent-purple-500"
            />
            <span className="text-sm text-gray-600">I confirm I am 18+</span>
          </div>
          {errors.age && <p className="text-red-500 text-xs mb-2">{errors.age}</p>}

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              checked={allowNotifications}
              onChange={() => {
                setAllowNotifications(!allowNotifications);
                setErrors((prev) => ({ ...prev, notify: "" }));
              }}
              className="mr-2 accent-purple-500"
            />
            <span className="text-sm text-gray-600">
              Allow notifications for important updates
            </span>
          </div>
          {errors.notify && (
            <p className="text-red-500 text-xs mb-4">{errors.notify}</p>
          )}

          {/* SIGNUP */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className={`w-full py-3 rounded-full text-white ${isValid
              ? "bg-gradient-to-r from-purple-400 to-purple-600"
              : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            {loading ? "Please wait..." : "NEXT"}
          </button>

          {/* LOGIN */}
          <p className="text-center text-sm mt-5 text-gray-500">
            Already a user?{" "}
            <button onClick={() => navigate("/login")}>
              <span className="text-purple-600 font-medium">LOGIN</span>
            </button>
          </p>
        </div>
      </div>
      <div className="flex-1"></div>
    </div>
  );
}