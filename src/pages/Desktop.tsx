import React, { useState, useRef } from "react";
import { useStore } from "~/stores"; 
import { apps, wallpapers } from "~/configs";
import { minMarginY } from "~/utils";
import type { MacActions } from "~/types";
import TopBar from "~/components/menus/TopBar";
import Dock from "~/components/dock/Dock";
import Launchpad from "~/components/Launchpad";
import Spotlight from "~/components/Spotlight";
import ContextMenu from "~/components/menus/ContextMenu"; 
import AppWindow from "~/components/AppWindow"; 
import DesktopFileGrid from "~/components/DesktopFileGrid";
import MessageCenter from "~/components/MessageCenter"; 
import Explorer from "~/components/apps/Explorer"; 
import Finder from "~/components/apps/Finder"; 
import { generateDesktopFiles } from "~/buildFileTree";

interface DesktopState {
  showLaunchpad: boolean;
  currentTitle: string;
  hideDockAndTopbar: boolean;
  spotlight: boolean;
}

const DESKTOP_FILES = generateDesktopFiles();

const VIDEO_WALLPAPERS = [
  { name: '海滨公园打伞的澪', src: 'https://github.com/hesphoros/hesphoros.github.io/releases/download/v1.0-videos/default.mp4' },
  { name: 'Mona', src: 'https://github.com/hesphoros/hesphoros.github.io/releases/download/v1.0-videos/MonaWallpaperFHD.mp4' },
  { name: 'Wallpaper 1', src: 'https://github.com/hesphoros/hesphoros.github.io/releases/download/v1.0-videos/wallpaper.mp4' },
  { name: 'Wallpaper 2', src: 'https://github.com/hesphoros/hesphoros.github.io/releases/download/v1.0-videos/wallpaper2.mp4' },
  { name: 'Wallpaper 3', src: 'https://github.com/hesphoros/hesphoros.github.io/releases/download/v1.0-videos/wallpaper3.mp4' },
  { name: 'Wallpaper 4', src: 'https://github.com/hesphoros/hesphoros.github.io/releases/download/v1.0-videos/wallpaper4.mp4' },
  { name: 'Wallpaper 5', src: 'https://github.com/hesphoros/hesphoros.github.io/releases/download/v1.0-videos/wallpaper5.mp4' },
  { name: '合成动画', src: 'https://github.com/hesphoros/hesphoros.github.io/releases/download/v1.0-videos/1_1.mp4' },
  { name: '16:9', src: 'https://github.com/hesphoros/hesphoros.github.io/releases/download/v1.0-videos/16.9.mp4' },
];

