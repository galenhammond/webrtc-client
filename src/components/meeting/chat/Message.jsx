import Moment from "react-moment";
function Message({ message, type }) {
  switch (type) {
    case "PROMPT":
      return (
        <div className="mx-2 mb-2 p-2">
          <p className={"font-medium text-2xl"}>{message.payload}</p>
        </div>
      );

    case "LOCAL_USER":
      return (
        <div className="ml-auto flex flex-col break-all w-4/6 items-end my-3 mx-2">
          <span className="my-1 px-2 py-1 bg-[#147EFB] rounded-lg ">
            <p className="font-bold text-sm text-white">
              <span className="m-1 font-medium">{message.payload}</span>
            </p>
          </span>
          <p className="text-xs mr-1 font-semibold text-gray-400">
            <Moment format="LT">{message.timestamp}</Moment>
          </p>
        </div>
      );

    case "REMOTE_USER":
      return (
        <div className="flex flex-col break-all w-4/6 items-start my-3 mx-2">
          <span className="my-1 px-2 py-1 bg-slate-200 rounded-lg ">
            <p className="font-bold text-sm">
              <span className="m-1 font-medium">{message.payload}</span>
            </p>
          </span>
          <p className="text-xs font-semibold ml-1 text-gray-400">
            <Moment format="LT">{message.timestamp}</Moment>
          </p>
        </div>
      );
    default:
      return;
  }
}

export default Message;
