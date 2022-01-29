import RTCVideoSection from "../components/meeting/RTCVideoSection";
import RTCChatSection from "../components/meeting/RTCChatSection";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-regular-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Moment from "react-moment";
import { useEffect } from "react";

function MeetingPage() {
  const location = useLocation();
  const meetingId = location.state
    ? location.state.meetingId
    : location.pathname.replace(/\//g, "");

  const _handleCopy = (e) => {
    navigator.clipboard.writeText(meetingId);
    //window.location.protocol + "//" + window.location.host + location.pathname
    toast("Meeting URL copied to clipboard", {
      hideProgressBar: true,
      className: "font-medium",
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-start space-x-1.5">
        <h2 className="text-2xl font-semibold mb-4 just">
          Meeting ID: {meetingId}
        </h2>
        <button onClick={_handleCopy}>
          <FontAwesomeIcon icon={faClone} size={"lg"} />
        </button>
      </div>
      <div className="flex h-full w-full flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <RTCVideoSection meetingId={meetingId} />
        <RTCChatSection />
      </div>
    </>
  );
}
export default MeetingPage;
