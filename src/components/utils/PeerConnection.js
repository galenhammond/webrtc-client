import {
  sendCandidateToRemotePeer,
  reconnectToServer,
} from "../utils/SocketConnection";
const { RTCPeerConnection } = window;

class PeerConnection {
  constructor() {
    this._peerConnection = null;
  }

  get connection() {
    return this._peerConnection;
  }

  set connection(x) {
    this._peerConnection = x;
  }

  newPeerConnection() {
    this._peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: ["turn:13.59.172.95:3478?transport=tcp"],
          username: process.env.REACT_APP_TURN_USERNAME,
          credential: process.env.REACT_APP_TURN_PASSWORD,
        },
      ],
    });
    this.addListenersForPeerConnection();
  }

  addListenersForPeerConnection() {
    this._peerConnection.addEventListener("connectionstatechange", (ev) => {
      console.log(this._peerConnection.connectionState);
    });

    this._peerConnection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        sendCandidateToRemotePeer(event.candidate);
      } else {
        /* there are no more candidates coming during this negotiation */
      }
    });

    this._peerConnection.oniceconnectionstatechange =
      this.handleICEConnectionStateChangeEvent;
  }

  handleICEConnectionStateChangeEvent(event) {
    switch (this._peerConnection.iceConnectionState) {
      case "closed": // This means connection is shut down and no longer handling requests.
        this.hangUpCall(); //Hangup instead of closevideo() because we want to record call end in db
        break;
      case "failed":
        this.checkStatePermanent("failed");
        this._peerConnection.restartIce();
        break;
      case "disconnected":
        this.checkStatePermanent("disconnected");
        break;
      default:
        // this.hangUpCall();
        break;
    }
  }

  customdelay = (ms) => new Promise((res) => setTimeout(res, ms));

  async checkStatePermanent(iceState) {
    this.videoReceivedBytetCount = 0;
    this.audioReceivedByteCount = 0;

    let firstFlag = await this.isPermanentDisconnect();

    await this.customdelay(2000);

    let secondFlag = await this.isPermanentDisconnect(); //Call this func again after 2 seconds to check whether data is still coming in.

    if (secondFlag) {
      //If permanent disconnect then we hangup i.e no audio/video is fllowing
      if (iceState == "disconnected") {
        this.hangUpCall(); //Hangup instead of closevideo() because we want to record call end in db
      }
    }
    if (!secondFlag) {
      //If temp failure then restart ice i.e audio/video is still flowing
      if (iceState == "failed") {
        this._peerConnection.restartIce();
      }
    }
  }

  videoReceivedBytetCount = 0;
  audioReceivedByteCount = 0;

  async isPermanentDisconnect() {
    var isPermanentDisconnectFlag = false;
    var videoIsAlive = false;
    var audioIsAlive = false;

    await this._peerConnection.getStats(null).then((stats) => {
      stats.forEach((report) => {
        if (
          report.type === "inbound-rtp" &&
          (report.kind === "audio" || report.kind === "video")
        ) {
          //check for inbound data only
          if (report.kind === "audio") {
            //Here we must compare previous data count with current
            if (report.bytesReceived > this.audioReceivedByteCount) {
              // If current count is greater than previous then that means data is flowing to other peer. So this disconnected or failed ICE state is temporary
              audioIsAlive = true;
            } else {
              audioIsAlive = false;
            }
            this.audioReceivedByteCount = report.bytesReceived;
          }
          if (report.kind === "video") {
            if (report.bytesReceived > this.videoReceivedBytetCount) {
              // If current count is greater than previous then that means data is flowing to other peer. So this disconnected or failed ICE state is temporary
              videoIsAlive = true;
            } else {
              videoIsAlive = false;
            }
            this.videoReceivedBytetCount = report.bytesReceived;
          }
          if (audioIsAlive || videoIsAlive) {
            //either audio or video is being recieved.
            isPermanentDisconnectFlag = false; //Disconnected is temp
          } else {
            isPermanentDisconnectFlag = true;
          }
        }
      });
    });

    return isPermanentDisconnectFlag;
  }

  hangUpCall() {
    this._peerConnection.close();
    this._peerConnection = null;
    reconnectToServer();
  }
}

export default new PeerConnection();
