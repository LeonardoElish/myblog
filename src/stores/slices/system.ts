import type { StateCreator } from "zustand";
import { enterFullScreen, exitFullScreen } from "~/utils";

// 🌟 新增：定义窗口实例的接口
interface WindowInstance {
  id: string;      // 唯一的 App ID (如 'explorer', 'reader')
  type: string;    // 组件类型 (通常与 id 一致)
  props: any;      // 传给窗口的动态参数
  zIndex: number;  // 窗口层级
  minimized?: boolean; // 🌟 新增
  maximized?: boolean;
}

export interface SystemSlice {
  // --- 原有状态 ---
  dark: boolean;
  volume: number;
  brightness: number;
  wifi: boolean;
  bluetooth: boolean;
  airdrop: boolean;
  fullscreen: boolean;
  settingsTab: string;
  settingsTab2: string;
  useVideoWallpaper: boolean;
  wallpaperVideoIndex: number;

  // 🌟 新增：窗口管理状态
  activeWindows: WindowInstance[];
  currentFocus: string | null;
  maxZIndex: number;
  showSideBar: boolean; // 消息中心显隐状态
  
  // 🌟 新增：窗口管理方法
  minimizeApp: (id: string, target?: boolean) => void;
  maximizeApp: (id: string, target?: boolean) => void;
  openApp: (id: string, props?: any) => void;
  closeApp: (id: string) => void;
  setFocus: (id: string) => void;
  closeSideBar: () => void;
  toggleSideBar: () => void;

  // --- 原有方法 ---
  toggleDark: () => void;
  toggleWIFI: () => void;
  toggleBluetooth: () => void;
  toggleAirdrop: () => void;
  toggleFullScreen: (v: boolean) => void;
  setVolume: (v: number) => void;
  setBrightness: (v: number) => void;
  setSettingsTab: (tab: string, tab2?: string) => void;
  toggleVideoWallpaper: () => void;
  setWallpaperVideoIndex: (index: number) => void;
}

export const createSystemSlice: StateCreator<any, [], [], SystemSlice> = (set, get) => ({
  // --- 初始化原有状态 ---
  dark: false,
  volume: 100,
  brightness: 80,
  wifi: true,
  bluetooth: true,
  airdrop: true,
  fullscreen: false,
  settingsTab: 'Profile',
  settingsTab2: 'About Me',
  useVideoWallpaper: true,
  wallpaperVideoIndex: 0,

  // 🌟 初始化新增状态
  activeWindows: [],
  currentFocus: null,
  maxZIndex: 100,
  showSideBar: false,

  // 🌟 核心：打开 App (实现你说的联动逻辑)
  openApp: (id, props = {}) => {
    const { activeWindows, maxZIndex } = get();
    const existing = activeWindows.find((w: any) => w.id === id);

    if (existing) {
      // 如果窗口已打开：更新 props, 取消最小化，并置顶
      set({
        activeWindows: activeWindows.map((w: any) =>
          w.id === id ? { ...w, props: { ...w.props, ...props }, zIndex: maxZIndex + 1, minimized: false } : w
        ),
        currentFocus: id,
        maxZIndex: maxZIndex + 1,
      });
    } else {
      // 如果窗口未打开：新建实例
      const newWin: WindowInstance = {
        id,
        type: id,
        props,
        zIndex: maxZIndex + 1,
        minimized: false, // 初始状态不最小化
        maximized: false, // 初始状态不最大化
      };
      set({
        activeWindows: [...activeWindows, newWin],
        currentFocus: id,
        maxZIndex: maxZIndex + 1,
      });
    }
  },

  // 🌟 关闭 App
  closeApp: (id) => set((state: any) => ({
    activeWindows: state.activeWindows.filter((w: any) => w.id !== id),
    currentFocus: state.activeWindows.length > 1 ? state.activeWindows[0].id : null
  })),

  // 🌟 设置焦点 (置顶)
  setFocus: (id) => {
    const { maxZIndex, currentFocus } = get();
    if (currentFocus === id) return;

    set((state: any) => ({
      currentFocus: id,
      maxZIndex: maxZIndex + 1,
      activeWindows: state.activeWindows.map((w: any) =>
        w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w
      ),
    }));
  },

  // 🌟 新增：最小化逻辑实现
  minimizeApp: (id, target) => set((state: any) => ({
    activeWindows: state.activeWindows.map((w: any) =>
      w.id === id ? { ...w, minimized: target !== undefined ? target : true } : w
    )
  })),

  // 🌟 新增：最大化逻辑实现
  maximizeApp: (id, target) => set((state: any) => ({
    activeWindows: state.activeWindows.map((w: any) =>
      w.id === id ? { ...w, maximized: target !== undefined ? target : !w.maximized } : w
    )
  })),

  // --- 原有方法的实现 ---
  toggleVideoWallpaper: () => set((state: any) => ({ useVideoWallpaper: !state.useVideoWallpaper })),
  setWallpaperVideoIndex: (index) => set(() => ({ wallpaperVideoIndex: index })),
  setSettingsTab: (tab, tab2 = '') => set(() => ({ settingsTab: tab, settingsTab2: tab2 })),
  toggleDark: () =>
    set((state: any) => {
      if (!state.dark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return { dark: !state.dark };
    }),
  toggleWIFI: () => set((state: any) => ({ wifi: !state.wifi })),
  toggleBluetooth: () => set((state: any) => ({ bluetooth: !state.bluetooth })),
  toggleAirdrop: () => set((state: any) => ({ airdrop: !state.airdrop })),
  toggleFullScreen: (v) =>
    set(() => {
      v ? enterFullScreen() : exitFullScreen();
      return { fullscreen: v };
    }),
  setVolume: (v) => set(() => ({ volume: v })),
  setBrightness: (v) => set(() => ({ brightness: v })),

  // 消息中心控制
  closeSideBar: () => set({ showSideBar: false }),
  toggleSideBar: () => set((state: any) => ({ showSideBar: !state.showSideBar })),
});