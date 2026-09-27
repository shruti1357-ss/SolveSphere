import { useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";

/*
 * SolveSphereIntro
 * -----------------
 * Full-screen logo intro displayed on application startup.
 * When complete, onComplete() notifies PlatformLanguageGate to proceed
 * to LanguageSelectionScreen (if no language selected) or App.
 *
 * S design: three symmetric cubic bezier curves forming an elegant
 * balanced S — upper bowl (right->left), centre crossing (left->right),
 * lower bowl (right->left). strokeWidth=18 gives the bold weight of the
 * reference "double-struck S" (𝕊). Two thin hairline serifs appear at
 * both terminals after the S completes.
 *
 * The onComplete ref pattern ensures the 2.1 s timer fires exactly once,
 * even if the parent re-renders and passes a new function reference.
 *
 * Timeline:
 *   0.00 s  - background fades in
 *   0.20 s  - S begins drawing from top (1.0 s pathLength)
 *   1.20 s  - S completes; serif terminals + glow settle in
 *   1.65 s  - whole screen fades out
 *   2.10 s  - onComplete() fires -> LanguageSelectionScreen
 */

/* ── S path in a 60 x 92 viewBox ──────────────────────────────────────
 * Segment 1 (upper bowl)  : (44,16) C(44,4)(16,4) -> (16,26)
 * Segment 2 (centre cross): (16,26) C(16,46)(44,46) -> (44,66)
 * Segment 3 (lower bowl)  : (44,66) C(44,88)(16,88) -> (16,76)
 *
 * With strokeWidth=18 + round caps this produces a bold, balanced,
 * unmistakably S-shaped ribbon visually close to 𝕊.
 */
const S_SPINE =
  "M 44 16 C 44 4 16 4 16 26 C 16 46 44 46 44 66 C 44 88 16 88 16 76";

/* Thin hairline serifs at the two S terminals */
const S_TOP_SERIF = "M 34 16 L 54 16";   /* top-right terminal  */
const S_BOT_SERIF = "M 6 76 L 26 76";    /* bottom-left terminal */

export default function SolveSphereIntro({ onComplete }) {
  const shouldReduceMotion = useReducedMotion();

  /*
   * Store onComplete in a ref so the timer effect never needs it in its
   * dependency array. This prevents the 2.1 s timer from being reset if
   * the parent re-renders and passes a new function reference.
   */
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const timerRef = useRef(null);

  useEffect(() => {
    if (shouldReduceMotion) {
      onCompleteRef.current();
      return;
    }
    timerRef.current = setTimeout(() => {
      onCompleteRef.current();
    }, 2100);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); /* intentionally empty: run once on mount only */

  if (shouldReduceMotion) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="intro-screen"
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#06132d" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Emerald glow - top-left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(52,211,153,0.14) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Cyan glow - bottom-right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Logo wrapper — spring-settle scale after the S forms */}
        <motion.div
          className="relative flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: [0.9, 1, 1.03, 1] }}
          transition={{
            opacity: { duration: 0.3, delay: 0.1 },
            scale: {
              duration: 1.1,
              delay: 0.1,
              times: [0, 0.25, 0.75, 1],
              ease: "easeOut",
            },
          }}
        >
          {/* Subtle white glow — blooms after the S completes */}
          <motion.div
            aria-hidden="true"
            className="absolute"
            style={{
              width: 160,
              height: 160,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.09) 0%, transparent 70%)",
              filter: "blur(26px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.15, ease: "easeOut" }}
          />

          {/* SVG: bold 3-bezier S spine + two hairline serif terminals */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 60 92"
            width={80}
            height={123}
            fill="none"
            aria-hidden="true"
            style={{ overflow: "visible" }}
          >
            {/* ── Main S spine ─────────────────────────────────────────── */}
            {/* strokeWidth=18 with round caps produces the bold, smooth   */}
            {/* ribbon weight matching the 𝕊 reference character.          */}
            <motion.path
              d={S_SPINE}
              stroke="white"
              strokeWidth={18}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                filter: "drop-shadow(0 0 8px rgba(255,255,255,0.35))",
              }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: {
                  duration: 1.0,
                  delay: 0.2,
                  ease: [0.4, 0, 0.2, 1],
                },
                opacity: { duration: 0.15, delay: 0.2 },
              }}
            />

            {/* ── Top serif terminal ─────────────────────────────────── */}
            <motion.path
              d={S_TOP_SERIF}
              stroke="white"
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              style={{ transformOrigin: "44px 16px" }}
              transition={{
                opacity: { duration: 0.2, delay: 1.18 },
                scaleX: { duration: 0.2, delay: 1.18, ease: "easeOut" },
              }}
            />

            {/* ── Bottom serif terminal ──────────────────────────────── */}
            <motion.path
              d={S_BOT_SERIF}
              stroke="white"
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              style={{ transformOrigin: "16px 76px" }}
              transition={{
                opacity: { duration: 0.2, delay: 1.25 },
                scaleX: { duration: 0.2, delay: 1.25, ease: "easeOut" },
              }}
            />
          </svg>
        </motion.div>

        {/* Fade-out overlay — starts at 1.65 s, completes at 2.05 s */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: "#06132d" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.65, ease: "easeIn" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
