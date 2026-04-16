import { useState, useEffect, useRef } from "react";
export function useCountdown(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const ref = useRef(null);
  useEffect(() => {
    ref.current = setInterval(() => {
      setSeconds((s) => (s <= 1 ? initialSeconds : s - 1));
    }, 1000);
    return () => clearInterval(ref.current);
  }, [initialSeconds]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return { seconds, display: `${mm}:${ss}` };
}

export function useBannerSlider(total, interval = 3000) {
  const [active, setActive] = useState(0);
  const ref = useRef(null);

  const reset = () => {
    clearInterval(ref.current);
    ref.current = setInterval(() => setActive((a) => (a + 1) % total), interval);
  };

  useEffect(() => {
    reset();
    return () => clearInterval(ref.current);
  }, [total]);

  const goTo = (i) => { setActive(i); reset(); };
  return { active, goTo };
}
