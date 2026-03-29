import React, { useState, useEffect, useRef, forwardRef } from "react";
import { format } from "date-fns";
import { isFullScreen } from "~/utils";
import { music } from "~/configs";
import type { MacActions } from "~/types";
import { useStore } from "~/stores";

// 引入你的组件
import  AppleMenu from "./AppleMenu";
import Battery from "./Battery";
import WifiMenu from "./WifiMenu";
import ControlCenterMenu from "./ControlCenterMenu";

// --- 基础 UI 组件 (保留你原来的设计) ---
interface TopBarItemProps {
  hideOnMobile?: boolean;
  forceHover?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
}

const TopBarItem = forwardRef((props: TopBarItemProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const hide = props.hideOnMobile ? "hidden sm:inline-flex" : "inline-flex";
  const bg = props.forceHover ? "bg-white/20 dark:bg-white/10" : "hover:bg-white/20 dark:hover:bg-white/10";

  return (
    <div
      ref={ref}
      className={`hstack space-x-1 h-6 px-2 cursor-default rounded ${hide} ${bg} transition-colors duration-100 ${props.className || ""}`}
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
    >
      {props.children}
    </div>
  );
});

const CCMIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 29 29" width={size} height={size} xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M7.5,13h14a5.5,5.5,0,0,0,0-11H7.5a5.5,5.5,0,0,0,0,11Zm0-9h14a3.5,3.5,0,0,1,0,7H7.5a3.5,3.5,0,0,1,0-7Zm0,6A2.5,2.5,0,1,0,5,7.5,2.5,2.5,0,0,0,7.5,10Zm14,6H7.5a5.5,5.5,0,0,0,0,11h14a5.5,5.5,0,0,0,0-11Zm1.43439,8a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,22.93439,24Z" />
  </svg>
);

// --- 主组件 ---
interface TopBarProps extends MacActions {
  title: string;
  setSpotlightBtnRef: (value: React.RefObject<HTMLDivElement>) => void;
  hide: boolean;
  toggleSpotlight: () => void;
}

interface TopBarState {
  date: Date;
  showControlCenter: boolean;
  showWifiMenu: boolean;
  showAppleMenu: boolean;
  activeMenu: string | null; // 🌟 融合的新状态：当前展开的级联菜单
  dropdownLeft: number;
}

