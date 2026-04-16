import API from "../api/api";

export const getkeralaLottery = async (data) =>
    { try { const responce = await API.post("?url=get-game-lottery",data) 
    return responce.data 
} catch (error) 
    { console.error("getkerala-lottery error",error) } }
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
    console.log("getbettinglist error",err)
    throw err;
  }
};