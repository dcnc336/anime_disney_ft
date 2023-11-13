import useAutosizeTextArea from "hooks/useAutosizeTextArea";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "redux/hooks";

export default function UpdateMessage(message: any) {
  const [value, setValue] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const updateMessage = (value: any) => {
    console.log({ value });
  };

  useAutosizeTextArea(textAreaRef.current, value);

  useEffect(() => {
    setValue(message);
  }, []);

  return (
    <textarea
      ref={textAreaRef}
      defaultValue={message.message}
      style={{
        width: "100%",
        resize: "none",
        background: "none",
        border: "none",
        fontSize: "16px",
        lineHeight: 1.4,
        wordBreak: "break-all",
        padding: 0,
      }}
      rows={1}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e: any) => {
        if (e.keyCode === 13 && !e.shiftKey) {
          e.preventDefault();
          if (user) {
            updateMessage(e.target.value);
          }
        }
      }}
    />
  );
}