const TopBar = (props: TopBarProps) => {
  const appleBtnRef = useRef<HTMLDivElement>(null);
  const controlCenterBtnRef = useRef<HTMLDivElement>(null);
  const wifiBtnRef = useRef<HTMLDivElement>(null);
  const spotlightBtnRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<TopBarState>({
    date: new Date(),
    showControlCenter: false,
    showWifiMenu: false,
    showAppleMenu: false,
    activeMenu: null,
    dropdownLeft: 0,
  });

  const [audio, audioState, controls, audioRef] = useAudio({ src: music.audio, autoReplay: true });
  const { winWidth, winHeight } = useWindowSize();

  const { volume, wifi, dark } = useStore((store) => ({
    volume: store.volume,
    wifi: store.wifi,
    dark: store.dark
  }));
  
  const { toggleFullScreen, setVolume, setBrightness } = useStore((store) => ({
    toggleFullScreen: store.toggleFullScreen,
    setVolume: store.setVolume,
    setBrightness: store.setBrightness
  }));

  useInterval(() => { setState({ ...state, date: new Date() }); }, 60 * 1000);

  useEffect(() => {
    props.setSpotlightBtnRef(spotlightBtnRef);
    controls.volume(volume / 100);
  }, []);

  useEffect(() => { toggleFullScreen(isFullScreen()); }, [winWidth, winHeight]);

  const toggleControlCenter = () => setState({ ...state, showControlCenter: !state.showControlCenter, activeMenu: null, showAppleMenu: false });
  const toggleWifiMenu = () => setState({ ...state, showWifiMenu: !state.showWifiMenu, activeMenu: null, showAppleMenu: false });
  
  // 原有的 Apple 菜单（如果你想保留原来的组件）
  const toggleAppleMenu = () => setState({ ...state, showAppleMenu: !state.showAppleMenu, activeMenu: null });

  // 🌟 级联菜单逻辑
  const handleMenuClick = (menuName: string, e: React.MouseEvent) => {
    if (state.activeMenu === menuName) {
      setState({ ...state, activeMenu: null });
    } else {
      setState({ 
        ...state, 
        activeMenu: menuName, 
        dropdownLeft: (e.currentTarget as HTMLElement).offsetLeft,
        showAppleMenu: false, showControlCenter: false, showWifiMenu: false 
      });
    }
  };

  const handleMenuHover = (menuName: string, e: React.MouseEvent) => {
    if (state.activeMenu && state.activeMenu !== menuName) {
      setState({ ...state, activeMenu: menuName, dropdownLeft: (e.currentTarget as HTMLElement).offsetLeft });
    }
  };

  const closeAllMenus = () => setState({ ...state, activeMenu: null, showAppleMenu: false, showControlCenter: false, showWifiMenu: false });

  // 🌟 菜单数据
  const menus: Record<string, any[]> = {
    app: [
      { title: `About ${props.title || 'Finder'}`, breakAfter: true },
      { title: 'Preferences...', breakAfter: true },
      { title: 'Empty Trash...', breakAfter: true },
      { title: `Hide ${props.title || 'Finder'}` },
      { title: 'Hide Others' },
      { title: 'Show All', disabled: true }
    ],
    file: [
      { title: 'New Window' },
      { title: 'New Folder' },
      { title: 'New Smart Folder' },
      { title: 'New Tab', breakAfter: true },
      { title: 'Open' },
      { title: 'Close Window' }
    ],
    edit: [
      { title: 'Undo', disabled: true },
      { title: 'Redo', disabled: true, breakAfter: true },
      { title: 'Cut', disabled: true },
      { title: 'Copy', disabled: true },
      { title: 'Paste' },
      { title: 'Select All' }
    ],
    view: [
      { title: 'as Icons' },
      { title: 'as List' },
      { title: 'Clean Up' }
    ],
    go: [
      { title: 'Back', disabled: true },
      { title: 'Forward', disabled: true },
      { title: 'Recents', breakAfter: true },
      { title: 'Home' },
      { title: 'Computer' }
    ]
  };

  const topLevelMenus = ['app', 'file', 'edit', 'view', 'go'];

  return (
    <>
      <div 
        className={`w-full h-7 px-2 fixed top-0 flex items-center justify-between text-[13px] tracking-wide text-white transition-all duration-300 select-none ${props.hide ? "z-0 -translate-y-full" : "z-[2000] translate-y-0"}`}
        style={{
          backgroundColor: dark ? 'rgba(20, 20, 20, 0.6)' : 'rgba(40, 40, 40, 0.4)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '0.5px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* ================= 左侧菜单栏 ================= */}
        <div className="flex items-center h-full">
          {/* Apple Logo (保留你的原版组件) */}
          <TopBarItem
            forceHover={state.showAppleMenu}
            onClick={toggleAppleMenu}
            ref={appleBtnRef}
          >
            <span className="i-ri:apple-fill text-[15px]" />
          </TopBarItem>

          {/* 级联菜单栏 */}
          {topLevelMenus.map((menuId) => (
            <TopBarItem
              key={menuId}
              forceHover={state.activeMenu === menuId}
              onClick={(e) => handleMenuClick(menuId, e)}
              onMouseEnter={(e) => handleMenuHover(menuId, e)}
              className={menuId === 'app' ? 'font-bold' : 'font-medium'}
            >
              {menuId === 'app' ? props.title || 'Finder' : menuId.charAt(0).toUpperCase() + menuId.slice(1)}
            </TopBarItem>
          ))}
        </div>

        {/* ================= 右侧状态栏 ================= */}
        <div className="flex items-center justify-end space-x-1 h-full">
          <TopBarItem hideOnMobile={true}>
            <Battery />
          </TopBarItem>
          
          <TopBarItem hideOnMobile={true} forceHover={state.showWifiMenu} onClick={toggleWifiMenu} ref={wifiBtnRef}>
            <span className={`text-[16px] ${wifi ? 'i-material-symbols:wifi' : 'i-material-symbols:wifi-off'}`} />
          </TopBarItem>
          
          <TopBarItem ref={spotlightBtnRef} onClick={() => { closeAllMenus(); props.toggleSpotlight(); }}>
            <span className="i-bx:search text-[16px]" />
          </TopBarItem>
          
          <TopBarItem forceHover={state.showControlCenter} onClick={toggleControlCenter} ref={controlCenterBtnRef}>
            <CCMIcon size={14} />
          </TopBarItem>

          <TopBarItem className="font-medium tracking-normal px-3" onClick={closeAllMenus}>
            <span>{format(state.date, "eee MMM d")}</span>
            <span className="ml-2">{format(state.date, "h:mm aa")}</span>
          </TopBarItem>
        </div>

        {/* ================= 弹出层组件 ================= */}
        
        {/* 你的 Apple 菜单 */}
        {state.showAppleMenu && (
          <AppleMenu
            logout={() => { controls.pause(); props.setLogin(false); }}
            shut={(e) => { controls.pause(); props.shutMac(e); }}
            restart={(e) => { controls.pause(); props.restartMac(e); }}
            sleep={(e) => { controls.pause(); props.sleepMac(e); }}
            toggleAppleMenu={toggleAppleMenu}
            btnRef={appleBtnRef}
          />
        )}

        {/* 你的 Wifi 菜单 */}
        {state.showWifiMenu && <WifiMenu toggleWifiMenu={toggleWifiMenu} btnRef={wifiBtnRef} />}

        {/* 你的 控制中心 */}
        {state.showControlCenter && (
          <ControlCenterMenu
            playing={audioState.playing}
            toggleAudio={controls.toggle}
            setVolume={(v) => { setVolume(v); controls.volume(v / 100); }}
            setBrightness={setBrightness}
            toggleControlCenter={toggleControlCenter}
            btnRef={controlCenterBtnRef}
          />
        )}

        {/* 🌟 新增的级联下拉菜单 */}
        {state.activeMenu && (
          <div 
            className="absolute top-full mt-[2px] min-w-[220px] rounded-lg p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-100 origin-top-left" 
            style={{ 
              left: `${state.dropdownLeft}px`,
              backgroundColor: 'rgba(30, 30, 30, 0.75)',
              backdropFilter: 'saturate(200%) blur(40px)',
              WebkitBackdropFilter: 'saturate(200%) blur(40px)',
              border: '0.5px solid rgba(255,255,255,0.15)'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col">
              {menus[state.activeMenu]?.map((item, index) => (
                <React.Fragment key={index}>
                  <button 
                    className={`w-full px-3 py-1 text-left text-[13px] rounded-md transition-colors ${item.disabled ? 'text-white/40 cursor-default' : 'text-white/90 hover:bg-[#0066d6] hover:text-white'}`}
                    disabled={item.disabled}
                    onClick={() => { if (!item.disabled) { item.onClick?.(); closeAllMenus(); } }}
                  >
                    {item.title}
                  </button>
                  {item.breakAfter && <div className="h-[1px] bg-white/10 my-1 mx-2"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 遮罩层：点击屏幕其他地方关闭所有菜单 */}
      {(state.activeMenu || state.showAppleMenu || state.showWifiMenu || state.showControlCenter) && (
        <div className="fixed inset-0 z-[1999]" onClick={closeAllMenus}></div>
      )}
    </>
  );
};

export default TopBar;