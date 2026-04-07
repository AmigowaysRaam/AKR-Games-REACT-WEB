import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { fetchCountryCodeFromIP } from "../utils/fetchCountry";
import { getOtpLogin, loginUser } from "../services/authService";
export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("otp");
  const navigate = useNavigate();
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const otpRef = useRef(null);
  const [phone, setPhone] = useState("9876543110");
  const [password, setPassword] = useState("test123");
  const [otp, setOtp] = useState("1234");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const [timer, setTimer] = useState(0);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 2500);
  };
  const countries = [
    { name: "India", code: "+91", flag: "🇮🇳" },
    { name: "Pakistan", code: "+92", flag: "🇵🇰" },
    { name: "Bangladesh", code: "+880", flag: "🇧🇩" },
    { name: "Malaysia", code: "+60", flag: "🇲🇾" },
    { name: "Singapore", code: "+65", flag: "🇸🇬" },
    { name: "Turkey", code: "+90", flag: "🇹🇷" },
    { name: "Russia", code: "+7", flag: "🇷🇺" },
    { name: "South Africa", code: "+27", flag: "🇿🇦" },
  ];
  const countryMap = {
    IN: "+91", PK: "+92",
    BD: "+880", MY: "+60", SG: "+65", TR: "+90", RU: "+7",
    ZA: "+27",
  };
  useEffect(() => {
    const getCountry = async () => {
      try {
        const country = await fetchCountryCodeFromIP();
        setCountryCode(countryMap[country] || "+91");
      } catch {
        setCountryCode("+91");
      }
    };
    getCountry();
  }, []);
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);
  const validate = () => {
    let err = {};
    if (!phone || phone.length < 10) {
      err.phone = "Enter valid phone number";
      phoneRef.current?.focus();
    } else if (activeTab === "password" && !password) {
      err.password = "Password required";
      passwordRef.current?.focus();
    } else if (activeTab === "otp" && (!otp || otp.length < 4)) {
      err.otp = "Enter valid OTP";
      otpRef.current?.focus();
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleGetOtpLogin = async () => {
    if (!phone || phone.length < 10) {
      setErrors({ phone: "Enter valid phone number" });
      phoneRef.current?.focus();
      return;
    }
    try {
      setLoading(true);
      const res = await getOtpLogin(phone, countryCode, "login");
      if (res) {
        showToast(res?.message || "OTP Sent");
        setTimer(30);
      } else {
        showToast("OTP failed", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await loginUser(
        phone,
        password,
        activeTab,
        otp, countryCode,
      );
      console?.log(res, "resresres")
      if (res?.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("wallet", res.user.wallet);
        showToast("Login successful");
        navigate("/");
      } else {
        showToast("Invalid login response", "error");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Login Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-[#e9eaee] overflow-hidden">
      {/* TOAST */}
      {toast.show && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`px-4 py-2 rounded-full text-white text-sm
            ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <div className="flex-1"></div>

      <div className="w-[420px] bg-white h-full flex flex-col relative">
        {/* HEADER */}
        <div className="h-[50px] flex items-center px-4 border-b relative">
          <button onClick={() => navigate("/")}>
            <ChevronLeft size={24} />
          </button>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-sm font-bold">
            LOGIN
          </h2>
        </div>
        <div className="flex-1 px-6 pt-1">
          {/* Tabs */}
          <div className="relative flex mb-8  py-2">
            {/* Animated Slider */}
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-sm bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-400`}
              style={{
                transform:
                  activeTab === "password"
                    ? "translateX(0%)"
                    : "translateX(100%)",
              }}
            />
            {["password", "otp"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 py-2 text-sm font-bold z-10 transition-colors duration-300 ${activeTab === tab ? "text-white" : "text-gray-700"
                  }`}
              >
                {tab === "password" ? "Password Login" : "OTP Login"}
              </button>
            ))}
          </div>
          <div className="mb-4 relative">
            <p className="text-gray-500 text-md">
              {'Enter Phone'}
            </p>
            <div className="flex items-center border-b pb-2 ">
              <span
                className="mr-2 cursor-pointer bg-blue-200 px-2 py-1 rounded text-sm"
                onClick={() =>
                  setShowCountryDropdown(!showCountryDropdown)
                }
              >
                {countryCode}
              </span>

              {/* DROPDOWN */}
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
                ref={phoneRef}
                maxLength={15}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, ""));
                  setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="Enter Phone"
                className="flex-1 outline-none p-2"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          {activeTab === "password" && (
            <div className="mb-4">
              <p className="text-gray-500 text-md">
                {'Enter Password'}
              </p>
              <div className="flex border-b pb-2">
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      password: "",
                    }));
                  }}
                  placeholder="Password"
                  className="flex-1 outline-none p-2"
                />
                <button onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password}
                </p>
              )}
            </div>
          )}

          {/* OTP */}
          {activeTab === "otp" && (
            <div className="mb-4">
              <p className="text-gray-500 text-md">
                {'Enter OTP'}
              </p>
              <div className="flex border-b pb-2 items-center">

                <input
                  ref={otpRef}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    setErrors((prev) => ({ ...prev, otp: "" }));
                  }}
                  maxLength={4}
                  placeholder="Enter OTP"
                  className="flex-1 outline-none p-2"
                />
                <button
                  disabled={timer > 0}
                  onClick={handleGetOtpLogin}
                  className={`ml-2 text-xs px-3 py-1 rounded
                  ${timer > 0 ? "bg-gray-300" : "bg-gray-200"}`}
                >
                  {timer > 0 ? `Resend (${timer}s)` : "GET OTP"}
                </button>
              </div>
              {errors.otp && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.otp}
                </p>
              )}
            </div>
          )}

          {/* FORGOT */}
          <div
            onClick={() => navigate("/ForgetPassword")}
            className="text-center mb-6"
          >
            <button className="text-md text-purple-500">
              Forgot password?
            </button>
          </div>

          {/* LOGIN */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-full text-white bg-purple-500"
          >
            {loading ? "Processing..." : "LOGIN"}
          </button>

          {/* SIGNUP */}
          <p className="text-center text-sm mt-4">
            Need account?{" "}
            <span
              onClick={() => navigate("/Sign")}
              className="text-purple-600"
            >
              SIGN UP
            </span>
          </p>
        </div>
      </div>

      <div className="flex-1"></div>
    </div>
  );
}