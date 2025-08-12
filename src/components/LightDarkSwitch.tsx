import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import {
  applyThemeToDocument,
  getStoredTheme,
  setTheme,
} from "@utils/setting-utils";
import type { LIGHT_DARK_MODE } from "@/types/config";

const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE, AUTO_MODE];

export default function LightDarkSwitcher() {
  const [mode, setMode] = useState<LIGHT_DARK_MODE>(AUTO_MODE);

  // 初始化 & 监听系统主题变化
  useEffect(() => {
    const stored = getStoredTheme();
    setMode(stored);

    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
    const changeThemeWhenSchemeChanged = () => {
      applyThemeToDocument(stored);
    };
    darkModePreference.addEventListener("change", changeThemeWhenSchemeChanged);

    return () => {
      darkModePreference.removeEventListener(
        "change",
        changeThemeWhenSchemeChanged
      );
    };
  }, []);

  const switchScheme = useCallback((newMode: LIGHT_DARK_MODE) => {
    setMode(newMode);
    setTheme(newMode);
  }, []);

  const toggleScheme = useCallback(() => {
    const index = seq.indexOf(mode);
    switchScheme(seq[(index + 1) % seq.length]);
  }, [mode, switchScheme]);

  const showPanel = useCallback(() => {
    const panel = document.querySelector("#light-dark-panel");
    panel?.classList.remove("float-panel-closed");
  }, []);

  const hidePanel = useCallback(() => {
    const panel = document.querySelector("#light-dark-panel");
    panel?.classList.add("float-panel-closed");
  }, []);

  return (
    <div
      className="relative z-50"
      role="menu"
      tabIndex={-1}
      onMouseLeave={hidePanel}
    >
      <button
        aria-label="Light/Dark Mode"
        role="menuitem"
        className="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90"
        id="scheme-switch"
        onClick={toggleScheme}
        onMouseEnter={showPanel}
      >
        <div className={`absolute ${mode !== LIGHT_MODE ? "opacity-0" : ""}`}>
          <Icon
            icon="material-symbols:wb-sunny-outline-rounded"
            className="text-[1.25rem]"
          />
        </div>
        <div className={`absolute ${mode !== DARK_MODE ? "opacity-0" : ""}`}>
          <Icon
            icon="material-symbols:dark-mode-outline-rounded"
            className="text-[1.25rem]"
          />
        </div>
        <div className={`absolute ${mode !== AUTO_MODE ? "opacity-0" : ""}`}>
          <Icon
            icon="material-symbols:radio-button-partial-outline"
            className="text-[1.25rem]"
          />
        </div>
      </button>

      <div
        id="light-dark-panel"
        className="hidden lg:block absolute transition float-panel-closed top-11 -right-2 pt-5"
      >
        <div className="card-base float-panel p-2">
          <button
            className={`flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5 ${
              mode === LIGHT_MODE ? "current-theme-btn" : ""
            }`}
            onClick={() => switchScheme(LIGHT_MODE)}
          >
            <Icon
              icon="material-symbols:wb-sunny-outline-rounded"
              className="text-[1.25rem] mr-3"
            />
            {i18n(I18nKey.lightMode)}
          </button>

          <button
            className={`flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5 ${
              mode === DARK_MODE ? "current-theme-btn" : ""
            }`}
            onClick={() => switchScheme(DARK_MODE)}
          >
            <Icon
              icon="material-symbols:dark-mode-outline-rounded"
              className="text-[1.25rem] mr-3"
            />
            {i18n(I18nKey.darkMode)}
          </button>

          <button
            className={`flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 ${
              mode === AUTO_MODE ? "current-theme-btn" : ""
            }`}
            onClick={() => switchScheme(AUTO_MODE)}
          >
            <Icon
              icon="material-symbols:radio-button-partial-outline"
              className="text-[1.25rem] mr-3"
            />
            {i18n(I18nKey.systemMode)}
          </button>
        </div>
      </div>
    </div>
  );
}
