import { useRef, useEffect } from "react";

export function AlwaysScrollToBottom() {
  const elementRef = useRef();
  useEffect(() =>
    elementRef.current.scrollIntoView({ block: "end", behavior: "smooth" })
  );
  return <div ref={elementRef} />;
}
