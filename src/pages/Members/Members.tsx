import TigerImg from "assets/Tiger.png";
import PhotoGallery from "components/templates/PhotoGallery";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { authActions } from "redux/slices/auth";
import { backgroundActions } from "redux/slices/background";
import { messageActions } from "redux/slices/message";
import { tabActions } from "redux/slices/tab";
import AuthService from "services/auth.service";
import UsersService from "services/users.service";

export default function Members() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<number>();
  const authUser = useAppSelector((state) => state.auth.user);
  const tab = useAppSelector((state) => state.auth.tab);
  const online = useAppSelector((state) => state.auth.online);
  const users = useAppSelector((state) => state.user.users);
  useEffect(() => {
    UsersService.getUsers();
  }, []);

  if (!authUser && (tab === "online" || tab === "friends")) return <></>;

  return (
    <div>
      <ul className="members-list">
        {(tab !== "friends" ? users : authUser?.friends).map(
          (user: any, index: number) => {
            if (tab === "online") {
              if (!online.includes(user._id)) return <></>;
            }
            return (
              <li
                className={`${selected === index ? "active" : ""} ${
                  user?.role === "admin" ? "admin-member" : ""
                }`}
                key={index}
              >
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => {
                    if (authUser) {
                      if (authUser?._id !== user?._id) {
                        navigate("/");
                        dispatch(tabActions.setTab("chat"));
                        dispatch(messageActions.setMessages([]));
                        dispatch(messageActions.setMessages([]));
                        AuthService.addFriend(user, dispatch);
                        dispatch(authActions.setChat(user));
                        setSelected(index);
                      }
                    }
                  }}
                >
                  <div className="profile-image-list">
                    <PhotoGallery
                      group="user"
                      image={
                        user?.profile_picture
                          ? `${process.env.REACT_APP_FILE_URL}/${user?.profile_picture}`
                          : TigerImg
                      }
                    ></PhotoGallery>
                  </div>
                  {/* <img
                src={
                  user?.profile_picture
                    ? `${process.env.REACT_APP_FILE_URL}/${user?.profile_picture}`
                    : TigerImg
                }
                alt="User"
              /> */}
                  <p style={{ textTransform: "capitalize" }}>{user.name}</p>
                </div>
                <Link
                  to={`/profile/${user._id}`}
                  onClick={() => {
                    dispatch(tabActions.setTab("user"));
                    dispatch(backgroundActions.setBgType("private"));
                  }}
                  style={{
                    color: "#ffffff",
                    textTransform: "capitalize",
                    textDecoration: "none",
                    fontSize: "16px",
                    fontFamily: "'Varela Round', sans-serif",
                  }}
                >
                  {user.race}
                </Link>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}
