import GuestIcon from "assets/Tiger.png";
import Friends from "components/templates/Friends/Friends";
import PhotoGallery from "components/templates/PhotoGallery/PhotoGallery";
import UpdateMessage from "components/templates/UpdateMessage/UpdateMessage";
import moment from "moment";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { authActions } from "redux/slices/auth";
import { backgroundActions } from "redux/slices/background";
import { messageActions } from "redux/slices/message";
import { tabActions } from "redux/slices/tab";
import AuthService from "services/auth.service";
import MessageService from "services/message.service";

export default function Chat() {
  const dispatch = useAppDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages } = useAppSelector((state) => state.message);
  const { user, chat, edit } = useAppSelector((state) => state.auth);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (user) {
      if (chat) {
        let data = {
          currentUser: user?._id,
          currentChat: chat?._id,
        };
        MessageService.getCurrentMessages(data, dispatch);
      } else {
        MessageService.getChat(dispatch);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat?._id, user]);

  const makeUrlsClickable = (message: any) => {
    const urlPattern = /(https?:\/\/\S+)/g;
    return message.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
  };
  return (
    <>
      {/* <h2 className="heading">Chat</h2> */}
      {/* ${user?.friends?.length > 0 ? "330.5px" : "295px"} */}

      <Friends />
      <div
        className="chat-big-box"
        style={{
          height: `calc( 100vh - 330px)`,

          overflowY: "auto",
          paddingRight: "5px",
          marginBottom: "5px",
        }}
      >
        {messages.map((message: any, index: any) => {
          if (
            (!chat && message?.type === "private") ||
            (chat && message?.type === "public")
          )
            return <></>;
          else
            return (
              <div className="chat-message" key={index} ref={scrollRef}>
                <div className="chat-user-data">
                  {/* <img
                    src={
                      chat
                        ? message.fromSelf
                          ? user?.profile_picture
                            ? `${process.env.REACT_APP_FILE_URL}/${user?.profile_picture}`
                            : GuestIcon
                          : chat?.profile_picture
                          ? `${process.env.REACT_APP_FILE_URL}/${chat?.profile_picture}`
                          : GuestIcon
                        : message?.p_user?.profile_picture
                        ? `${process.env.REACT_APP_FILE_URL}/${message?.p_user?.profile_picture}`
                        : GuestIcon
                    }
                    alt="Guest"
                  /> */}
                  <div
                    style={{
                      minWidth: "40px",
                      maxWidth: "40px",
                      cursor: "pointer",
                    }}
                  >
                    <PhotoGallery
                      group="no"
                      image={
                        chat
                          ? message.fromSelf
                            ? user?.profile_picture
                              ? `${process.env.REACT_APP_FILE_URL}/${user?.profile_picture}`
                              : GuestIcon
                            : chat?.profile_picture
                            ? `${process.env.REACT_APP_FILE_URL}/${chat?.profile_picture}`
                            : GuestIcon
                          : message?.p_user?.profile_picture
                          ? `${process.env.REACT_APP_FILE_URL}/${message?.p_user?.profile_picture}`
                          : GuestIcon
                      }
                    />
                  </div>
                  <p
                    style={{
                      textTransform: "capitalize",
                      paddingLeft: "4px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => {
                      if (user && !chat) {
                        if (user?._id !== message?.p_user?._id) {
                          dispatch(messageActions.setMessages([]));
                          AuthService.addFriend(message?.p_user, dispatch);
                          dispatch(authActions.setChat(message?.p_user));
                        }
                      }
                    }}
                  >
                    {chat
                      ? message.fromSelf
                        ? `${user?.name}`
                        : `${chat?.name}`
                      : `${message?.p_user?.name}`}
                  </p>
                </div>
                <div
                  className="bubble"
                  style={{ width: edit === index ? "100%" : "auto" }}
                >
                  <div className="bubble-inner">
                    <p style={{ textAlign: "right" }}>
                      <Link
                        to={`/profile/${
                          chat
                            ? message.fromSelf
                              ? user._id
                              : chat?._id
                            : message?.p_user?._id ?? message?.userId
                        }`}
                        onClick={() => {
                          dispatch(tabActions.setTab("user"));
                          dispatch(backgroundActions.setBgType("private"));
                        }}
                        style={{
                          color: "#ffffff",
                          textTransform: "capitalize",
                          textDecoration: "none",
                        }}
                      >
                        {chat
                          ? message.fromSelf
                            ? user?.race ?? "Human"
                            : chat?.race ?? "human"
                          : message?.p_user?.race ?? "human"}
                      </Link>
                    </p>
                    <div className="text-message">
                      {/* {edit === index ? (
                        <UpdateMessage message={message.message} />
                      ) : ( */}
                        <p
                          onClick={() =>
                            user?._id === message?.p_user?._id &&
                            dispatch(authActions.setEdit(index))
                          }
                          style={{ wordBreak: "break-all" }}
                          dangerouslySetInnerHTML={{
                            __html: makeUrlsClickable(message.message),
                          }}
                        ></p>
                      {/* )} */}
                    </div>
                    <div className="race-chat">
                      <p>
                        {moment(message.createdAt).format("h:mm a")}&nbsp;&nbsp;
                      </p>
                      <p>{moment(message.createdAt).format("DD/MM/yyyy")} </p>
                    </div>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </>
  );
}
