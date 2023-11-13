import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "redux/hooks";
// import SailorA from "assets/Sailor Moon 1.png";
// import SailorB from "assets/Sailor Moon 2.png";
// import SailorC from "assets/Sailor Moon 3.png";
// import SailorD from "assets/Sailor Moon 4.png";
// import HarleyA from "assets/Harley Quinn 1.png";
// import HarleyB from "assets/Harley Quinn 2.png";
// import HarleyC from "assets/Harley Quinn 3.png";
// import HarleyD from "assets/Harley Quinn 4.png";
// import HarleyE from "assets/Harley Quinn 5.png";
// import HarleyF from "assets/Harley Quinn 6.png";
// import HarleyG from "assets/Harley Quinn 7.png";
// import HarleyH from "assets/Harley Quinn 8.png";

import MusicDropZone from "components/atoms/MusicDropZone";
import ImageService from "services/image.service";
import AuthService from "services/auth.service";
import { backgroundActions } from "redux/slices/background";
import SocketService from "services/socket.service";
import MessageService from "services/message.service";

export default function SailorMoon() {
  const dispatch = useAppDispatch();
  const { user, chat } = useAppSelector((state) => state.auth);
  const visitedUser = useAppSelector((state) => state.user.user);
  const { play, music, outfit, anime, bgType } = useAppSelector(
    (state) => state.background
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [anim, setAnim] = useState(anime);
  const [image, setImage] = useState(false);
  const [characterImage, setCharacterImage] = useState(1);
  // const [changeImage, setChangeImage] = useState(HarleyA);

  const [character, setCharacter] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAnim(anime);
  }, [anime]);

  useEffect(() => {
    setImage(outfit);
  }, [outfit]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      // Set the current time before playing
      audioRef.current.currentTime = currentTime;
      if (play) audioRef.current.play();
      else audioRef.current.pause();
    }
    // if (bgType === "public") {
    //   SocketService.musicState(true);
    // }
  }, [user?.music, music, bgType, visitedUser, play]);

  useEffect(() => {
    ImageService.getBgMusic(dispatch);
  }, []);

  const changeImageCharacter = () => {
    setCharacter(!character);

    // if (user) AuthService.outfit(image, dispatch);
    // else ImageService.outfit(image, dispatch);
  };

  const outfitChange = () => {
    setImage(!image);

    if (user) AuthService.outfit(image, dispatch);
    else ImageService.outfit(image, dispatch);
  };

  const handlePlay = () => {
    SocketService.musicState(true);
    setCurrentTime(audioRef?.current?.currentTime!);
  };

  const handlePause = () => {
    SocketService.musicState(false);
  };

  // useEffect(() => {
  //   const audio = audioRef.current;
  //   if (audio) {
  //     if (play) audio.play();
  //     else audio.pause();
  //   }
  // }, [play]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "32px",
        }}
      >
        <h2
          className="heading"
          onClick={() =>
            window.open("https://www.paypal.com/paypalme/DamianGower", "_blank")
          }
          style={{ cursor: "pointer", display: "inline", marginLeft: "32px" }}
        >
          Donate
        </h2>

        <h2
          className="heading"
          onClick={() => {
            if (chat) {
              MessageService.deleteAllPrivateChat(chat?._id, dispatch);
              SocketService.sendDeleteUserChat(user?.id, chat?._id);
            } else MessageService.deleteAllChat(dispatch);
          }}
          style={{ cursor: "pointer", display: "inline" }}
        >
          Delete
        </h2>
      </div>
      {/* <h3
        onClick={() => changeImageCharacter()}
        style={{
          fontFamily: "'Varela Round', sans-serif",
          fontSize: "16px",
          cursor: "pointer",
          maxWidth: "fit-content",
          margin: "auto",
        }}
      >
        {"Sailor Moon"}
      </h3>
      {music || user?.music ? (
        // character ? (
        //   <img
        //     alt="Harley Quinn"
        //     src={
        //       characterImage === 1
        //         ? !anim
        //           ? HarleyA
        //           : HarleyB
        //         : characterImage === 2
        //         ? !anim
        //           ? HarleyC
        //           : HarleyD
        //         : characterImage === 3
        //         ? !anim
        //           ? HarleyE
        //           : HarleyF
        //         : !anim
        //         ? HarleyG
        //         : HarleyH
        //     }
        //     onClick={() => {
        //       setCharacterImage((prev) =>
        //         prev === 1 ? 2 : prev === 2 ? 3 : prev === 3 ? 4 : 1
        //       );
        //     }}
        //   />
        // ) :
        anim ? (
          <img
            alt="Sailor Music B"
            src={image ? SailorB : SailorD}
            onClick={() => outfitChange()}
          />
        ) : (
          <img
            alt="Sailor Music A"
            src={image ? SailorA : SailorC}
            onClick={() => outfitChange()}
          />
        )
      ) : (
        <img
          alt="Sailor A"
          src={
            // character
            //   ? characterImage === 1
            //     ? HarleyA
            //     : characterImage === 2
            //     ? HarleyC
            //     : characterImage === 3
            //     ? HarleyE
            //     : HarleyG
            //   :
            image ? SailorA : SailorC
          }
          onClick={() => {
            character
              ? setCharacterImage((prev) =>
                  prev === 1 ? 2 : prev === 2 ? 3 : prev === 3 ? 4 : 1
                )
              : outfitChange();
          }}
        />
      )} */}
      <div>
        <audio
          controls
          loop
          ref={audioRef}
          onPlay={handlePlay}
          onPause={handlePause}
          // onLoad={handlePlay}
        >
          <source
            src={
              visitedUser
                ? `${process.env.REACT_APP_FILE_URL}/${
                    bgType === "private" ? visitedUser?.music : music
                  }`
                : user
                ? `${process.env.REACT_APP_FILE_URL}/${
                    bgType === "private" ? user?.music : music
                  }`
                : `${process.env.REACT_APP_FILE_URL}/${music}`
            }
            type="audio/mpeg"
          />
          Your browser does not support the audio element.
        </audio>
        <br />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
          }}
        >
          <button
            onClick={() => dispatch(backgroundActions.setBgType("public"))}
            style={{
              cursor: "pointer",
              border: 0,
              fontFamily: "'Varela Round', sans-serif",
              fontWeight: bgType === "public" ? 600 : 500,
              fontSize: "16px",
              background: "none",
              color: "white",
              padding: 0,
              marginBottom: "0.83em",
              userSelect: "text",
            }}
          >
            Public
          </button>
          <button
            onClick={() => {
              if (visitedUser || user)
                dispatch(backgroundActions.setBgType("private"));
            }}
            style={{
              cursor: user ? "pointer" : "auto",
              border: 0,
              fontFamily: "'Varela Round', sans-serif",
              fontWeight: bgType === "private" ? 600 : 500,
              fontSize: "16px",
              background: "none",
              color: "white",
              padding: 0,
              marginBottom: "0.83em",
              userSelect: "text",
            }}
          >
            Private
          </button>
        </div>
      </div>
      <div className="music-upload-box">
        <MusicDropZone musicType={bgType} />
      </div>
    </>
  );
}
