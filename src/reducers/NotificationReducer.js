import { authAxios, endpoints } from "../configs/Apis";
import cookies from "react-cookies";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "like":
      return [
        ...state,
        ...action.payload,
      ];
    case "comment":
      return [
        ...state,
        ...action.payload,
      ];
    case "load":
      return [
        ...action.payload,
      ];
    case "out": 
      return null
    default:
      throw new Error("Lỗi");
  }

  return state;
};

export default notificationReducer;
