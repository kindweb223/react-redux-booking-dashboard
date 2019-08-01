import { useEffect } from "react";

function useKeyPress(targetKey, onKeyPress) {
  useEffect(() => {
    const eventHandler = e => {
      if (e.key === targetKey) {
        onKeyPress();
      }
    };
    window.addEventListener("keyup", eventHandler);
    return () => {
      window.removeEventListener("keyup", eventHandler);
    };
  }, [targetKey, onKeyPress]);
}

export default useKeyPress;
