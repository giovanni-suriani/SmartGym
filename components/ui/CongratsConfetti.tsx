import React, { useEffect, useRef } from "react";
import ConfettiCannon from "react-native-confetti-cannon";
// If available in your typings:
// import type { Explosion } from "react-native-confetti-cannon";

type Props = { fire: boolean };

export default function CongratsConfetti({ fire }: Props) {
  // If Explosion type isn’t exported, use `any` to silence TS:
  const cannonRef = useRef<any>(null); // or useRef<Explosion | null>(null)

  useEffect(() => {
    if (fire) {
      cannonRef.current?.start?.();
    }
  }, [fire]);

  return (
    <ConfettiCannon
      ref={cannonRef}            // ✅ object ref—no callback return
      count={60}
      origin={{ x: 0, y: 0 }}
      autoStart={false}
      fadeOut
    />
  );
}
