import React, { useState, useEffect } from "react";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { Icon } from "@iconify/react";
import { getDefaultHue, getHue, setHue } from "@utils/setting-utils";
import "../../styles/displaySettings.css"; // 引入样式

const DisplaySetting: React.FC = () => {
  const defaultHue = getDefaultHue();
  const [hue, setHueState] = useState<number>(getHue());

  // 重置色调到默认值
  function resetHue() {
    setHueState(defaultHue);
  }

  // hue 变化同步外部设置
  useEffect(() => {
    if (hue || hue === 0) {
      setHue(hue);
    }
  }, [hue]);

  return (
    <div
      id="display-setting"
      className="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4"
    >
      <div className="flex flex-row gap-2 mb-3 items-center justify-between">
        <div className="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]">
          {i18n(I18nKey.themeColor)}
          <button
            aria-label="Reset to Default"
            className={`btn-regular w-7 h-7 rounded-md active:scale-90 ${
              hue === defaultHue ? "opacity-0 pointer-events-none" : ""
            }`}
            onClick={resetHue}
          >
            <div className="text-[var(--btn-content)]">
              <Icon icon="fa6-solid:arrow-rotate-left" className="text-[0.875rem]" />
            </div>
          </button>
        </div>
        <div className="flex gap-1">
          <div
            id="hueValue"
            className="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
              font-bold text-sm items-center text-[var(--btn-content)]"
          >
            {hue}
          </div>
        </div>
      </div>
      <div
        className="slider-container"
      >
        <input
          aria-label={i18n(I18nKey.themeColor)}
          type="range"
          min={0}
          max={360}
          step={5}
          value={hue}
          onChange={(e) => setHueState(Number(e.target.value))}
          className="slider"
          id="colorSlider"
        />
      </div>
    </div>
  );
};

export default DisplaySetting;
