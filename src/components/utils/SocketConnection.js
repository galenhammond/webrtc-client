import io from "socket.io-client";
import pc from "./PeerConnection";
import { addToMessages, clearMessages } from "../redux/slices/MessageSlice";
import GlobalStore from "../redux/Store";
import { clearPrompt, usePrompt } from "../redux/slices/PromptSlice";

const endpoint = process.env.REACT_APP_SERVER_ENDPOINT;
const socket = io(endpoint);

var USERLIST = [];

export var prompt = "";
export var dataChannel = null;

/* function addIceCandidates() {
  iceCandidates.forEach((candidate) => {
    peerConnection.addIceCandidate(candidate);
  });
} */

export function sendOfferToServer(offer, origin) {
  socket.emit("call-user", {
    offer: offer,
    to: origin,
  });
  console.log("Offer sent");
}

export function sendMessageToMeeting(message) {
  if (!message.payload | !message.sender) return;
  socket.emit("send-message", message);
}

export function requestPromptFromServer() {
  socket.emit("request-prompt");
  console.log("Requested prompt from server");
}

export function sendWebRTCRequest(meetingId) {
  pc.newPeerConnection();
  console.log(pc.connection);
  socket.emit("webrtc-request", { meetingId: meetingId });
  console.log("Communication request sent to signalling server");
}

export function sendCandidateToRemotePeer(candidate) {
  USERLIST.filter((uid) => uid !== socket.id).forEach((user) => {
    socket.emit("new-ice-candidate", {
      candidate: candidate,
      to: user,
    });
  });
  console.log("Ice candidate sent");
}

export function reconnectToServer() {
  GlobalStore.dispatch(clearMessages());
  GlobalStore.dispatch(clearPrompt());
  socket.disconnect();
  socket.connect();
}

socket.on("webrtc-request", (data) => {
  dataChannel = pc.connection.createDataChannel("dataChannel");
  dataChannel.onopen = (event) => {
    console.log("Datachannel connected");
  };
  dataChannel.onmessage = (event) => {
    const message = JSON.parse(event.data);
    GlobalStore.dispatch(
      addToMessages({
        payload: message.payload,
        origin: "REMOTE_USER",
        timestamp: message.timestamp,
      })
    );
  };

  pc._peerConnection
    .createOffer({ iceRestart: true })
    .then((offer) => pc.connection.setLocalDescription(offer))
    .then(() => sendOfferToServer(pc.connection.localDescription, data.to))
    //.then(() => initializeOffererDataChannel())
    .catch((e) => console.log(e));
});

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("new-prompt", (data) => {
  GlobalStore.dispatch(usePrompt(data.prompt));
  console.log("Prompt received");
});

socket.on("call-made", (data) => {
  console.log("Offer received from " + data.socket);
  pc.connection.ondatachannel = (event) => {
    dataChannel = event.channel;
    dataChannel.onopen = (event) => {
      console.log("Datachannel connected");
    };
    dataChannel.onmessage = (event) => {
      const message = JSON.parse(event.data);
      GlobalStore.dispatch(
        addToMessages({
          payload: message.payload,
          origin: "REMOTE_USER",
          timestamp: message.timestamp,
        })
      );
    };
  };

  pc.connection
    .setRemoteDescription(data.offer)
    .then(() => pc.connection.createAnswer())
    .then((answer) => pc.connection.setLocalDescription(answer))
    .then(() => {
      socket.emit("make-answer", {
        answer: pc.connection.localDescription,
        to: data.socket,
      });
      console.log("Answer sent");
      requestPromptFromServer();
    })
    .catch((e) => console.error(e));
});

socket.on("update-user-list", (data) => {
  USERLIST = data.users;
});

socket.on("answer-made", (data) => {
  pc.connection.setRemoteDescription(data.answer);
  requestPromptFromServer();
});

socket.on("new-ice-candidate", (data) => {
  pc.connection
    .addIceCandidate(data.candidate)
    .then(() => console.log("ice-candidates added"))
    .catch((e) => console.error(e));
});

export default socket;
