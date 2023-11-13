import { useAppDispatch, useAppSelector } from "redux/hooks";
// import { messageActions } from "redux/slices/message";
import ChatBoxForm from "./ChatBoxForm";
import { reset } from "redux-form";
import MessageService from "services/message.service";
import AuthService from "services/auth.service";

export default function ChatBox({ socket }: any) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const chat = useAppSelector((state) => state.auth.chat);
  // const chat = useAppSelector((state) => state.chat.chats);
  // const guest = useAppSelector((state) => state.user.user);
  const handleSubmit = (values: any) => {
    if (!values?.message) return;
    // if (values?.message.trim() && localStorage.getItem('email')) {
    //   socket.emit('message', {
    //     text: values?.message,
    //     name: localStorage.getItem('email'),
    //     id: `${socket.id}${Math.random()}`,
    //     socketID: socket.id,
    //   });
    // }
    // SocketService.send(values?.message, dispatch);
    if (chat) {
      let data = {
        from: user._id,
        to: chat._id,
        message: values?.message,
      };

      MessageService.addMessage(data, dispatch);

      socket.current.emit("send-msg", data);

      AuthService.relationship({ id: chat._id });
    } else {
      let new_user = { ...user };
      delete new_user.password;

      let data = {
        fromSelf: true,
        message: values?.message,
        p_user: new_user,
      };

      MessageService.addChat(data, dispatch);

      socket.current.emit("chat", data);
    }
    dispatch(reset("ChatBoxForm"));
  };

  return <ChatBoxForm onSubmit={handleSubmit} />;
}
