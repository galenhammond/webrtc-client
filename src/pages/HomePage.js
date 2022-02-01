import { lazy, useEffect, useState } from "react";
import image from "../assets/images/ola.png";
import { Link, useNavigate } from "react-router-dom";
import ShowcaseComponent from "../components/ShowcaseComponent";
import ReCAPTCHA from "react-google-recaptcha";

function HomePage(props) {
  const [meetingId, setMeetingId] = useState("");
  const [reCAPTCHA, setReCAPTCHA] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [errorState, setErrorState] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Mumbl, Share and Learn";
  }, []);

  const _handleSubmit = (e) => {
    const symbolFormat = /[ `! @#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const symbolError = symbolFormat.test(meetingId);
    if (symbolError) {
      setErrorState({
        error: true,
        message: "Meeting ID must not include special characters or spaces",
      });
      return;
    }
    if (meetingId.length > 10) {
      setErrorState({
        error: true,
        message: "Meeting ID must be between 1 and 10 characters",
      });
      return;
    }
    if (!meetingId) {
      return;
    }
    //setShowCaptcha(true);
    navigate(`/${meetingId}`, {
      state: {
        meetingId: meetingId,
      },
    });
  };

  const _handleOnKeyDown = (e) => {
    if ((e.key === "Enter") | (e.keyCode === 13)) {
      _handleSubmit();
    }
  };

  const _handleCaptcha = (value) => {
    setReCAPTCHA(value);
    if (!meetingId) {
      return;
    }
    navigate(`/${meetingId}`, {
      state: {
        meetingId: meetingId,
      },
    });
  };

  return (
    <>
      <ShowcaseComponent
        styles={"space-y-10 flex-col text-center items-center h-screen"}
        padded
      >
        {/*
      <h2 className="font-bold text-5xl">Your Personal Meeting Code is</h2>

      <div className="flex flex-row">
        <p className="font-semibold text-xl">{meetingId}</p>
        <Link to={`/${meetingId}`}>Start Meeting</Link>
      </div>
      */}
        <h2 className="max-w-max py-1 min-h-max font-bold text-5xl bg-gradient-to-r from-cyan-700 via-sky-500 to-blue-400 bg-clip-text text-transparent">
          Let's Have a Conversation.
        </h2>
        <div className="flex content-center justify-center space-x-4">
          <input
            className="box-content p-2 border-slate-300 rounded border-2"
            placeholder="Enter meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value.trim())}
            onKeyUpCapture={_handleOnKeyDown}
          />
          <button
            onClick={_handleSubmit}
            className="bg-cyan-700 flex text-white items-center font-medium shadow-md  hover:bg-cyan-800 rounded px-2 py-1"
          >
            Join Meeting
          </button>
        </div>
        {errorState && (
          <p className="text-base text-red-600">{errorState.message}</p>
        )}
        {showCaptcha && (
          <>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_API_KEY}
              onChange={_handleCaptcha}
            />
            <p>
              By joining this meeting, you agree to Mumbl's{" "}
              <Link to={"/"} className="text-blue-500">
                terms and conditions
              </Link>
            </p>
          </>
        )}
        <button className="text-base text-slate-800 rounded hover:shadow-2xl">
          Submitting a prompt? Click here
        </button>
      </ShowcaseComponent>
      <ShowcaseComponent styles={"md:flex-row flex-col"}>
        <section className="p-4 md:w-2/5 space-y-4 bg-cyan-800 rounded-t md:rounded-l ">
          <h2 className="text-4xl font-bold text-gray-50">
            Your security matters.
          </h2>
          <p className="text-gray-50 ">
            Mumbl takes care to make sure our meeting rooms are secure and
            anonymous. Meeting data is never shared or stored outside of your
            meetings particpants. Once your meeting is finished, it's gone
            forever. No cookies. No accounts. Nothing.
          </p>
        </section>
        <section className="grow flex bg-teal-50/50 rounded-b md:rounded-r h-fit w-fit justify-center ">
          <img src={image} alt="Man video-conferencing" className="h-80 w-80" />
        </section>
      </ShowcaseComponent>
    </>
  );
}

export default HomePage;