export default function Desktop(props: MacActions) {
  const store = useStore();
  
  const [state, setState] = useState<DesktopState>({
    showLaunchpad: false, 
    currentTitle: "Finder",
    hideDockAndTopbar: false, 
    spotlight: false
  });
  const [spotlightBtnRef, setSpotlightBtnRef] = useState<React.RefObject<HTMLDivElement> | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const bgScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // -- 交互控制 --
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (bgScrollRef.current?.offsetLeft || 0);
    scrollLeft.current = bgScrollRef.current?.scrollLeft || 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !bgScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - bgScrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; 
    bgScrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handlePointerUp = () => { isDragging.current = false; };

  const handleNextWallpaper = () => {
    store.setWallpaperVideoIndex((store.wallpaperVideoIndex + 1) % VIDEO_WALLPAPERS.length);
  };

  const handleOpenApp = (id: string) => {
    const appConfig = apps.find((item) => item.id.toLowerCase() === id.toLowerCase());
    if (appConfig?.link) {
      window.open(appConfig.link, "_blank");
      return;
    }
    store.openApp(id, {});
    setState(prev => ({ ...prev, currentTitle: appConfig?.title || prev.currentTitle, showLaunchpad: false }));
  };

  const toggleLaunchpad = (target: boolean) => setState((prev) => ({ ...prev, showLaunchpad: target }));
  const toggleSpotlight = () => setState((prev) => ({ ...prev, spotlight: !prev.spotlight }));

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    store.setContextMenu({
       show: true, x: e.pageX, y: e.pageY,
       items: [
         { title: "New", onClick: () => {} },
         { title: "View", onClick: () => {} },
         { title: "Sort by", onClick: () => {} },
         { divider: true },
         { title: "Reload system", onClick: () => window.location.reload() },
         { title: "Paste", disabled: true },
         { divider: true },
         { title: "Open in Terminal", onClick: () => handleOpenApp('terminal') },
         { divider: true },
         { title: "Wallpapers", onClick: () => { store.setSettingsTab('Wallpaper', 'Video'); handleOpenApp('Settings'); } },
         { title: "Settings", onClick: () => { store.setSettingsTab('Profile', 'About Me'); handleOpenApp('Settings'); } },
         { divider: true },
         { title: "⭐ This Project", onClick: () => window.open('https://github.com/LeonardoElish/macOS', '_blank') },
       ]
    });
  };

  // -- 渲染背景壁纸 --
  const renderWallpaper = () => {
    const staticBg = store.dark ? wallpapers.night : wallpapers.day;

    return (
      <>
        <div 
          ref={bgScrollRef}
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}
          onContextMenu={handleDesktopContextMenu} onDoubleClick={handleNextWallpaper}
          className="absolute inset-0 z-0 overflow-x-hidden overflow-y-hidden desktop-bg-scroll pointer-events-auto cursor-grab active:cursor-grabbing bg-black"
        >
          {/* 🌟 永远垫底的静态图片，不加过渡动画，保证瞬间出现 */}
          <img 
            src={staticBg} 
            alt="wallpaper-fallback" 
            className="absolute inset-0 h-full w-[250vw] sm:w-[120vw] max-w-none object-cover pointer-events-none" 
            style={{ filter: `brightness( ${(store.brightness as number) * 0.7 + 50}% )` }} 
          />

          {/* 🌟 如果开启了动态壁纸，直接盖在静态图上面渲染。没加载出来前就是透明的。 */}
          {store.useVideoWallpaper && (
            <video 
              ref={videoRef} 
              key={VIDEO_WALLPAPERS[store.wallpaperVideoIndex]?.src} 
              className="absolute inset-0 h-full w-[250vw] sm:w-[120vw] max-w-none object-cover pointer-events-none transition-opacity duration-1000" 
              src={VIDEO_WALLPAPERS[store.wallpaperVideoIndex]?.src} 
              autoPlay 
              loop 
              muted 
              playsInline 
              style={{ filter: `brightness( ${(store.brightness as number) * 0.7 + 50}% )` }} 
            />
          )}
        </div>
        
        {store.useVideoWallpaper && (
          <div onClick={handleNextWallpaper} onContextMenu={(e) => e.stopPropagation()} className="absolute bottom-24 right-6 z-[40] px-4 py-2 bg-black/40 hover:bg-black/60 active:scale-95 transition-all backdrop-blur-md rounded-full text-white/90 text-xs font-medium cursor-pointer shadow-lg flex items-center pointer-events-auto">
             <span className="w-3 h-3 rounded-full bg-white/20 animate-pulse mr-2" />Playing: {VIDEO_WALLPAPERS[store.wallpaperVideoIndex]?.name} 
          </div>
        )}
      </>
    );
  };

  // -- 渲染应用窗口 --
  const renderAppWindows = () => {
    return store.activeWindows.map((win) => {
      const config = apps.find((app) => app.id.toLowerCase() === win.type.toLowerCase() || app.id === win.id);
      let WindowContent = null;
      const winType = win.type.toLowerCase();
      
      if (winType === 'explorer') {
        WindowContent = <Explorer {...win.props} uuid={win.id} filemap={DESKTOP_FILES} />;
      } else if (winType === 'finder') {
        WindowContent = <Finder {...win.props} id={win.id} />;
      } else {
        if (React.isValidElement(config?.content)) {
          WindowContent = React.cloneElement(config.content as React.ReactElement, win.props);
        } else {
          WindowContent = config?.content || <div className="flex items-center justify-center h-full text-gray-400">App Content Not Found: {win.type}</div>;
        }
      }
      return (
        <div key={win.id} className="pointer-events-auto">
          <AppWindow 
            id={win.id}
            title={win.props?.filename || config?.title || win.type}
            width={config?.width || 800} height={config?.height || 600}
            z={win.zIndex}
            focus={store.setFocus} close={store.closeApp}
            min={win.minimized || false} max={win.maximized || false}
            setMin={store.minimizeApp} setMax={store.maximizeApp}
          >
            {WindowContent}
          </AppWindow>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black select-none" onContextMenu={handleDesktopContextMenu}>
      
      {/* 1. 背景层 */}
      {renderWallpaper()}

      {/* 2. 桌面文件层 */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ top: minMarginY }}>
        <div className="w-full h-full pointer-events-auto">
          <DesktopFileGrid filemap={DESKTOP_FILES} />
        </div>
      </div>

      {/* 3. 系统 UI 与交互层 (z-20) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        
        <div className="pointer-events-auto" onContextMenu={(e) => e.stopPropagation()}>
          <TopBar title={state.currentTitle} setLogin={props.setLogin} shutMac={props.shutMac} sleepMac={props.sleepMac} restartMac={props.restartMac} toggleSpotlight={toggleSpotlight} hide={state.hideDockAndTopbar} setSpotlightBtnRef={setSpotlightBtnRef} />
        </div>

      {/* 窗口挂载区 */}
        <div className="absolute inset-0 pointer-events-none">
          {renderAppWindows()}
        </div>

        {state.spotlight && (
          <div className="pointer-events-auto" onContextMenu={(e) => e.stopPropagation()}>
            <Spotlight openApp={handleOpenApp} toggleLaunchpad={toggleLaunchpad} toggleSpotlight={toggleSpotlight} btnRef={spotlightBtnRef as React.RefObject<HTMLDivElement>} />
          </div>
        )}
        <div className="pointer-events-auto" onContextMenu={(e) => e.stopPropagation()}>
          <Launchpad show={state.showLaunchpad} toggleLaunchpad={toggleLaunchpad} />
        </div>
        <div className="pointer-events-auto" onContextMenu={(e) => e.stopPropagation()}>
          <Dock open={handleOpenApp} showApps={Object.fromEntries(store.activeWindows.map(w => [w.id, true]))} showLaunchpad={state.showLaunchpad} toggleLaunchpad={toggleLaunchpad} hide={state.hideDockAndTopbar} />
        </div>
        <div className="pointer-events-auto">
          <MessageCenter />
        </div>
        
      </div>

      {/* 5. 全局右键菜单 */}
      <ContextMenu />
      
      <style>{`
        .desktop-bg-scroll::-webkit-scrollbar { display: none; }
        .desktop-bg-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}