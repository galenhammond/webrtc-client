import { useEffect, useState, createRef } from "react";
import Message from "./chat/Message";
import { prompt, dataChannel } from "../utils/SocketConnection";
import { AlwaysScrollToBottom } from "./chat/utils/AlwaysScrollToBottom";
import { useSelector, useDispatch } from "react-redux";
import { addToMessages } from "../redux/slices/MessageSlice";
import { selectMessages } from "../redux/slices/MessageSlice";
import { selectPrompt } from "../redux/slices/PromptSlice";

function RTCChatSection(props) {
  const messages = useSelector(selectMessages);
  const conversationPrompt = useSelector(selectPrompt);
  const dispatch = useDispatch();
  const chatBox = createRef();
  const [inputValue, setInputValue] = useState("");
  var sendQueue = [];

  const _handleSend = (e) => {
    if (!inputValue) return;
    const message = {
      payload: inputValue,
      origin: "LOCAL_USER",
      timestamp: Date.now(),
    };
    setInputValue("");
    dispatch(addToMessages(message));

    switch (dataChannel.readyState) {
      case "connecting":
        sendQueue.push(message);
        break;
      case "open":
        if (sendQueue) {
          sendQueue.forEach((message) => {
            dataChannel.send(message);
          });
          sendQueue = null;
        }
        dataChannel.send(JSON.stringify(message));
        break;
      default:
        console.log(dataChannel.readyState);
    }

    //chatBox.current.scrollIntoView({ behavior: "smooth" });
  };

  const _handleOnKeyDown = (e) => {
    if ((e.key === "Enter") | (e.keyCode === 13)) {
      _handleSend();
    }
  };

  return (
    <div className="flex flex-col w-full md:w-[25rem] max-h-full grow-0 space-y-4">
      <section className="h-[30vh] md:h-[72vh] flex flex-col border-slate-200 border-4 rounded-br-lg rounded-tl-2xl rounded-bl-2xl rounded-tr-lg">
        <Message type={"PROMPT"} message={{ payload: conversationPrompt }} />
        <section className="w-full h-full overflow-y-scroll overflow-x-hidden break-all rounded ">
          <ul ref={chatBox}>
            {messages.map((message, key) => (
              <Message key={key} message={message} type={message.origin} />
            ))}
            <AlwaysScrollToBottom />
          </ul>
        </section>
      </section>
      <input
        type="text"
        className="min-w-0 border-2 border-slate-6000  box-content px-3 py-1 bg-slate-100 rounded-2xl"
        value={inputValue}
        placeholder="Type here..."
        onChange={(e) => setInputValue(e.target.value)}
        onKeyUpCapture={_handleOnKeyDown}
      />
    </div>
  );
}

export default RTCChatSection;
