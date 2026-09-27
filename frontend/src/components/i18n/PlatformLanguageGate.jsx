import { useCallback, useState } from "react";
import LanguageSelectionScreen from "./LanguageSelectionScreen";
import SolveSphereIntro from "./SolveSphereIntro";

const STARTUP_STATE = {
  INTRO: "INTRO",
  LANGUAGE_SELECTION: "LANGUAGE_SELECTION",
  MAIN_APP: "MAIN_APP",
};

export default function PlatformLanguageGate({ children }) {
  const [startupState, setStartupState] = useState(STARTUP_STATE.INTRO);

  const handleIntroComplete = useCallback(() => {
    // Always show the language selector after the startup intro.
    // The selector reuses the currently saved language, so returning users
    // can simply press Continue or choose another language.
    setStartupState(STARTUP_STATE.LANGUAGE_SELECTION);
  }, []);

  const handleLanguageSelected = useCallback(() => {
    setStartupState(STARTUP_STATE.MAIN_APP);
  }, []);

  if (startupState === STARTUP_STATE.INTRO) {
    return <SolveSphereIntro onComplete={handleIntroComplete} />;
  }

  if (startupState === STARTUP_STATE.LANGUAGE_SELECTION) {
    return <LanguageSelectionScreen onLanguageSelected={handleLanguageSelected} />;
  }

  return children;
}

