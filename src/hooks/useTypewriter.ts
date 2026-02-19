import { useEffect, useRef, useState } from "react";

export function useTypewriter(speed = 40) {
  const [displayed, setDisplayed] = useState("");
  const [target, setTarget] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function type(text: string) {
    setTarget(text);
    setDisplayed("");
  }

  useEffect(() => {
    if (displayed.length >= target.length) return;

    timeoutRef.current = setTimeout(() => {
      setDisplayed(target.slice(0, displayed.length + 1));
    }, speed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, target]);

  return { displayed, type };
}
