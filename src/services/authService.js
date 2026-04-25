import API from "../api/api";
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

export const getWithdrawOtpLogin = async (phone, countryCode, flag, bId, amount) => {
  try {
    const response = await API.post("?url=send-withdraw-otp", {
      "amount": amount,
      "bank_id": bId
    });
    return response.data;
  } catch (error) {
    console.error("OTP Error:", error.response?.data || error.message);
    throw error;
  }
};
export const verifyOtp = async (data) => {
  try {
    const response = await API.post("?url=verify-otp", data);
    return response.data;
  } catch (error) {
    console.error("OTP Error:", error.response?.data || error.message);
    throw error;
  }
};
export const resetPassword = async (data) => {
  try {
    const response = await API.post("?url=reset-password", data);
    return response.data;
  } catch (error) {
    console.error("OTP Error:", error.response?.data || error.message);
    throw error;
  }
};
export const changepassword = async (data) => {
  try {
    const response = await API.post("?url=change-password", data);
    return response.data;
  } catch (error) {
    console.error("OTP Error:", error.response?.data || error.message);
    throw error;
  }
};
export const logoutUser = () => {
  localStorage.removeItem("token");
};
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
export const homeApi = async () => {
  try {
    const response = await API.post("?url=home-api");
    console.log(response, "home data in service");
    return response.data;
  } catch (error) {
    console.error("Home API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getTopBarList = async () => {
  try {
    const response = await API.post("?url=header-menu");
    console.log(response.data, "home data in service");
    return response.data;
  } catch (error) {
    console.error("Home API Error:", error.response?.data || error.message);
    throw error;
  }
};

// 
export const checkMaintaince = async (data) => {
  try {
    const response = await API.post("?url=get-settings", data);
    console.log(response.data, "maintenanceCheck data in service");
    return response.data;
  } catch (error) {
    console.error("Home API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchUser = async (data) => {
  try {
    const response = await API.post("?url=get-profile", data);
    return response.data;
  } catch (error) {
    console.error("Home API Error:", error.response?.data || error.message);
    throw error;
  }
};


export const rechargeCall = async (data) => {
  try {
    const response = await API.post("?url=create-recharge", data);
    return response.data;
  } catch (error) {
    console.error("create-recharge API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getrechargeDetailsCall = async (data) => {
  try {
    const response = await API.post("?url=recharge-details-full", data);
    return response.data;
  } catch (error) {
    console.error("create-recharge API Error:", error.response?.data || error.message);
    throw error;
  }
};

// getRulesDataINvite
export const getRulesDataINvite = async (data) => {
  try {
    const response = await API.post("?url=referral-rules", data);
    return response.data;
  } catch (error) {
    console.error("create-recharge API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getEarningDetails = async (data) => {
  try {
    const response = await API.post("?url=earning-detail", data);
    return response.data;
  } catch (error) {
    console.error("create-recharge API Error:", error.response?.data || error.message);
    throw error;
  }
};

// getmeetthreeDetails
export const getmeetthreeDetails = async (data) => {
  try {
    const response = await API.post("?url=special-recharge-details", data);
    return response.data;
  } catch (error) {
    console.error("getmeetthreeDetails-recharge API Error:", error.response?.data || error.message);
    throw error;
  }
};
// reset-referral-code
export const handleResetLinkApi = async (data) => {
  try {
    const response = await API.post("?url=reset-referral-code", data);
    return response.data;
  } catch (error) {
    console.error("getmeetthreeDetails API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getLangList = async (data) => {
  try {
    const response = await API.post("?url=languages", data);
    return response.data;
  } catch (error) {
    console.error("create-getLangList API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getJackPotData = async (data) => {
  try {
    const response = await API.post("?url=jackpot-summary", data);
    return response.data;
  } catch (error) {
    console.error("create-getLangList API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getBottomMenu = async (data) => {
  try {
    const response = await API.post("?url=footer-menu", data);
    return response.data;
  } catch (error) {
    console.error("create-getBottomMenu API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getSpinDetails = async (data) => {
  try {
    const response = await API.post("?url=spin", data);
    return response.data;
  } catch (error) {
    console.error("create-getSpinDetails API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const getSpinResultData = async (data) => {
  try {
    const response = await API.post("?url=spinplay", data);
    return response.data;
  } catch (error) {
    console.error("create-spinresult API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getBuySpin = async (data) => {
  try {
    const response = await API.post("?url=spinbuy", data);
    return response.data;
  } catch (error) {
    console.error("create-getBuySpin API Error:", error.response?.data || error.message);
    throw error;
  }
};

// addBankAccont
export const addBankAccont = async (data) => {
  try {
    const response = await API.post("?url=add-bank-account", data);
    return response.data;
  } catch (error) {
    // console.error("create-recharge API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateBankAccont = async (data) => {
  try {
    const response = await API.post("?url=update-bank-account", data);
    return response.data;
  } catch (error) {
    console.error("create-updateBankAccont API Error:", error.response?.data || error.message);
    throw error;
  }
};

// removeBankId
export const removeBankId = async (data) => {
  try {
    const response = await API.post("?url=delete-bank-account", data);
    return response.data;
  } catch (error) {
    console.error("create-removeBankId API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getWithdrawApi = async (data) => {
  try {
    const response = await API.post("?url=withdraw-details", data);
    return response.data;
  } catch (error) {
    console.error("create-getWithdrawApi API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const withdrawCreate = async (data) => {
  try {
    const response = await API.post("?url=withdraw-request", data);
    return response.data;
  } catch (error) {
    console.error("create-withdrawCreate API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getWithdraWList = async (data) => {
  try {
    const response = await API.post("?url=withdraw-history", data);
    return response.data;
  } catch (error) {
    console.error("create-getWithdraWList API Error:", error.response?.data || error.message);
    throw error;
  }
};


export const getBOnusHistory = async (data) => {
  try {
    const response = await API.post("?url=bonus-history", data);
    return response.data;
  } catch (error) {
    console.error("create-getBOnusHistory API Error:", error.response?.data || error.message);
    throw error;
  }
};
// getScratchData

export const getScratchData = async (data) => {
  try {
    const response = await API.post("?url=scratchui", data);
    return response.data;
  } catch (error) {
    console.error("create-getBOnusHistory API Error:", error.response?.data || error.message);
    throw error;
  }
};

// getInviteRecords
export const getPlayResult = async (data) => {
  try {
    const response = await API.post("?url=scratchplay", data);
    return response.data;
  } catch (error) {
    console.error("create-getPlayResult API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getInviteRecords = async (data) => {
  try {
    const response = await API.post("?url=invitation-records", data);
    return response.data;
  } catch (error) {
    console.error("getInviteRecords API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getCodeRedeem = async (data) => {
  try {
    const response = await API.post("?url=giftredeem", data);
    return response.data;
  } catch (error) {
    console.error("create-getCodeRedeem API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getSideBarMenu = async (data) => {
  try {
    const response = await API.post("?url=sidebar-menu", data);
    return response.data;
  } catch (error) {
    console.error("create-getSideBarMenu API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getNotificationList = async (data) => {
  try {
    const response = await API.post("?url=notifications", data);
    return response.data;
  } catch (error) {
    console.error("create-getNotificationList API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getRechargeHist = async (data) => {
  try {
    const response = await API.post("?url=recharge-history", data);
    // alert(JSON.stringify(response));
    return response.data;
  } catch (error) {
    console.error("create-getRechargeHist API Error:", error.response?.data || error.message);
    throw error;
  }
};

// getPromoList
export const getPromoList = async (data) => {
  try {
    const response = await API.post("?url=promotion-list", data);
    return response.data;
  } catch (error) {
    console.error("create-getPromoList API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getCheckIndata = async (data) => {
  try {
    const response = await API.post("?url=checkin-details", data);
    return response.data;
  } catch (error) {
    console.error("create-getCheckIndata API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getTransactionHist = async (data) => {
  try {
    const response = await API.post("?url=transaction-history", data);
    return response.data;
  } catch (error) {
    console.error("create-getTransactionHist API Error:", error.response?.data || error.message);
    throw error;
  }
};

// getBonusDataList
export const getBonusDataList = async (data) => {
  try {
    const response = await API.post("?url=bonus-list", data);
    return response.data;
  } catch (error) {
    console.error("create-getBonusDataList API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const claimTaskBonus = async (data) => {
  try {
    const response = await API.post("?url=bonus-claim", data);
    return response.data;
  } catch (error) {
    console.error("create-claimTaskBonus API Error:", error.response?.data || error.message);
    throw error;
  }
};
export const getResultHistory = async (data) => {
  try {
    const response = await API.post("?url=result", data);
    return response.data;
  } catch (error) {
    console.error("create-recharge API Error:", error.response?.data || error.message);
    throw error;
  }
};

// bets-tab
export const getBetTabHistory = async (data) => {
  try {
    const response = await API.post("?url=bets-tab", data);
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

export const getRechargeList = async (data) => {
  try {
    const response = await API.post("?url=vip-list", { data });
    return response.data;
  } catch (error) {
    console.error("Recharge Error:", error.response?.data || error.message);
    throw error;
  }
};
// getBankAccountList
export const getBankAccountList = async (data) => {
  try {
    const response = await API.post("?url=get-bank-accounts", data);
    return response.data;
  } catch (error) {
    console.error("create-recharge API Error:", error.response?.data || error.message);
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