import API from "../api/api";

// ✅ LOGIN
export const loginUser = async (phone, password, activeTab, otp, countryCode) => {
  try {
    const response = await API.post("?url=login", {
      phone,
      password,
      flag: activeTab === "otp" ? "otp" : "password",
      otp,
      country_code: countryCode
    });
    console.log(response.data, "response in service");
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ REGISTER
export const getRegister = async (data) => {
  try {
    console?.log(data, "data in service");
    const response = await API.post("?url=register", data);
    return response.data;
  } catch (error) {
    console.error("Register Error:", error.response?.data || error.message);
    throw error;
  }
};
export const updateUserName = async (data) => {
  try {
    const response = await API.post("?url=update-profile", data);
    return response.data;
  } catch (error) {
    console.error("updateUserName Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getOtpLogin = async (phone, countryCode, flag) => {
  try {
    console.log(phone, countryCode, flag, "phone in service");
    const response = await API.post("?url=send-otp", {
      phone,
      flag,
      country_code: countryCode
    });
    return response.data;
  } catch (error) {
    console.error("OTP Error:", error.response?.data || error.message);
    throw error;
  }
};

// verifyOtp
export const verifyOtp = async (data) => {
  try {
    const response = await API.post("?url=verify-otp", data);
    return response.data;
  } catch (error) {
    console.error("OTP Error:", error.response?.data || error.message);
    throw error;
  }
};
// 
export const resetPassword = async (data) => {
  try {
    const response = await API.post("?url=reset-password", data);
    return response.data;
  } catch (error) {
    console.error("OTP Error:", error.response?.data || error.message);
    throw error;
  }
};

// Change passcode
export const changepassword = async (data) => {
  try {
    const response = await API.post("?url=change-password", data);
    return response.data;
  } catch (error) {
    console.error("OTP Error:", error.response?.data || error.message);
    throw error;
  }
};


// ✅ LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// ✅ AUTH CHECK
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// ✅ HOME
export const homeApi = async () => {
  try {
    const response = await API.post("?url=home");
    return response.data;
  } catch (error) {
    console.error("Home API Error:", error.response?.data || error.message);
    throw error;
  }
};
// rechargeCall
export const rechargeCall = async (data) => {
  try {
    const response = await API.post("?url=create-recharge", data);
    return response.data;
  } catch (error) {
    console.error("create-recharge API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getRechargeHist = async (data) => {
  try {
    const response = await API.post("?url=recharge-history", data);
    return response.data;
  } catch (error) {
    console.error("create-recharge API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getTransactionHist = async (data) => {
  try {
    const response = await API.post("?url=transaction-history", data);
    return response.data;
  } catch (error) {
    console.error("create-recharge API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getWalletSummary = async (data) => {
  try {
    const response = await API.post("?url=wallet-summary", data);
    return response.data;
  } catch (error) {
    console.error("create-recharge API Error:", error.response?.data || error.message);
    throw error;
  }
};


export const getRechargeList = async () => {
  try {
    const response = await API.post("?url=get-vipranks");
    return response.data;
  } catch (error) {
    console.error("Recharge Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getPopdata = async () => {
  try {
    const response = await API.post("?url=get-popup");
    return response.data;
  } catch (error) {
    console.error("Popup Error:", error.response?.data || error.message);
    throw error;
  }
};