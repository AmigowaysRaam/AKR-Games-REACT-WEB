import API from "../api/api";
export const getThreeDigitGame = async (data) => {
  try {
    const response = await API.post("?url=get-threedigit-game", data);
    return response.data;
  } catch (error) {
    console.error("getThreeDigitGame error", error);
    return { success: false };
  }
};
export const getkeralaLottery = async (data) => {
  try {
    const responce = await API.post("?url=get-game-lottery", data)
    return responce.data
  } catch (error) { console.error("getkerala-lottery error", error) }
}
export const generateTickets = async (data) => {
  try {
    console.log("👉 API PAYLOAD:", data);

    const response = await API.post("?url=generate-tickets", data);

    return response.data;

  } catch (error) {
    console.error("generateTickets error", error);
    return { success: false };
  }
};

export const deleteTicket = async (data) => {
  try {
    const response = await API.post("?url=ticket/delete", data);
    return response.data;
  } catch (error) {
    console.error("delete ticket error", error);
  }
};

export const createBet = async (data) => {
  try {
    console.log("👉 CREATE BET PAYLOAD:", data);

    const response = await API.post("?url=bet/create", data);

    return response.data;

  } catch (error) {
    console.error("createBet error", error);
    return { success: false };
  }
};

export const getBettingList = async (data) => {
  try {
    const res = await API.post("?url=betting-list", data);
    return res.data;
  } catch (err) {
    console.log("getbettinglist error", err)
    throw err;
  }
};

export const getDiceGame = async (data) => {
  try {
    const response = await API.post("?url=get-dice-game", data);
    return response.data;
  } catch (error) {
    console.error("getGame error", error);
    return { success: false };
  }
};

export const placeThreeDigitBet = async (data) => {
  try {
    const res = await API.post("?url=place-threedigit-bet", data);
    return res.data;
  } catch (error) {
    console.log("placebeterror", error)
  }
}

export const getDiceHistory = async ({ key, limit = 10, page = 1 }) => {
  try {
    const res = await API.post("?url=get-dice-history", {
      key,
      limit,
      page
    });

    return res.data;
  } catch (err) {
    console.error("History API error:", err);
    return null;
  }
};

export const getCategoryDesc = async (payload) => {
  try {
    const res = await API.post("?url=cat-desc", payload);
    return res.data;
  } catch (err) {
    console.error("cat-desc error", err);
    return null;
  }
};
export const getAllLotteryResults = async (data) => {
  try {
    const response = await API.post("?url=getall-lottery-results", data);
    return response.data;
  } catch (error) {
    console.error("getGame error", error);
    return { success: false };
  }
};

export const getLotteryDetails = async (data) => {
  try {
    const response = await API.post("?url=get-lottery-details", data);
    return response.data;
  } catch (error) {
    console.error("getLotteryDetails error", error);
    return { success: false };
  }
};

export const placeDiceBet = async (data) => {
  try {
    console.log("👉 PLACE DICE BET PAYLOAD:", data);

    const response = await API.post("?url=place-dice-bet", data);

    return response.data;

  } catch (error) {
    console.error("placeDiceBet error", error);
    return { success: false };
  }
};

export const getUserBets = async (data) => {
  try {
    const res = await API.post("?url=get-user-bets", data);
    return res.data;
  } catch (error) {
    console.error("getUserBets error", error);
    return { success: false };
  }
};

export const getThreeDigitBets = async (data) => {
  try {
    console.log("👉 GET 3D BETS PAYLOAD:", data);

    const res = await API.post("?url=user-threedigit-betting-deatils", data);

    return res.data;
  } catch (error) {
    console.error("getThreeDigitBets error", error);
    return { success: false };
  }
};

export const getColorGame = async (data) => {
  try {
    const res = await API.post("?url=color-get-game", data);
    return res.data;
  } catch (error) {
    console.error("getColorGame error", error);
    return { success: false };
  }
};

export const getColorHistory = async (payload) => {
  try {
    const res = await API.post("?url=color-get-history", payload);
    return res.data;
  } catch (err) {
    console.error("getColorHistory error", err);
    return null;
  }
};
export const placeColorBet = async (data) => {
  try {
    console.log("👉 PLACE COLOR BET PAYLOAD:", data);

    const res = await API.post("?url=color-place-bet", data);

    return res.data;

  } catch (error) {
    console.error("placeColorBet error", error);
    return { success: false };
  }
};

export const getColorUserBets = async (data) => {
  try {
    console.log("👉 COLOR USER BETS PAYLOAD:", data);

    const res = await API.post("?url=color-get-user-bets", data);

    return res.data;
  } catch (error) {
    console.error("getColorUserBets error", error);
    return { success: false };
  }
};