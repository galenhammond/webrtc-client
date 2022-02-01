import { useEffect, createRef, Fragment, compm } from "react";
import {
  sendWebRTCRequest,
  requestPromptFromServer,
} from "../utils/SocketConnection";
import pc from "../utils/PeerConnection";
import { useNavigate } from "react-router-dom";

function RTCVideoSection({ meetingId }) {
  const navigate = useNavigate();
  const localStreamRef = createRef();
  const remoteStreamRef = createRef();

  const _hangUpCall = (e) => {
    navigate("/");
  };

  useEffect(() => {
    //if (!peerConnection) return;
    async function getStream() {
      const streamConstraints = {
        video: {
          width: { min: 1280 },
          height: { min: 720 },
        },
        audio: true,
      };

      localStreamRef.current.srcObject = await navigator.mediaDevices
        .getUserMedia(streamConstraints)
        .catch((e) => console.error(e));
    }
    getStream().then(() => {
      sendWebRTCRequest(meetingId);
      localStreamRef.current.srcObject.getTracks().forEach((track) => {
        pc.connection.addTrack(track, localStreamRef.current.srcObject);
      });
      pc.connection.addEventListener("track", (ev) => {
        remoteStreamRef.current.srcObject = ev.streams[0];
      });
      remoteStream.current.volume = 1.0;
    });

    const localStream = localStreamRef.current;
    const remoteStream = remoteStreamRef.current;

    return () => {
      localStream.srcObject.getTracks().forEach((track) => {
        track.stop();
      });
      remoteStream.srcObject = null;
      pc.hangUpCall();
    };
  }, [localStreamRef, remoteStreamRef, meetingId]);

  return (
    <div className="flex flex-col space-y-5 h-full w-full">
      <section className="relative shadow-2xl">
        <video
          poster={
            "https://thumbs.gfycat.com/AfraidElementaryCowrie-max-1mb.gif"
          }
          autoPlay
          playsInline
          ref={remoteStreamRef}
          className="bg-black w-screen md:w-full md:max-h-[32rem] object-contain rounded-xl scale-x-[-1]"
        />
        <video
          muted
          autoPlay
          playsInline
          ref={localStreamRef}
          className="rounded-xl absolute w-2/6 max-h-full top-0 right-0 object-contain scale-x-[-1]"
        />
      </section>
      <div className="space-x-4">
        <button
          className="items-center font-medium border-2 rounded px-2 py-1 hover:bg-slate-100"
          onClick={requestPromptFromServer}
        >
          Report
        </button>
        <button
          className="bg-red-500 text-white items-center font-medium rounded px-2 py-1 hover:bg-red-700"
          onClick={_hangUpCall}
        >
          End Meeting
        </button>
      </div>
    </div>
  );
}

export default RTCVideoSection;
