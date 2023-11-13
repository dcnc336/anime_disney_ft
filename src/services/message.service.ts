import http from "./http.service";
import Promisable from "./promisable.service";
import { AppDispatch } from "redux/store";
import { messageActions } from "redux/slices/message";
import SocketService from "./socket.service";

const MessageService = {
  addMessage: async (data: any, dispatch?: AppDispatch) => {
    http.setJWT();
    let localMessage = {
      fromSelf: true,
      message: data.message,
    };

    dispatch?.(messageActions.addMessage(localMessage));

    const [success, error]: any = await Promisable.asPromise(
      http.post("guest/addMsg", data)
    );

    // if (success) {
    //   const { message } = success.data.data;
    //   dispatch?.(messageActions.addMessage(message));
    // }

    return [success, error];
  },

  arrivedMessage: async (data: any, dispatch?: AppDispatch) => {
    dispatch?.(messageActions.addMessage(data));
  },

  getChat: async (dispatch?: AppDispatch) => {
    const [success, error]: any = await Promisable.asPromise(
      http.get("/guest/getChat")
    );

    if (success) {
      const { messages } = success.data.data;

      dispatch?.(messageActions.setMessages(messages));
    }

    return [success, error];
  },

  addChat: async (data: any, dispatch?: AppDispatch) => {
    http.setJWT();
    dispatch?.(messageActions.addMessage(data));
    let payload = { ...data };
    payload.p_user = data.p_user._id;
    const [success, error]: any = await Promisable.asPromise(
      http.post("/guest/addChat", data)
    );

    return [success, error];
  },

  getCurrentMessages: async (data: any, dispatch?: AppDispatch) => {
    let payload = {
      from: data.currentUser,
      to: data.currentChat,
    };
    const [success, error]: any = await Promisable.asPromise(
      http.post("/guest/getMsg", payload)
    );

    if (success) {
      const { messages } = success.data.data;

      dispatch?.(messageActions.setMessages(messages));
    }

    return [success, error];
  },

  deleteAllChat: async (dispatch?: AppDispatch) => {
    http.setJWT();

    const [success, error]: any = await Promisable.asPromise(
      http.delete("/guest/deleteAllChat")
    );

    if (success) {
      SocketService.sendDeleteChat();
      dispatch?.(messageActions.setMessages([]));
    }

    return [success, error];
  },

  deleteAllPrivateChat: async (value: any, dispatch?: AppDispatch) => {
    http.setJWT();
    let payload = {
      to: value,
    };
    const [success, error]: any = await Promisable.asPromise(
      http.post("/guest/deleteAllPrivateChat", payload)
    );

    if (success) {
      dispatch?.(messageActions.setMessages([]));
    }

    return [success, error];
  },
};

export default MessageService;
