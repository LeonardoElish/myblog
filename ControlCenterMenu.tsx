import React, { useRef } from "react";
import { music } from "~/configs";
// 这里的 SliderComponent 使用原生 HTML5 Range，彻底避开 react-rangeslider 的报错坑
interface SliderProps {
  icon: string;
  value: number;
  setValue: (value: number) => void;
}

const SliderComponent = ({ icon, value, setValue }: SliderProps) => (
  <div className="slider flex items-center w-full group">
    <div className="size-7 flex justify-center items-center bg-c-100 border border-c-300 rounded-l-full shadow-sm">
      <span className={`${icon} text-xs text-gray-500`} />
    </div>
    <div className="flex-1 relative h-7 flex items-center bg-c-100 border-t border-b border-r border-c-300 rounded-r-full px-2">
      <input
        type="range"
        min={1}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
        }}
      />
    </div>
  </div>
);

interface CCMProps {
  toggleControlCenter: () => void;
  toggleAudio: (target: boolean) => void;
  setBrightness: (value: number) => void;
  setVolume: (value: number) => void;
  playing: boolean;
  btnRef: React.RefObject<HTMLDivElement>;
}

export default function ControlCenterMenu({
  toggleControlCenter,
  toggleAudio,
  setBrightness,
  setVolume,
  playing,
  btnRef
}: CCMProps) {
  const controlCenterRef = useRef<HTMLDivElement>(null);

  // 从 store 获取状态
  const { dark, wifi, brightness, bluetooth, airdrop, fullscreen, volume } = useStore(
    (state) => ({
      dark: state.dark,
      wifi: state.wifi,
      brightness: state.brightness,
      bluetooth: state.bluetooth,
      airdrop: state.airdrop,
      fullscreen: state.fullscreen,
      volume: state.volume
    })
  );

  const { toggleWIFI, toggleBluetooth, toggleAirdrop, toggleDark, toggleFullScreen } =
    useStore((state) => ({
      toggleWIFI: state.toggleWIFI,
      toggleBluetooth: state.toggleBluetooth,
      toggleAirdrop: state.toggleAirdrop,
      toggleDark: state.toggleDark,
      toggleFullScreen: state.toggleFullScreen
    }));

  // 点击外部关闭
  useClickOutside(controlCenterRef, toggleControlCenter, [btnRef]);

  return (
    <div
      className="w-80 h-auto max-w-full shadow-2xl p-2.5 text-black bg-white/70 backdrop-blur-2xl fixed top-10 right-0 sm:right-2 border border-white/30 rounded-2xl grid grid-cols-4 grid-rows-none gap-2 z-50"
      ref={controlCenterRef}
    >
      {/* 第一行：Wi-Fi, 蓝牙, 隔空投送 */}
      <div className="cc-grid row-span-2 col-span-2 p-2 flex flex-col justify-around bg-white/50 rounded-xl border border-black/5 shadow-sm">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleWIFI}>
          <div
            className={`size-7 rounded-full flex items-center justify-center ${wifi ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
          >
            <span className="i-material-symbols:wifi text-base" />
          </div>
          <div>
            <div className="text-[13px] font-semibold leading-tight">Wi-Fi</div>
            <div className="text-[10px] text-gray-500">{wifi ? "已连接" : "关闭"}</div>
          </div>
        </div>
        <div
          className="flex items-center space-x-2 mt-2 cursor-pointer"
          onClick={toggleBluetooth}
        >
          <div
            className={`size-7 rounded-full flex items-center justify-center ${bluetooth ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
          >
            <span className="i-charm:bluetooth text-base" />
          </div>
          <div>
            <div className="text-[13px] font-semibold leading-tight">蓝牙</div>
            <div className="text-[10px] text-gray-500">{bluetooth ? "开启" : "关闭"}</div>
          </div>
        </div>
        <div
          className="flex items-center space-x-2 mt-2 cursor-pointer"
          onClick={toggleAirdrop}
        >
          <div
            className={`size-7 rounded-full flex items-center justify-center ${airdrop ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
          >
            <span className="i-material-symbols:rss-feed-rounded text-base" />
          </div>
          <div>
            <div className="text-[13px] font-semibold leading-tight">隔空投送</div>
            <div className="text-[10px] text-gray-500">
              {airdrop ? "仅联系人" : "关闭"}
            </div>
          </div>
        </div>
      </div>

      {/* 深色模式切换 */}
      <div
        className="cc-grid col-span-2 p-2 flex items-center space-x-3 bg-white/50 rounded-xl border border-black/5 shadow-sm cursor-pointer"
        onClick={toggleDark}
      >
        <div
          className={`size-7 rounded-full flex items-center justify-center ${dark ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
        >
          {dark ? (
            <span className="i-ion:moon text-base" />
          ) : (
            <span className="i-ion:sunny text-base" />
          )}
        </div>
        <div className="text-[13px] font-semibold">{dark ? "深色" : "浅色"}</div>
      </div>

      {/* 键盘亮度 */}
      <div className="cc-grid flex flex-col items-center justify-center bg-white/50 rounded-xl border border-black/5 shadow-sm p-1">
        <span className="i-bi:brightness-alt-high text-lg" />
        <span className="text-[10px] text-center mt-1">键盘亮度</span>
      </div>

      {/* 全屏切换 */}
      <div
        className="cc-grid flex flex-col items-center justify-center bg-white/50 rounded-xl border border-black/5 shadow-sm p-1 cursor-pointer"
        onClick={() => toggleFullScreen(!fullscreen)}
      >
        {fullscreen ? (
          <span className="i-bi:fullscreen-exit text-base" />
        ) : (
          <span className="i-bi:fullscreen text-base" />
        )}
        <span className="text-[10px] text-center mt-1">
          {fullscreen ? "退出" : "全屏"}
        </span>
      </div>

      {/* 显示器亮度滑动条 */}
      <div className="cc-grid col-span-4 px-3 py-2 bg-white/50 rounded-xl border border-black/5 shadow-sm">
        <div className="text-[13px] font-semibold mb-1">显示器</div>
        <SliderComponent icon="i-ion:sunny" value={brightness} setValue={setBrightness} />
      </div>

      {/* 声音滑动条 */}
      <div className="cc-grid col-span-4 px-3 py-2 bg-white/50 rounded-xl border border-black/5 shadow-sm">
        <div className="text-[13px] font-semibold mb-1">声音</div>
        <SliderComponent icon="i-ion:volume-high" value={volume} setValue={setVolume} />
      </div>

      {/* 音乐播放控制 */}
      <div className="cc-grid col-span-4 flex items-center space-x-3 p-2 bg-white/50 rounded-xl border border-black/5 shadow-sm">
        <img className="size-10 rounded-lg shadow-sm" src={music.cover} alt="cover" />
        <div className="flex-1 overflow-hidden">
          <div className="text-[13px] font-semibold truncate">{music.title}</div>
          <div className="text-[11px] text-gray-500 truncate">{music.artist}</div>
        </div>
        <div className="cursor-pointer">
          {playing ? (
            <span
              className="i-bi:pause-fill text-2xl"
              onClick={() => toggleAudio(false)}
            />
          ) : (
            <span className="i-bi:play-fill text-2xl" onClick={() => toggleAudio(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
