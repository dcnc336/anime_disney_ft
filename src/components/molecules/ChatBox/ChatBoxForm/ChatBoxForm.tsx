import { Field, reduxForm } from "redux-form";
import { useAppSelector } from "redux/hooks";

function ChatBoxForm({ handleSubmit }: any) {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <form
      onSubmit={handleSubmit}
      className="form"
      style={{ alignItems: "stretch" }}
    >
      <Field
        type="text"
        name="message"
        placeholder={
          user ? "Message" : "Please login to enter message"
        }
        disabled={!user}
        component="textarea"
        rows={6}
        style={{
          width: "100%",
          margin: "0",
          background: "none",
          border: "2px solid #ffffff",
        }}
        onKeyDown={(e: any) => {
          if (e.keyCode === 13 && !e.shiftKey) {
            e.preventDefault();
            if (user) {
              handleSubmit();
            }
          }
        }}
      />
      <br />
      <button
        disabled={!user}
        type="submit"
        style={{
          cursor: "pointer",
          color: "white",
          padding: "18px 24px",
          background: "none",
          border: "2px solid #ffffff",
          borderLeft: 0,
        }}
      >
        Send
      </button>
    </form>
  );
}

export default reduxForm({ form: "ChatBoxForm" })(ChatBoxForm);
