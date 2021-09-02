import { useTheme } from "@material-ui/styles";
import React, { FC, memo } from "react";
import { useSelector } from "react-redux";
import ChatBoxComponent from "../../Component/ChatBoxComponent";
import { RootStore } from "../../Services/Store";
import { ChatFooterUi } from "./FooterUi";
interface IFooter {}

const Footer: FC<IFooter> = memo(() => {
  const theme = useTheme();
  const chat_boxes = useSelector(
    (store: RootStore) => store.ChatReducer.chat_boxes
  );

  console.log(`chat_boxes`, chat_boxes);
  return (
    <>
      <ChatFooterUi theme={theme}>
        {chat_boxes?.map((r, i) => (
          <ChatBoxComponent chat_box={r} key={i} index={i} />
        ))}
      </ChatFooterUi>
    </>
  );
});

export default Footer;
