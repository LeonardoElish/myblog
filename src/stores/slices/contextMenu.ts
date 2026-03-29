import type { StateCreator } from "zustand";

export type MenuItem = 
  | { 
      title: string; 
      onClick?: (e: React.MouseEvent) => void; 
      disabled?: boolean; 
      divider?: false; 
    }
  | { 
      divider: true; 
    };

export interface ContextMenuData {
  show: boolean;
  x: number;
  y: number;
  items: MenuItem[];
}

export interface ContextMenuSlice {
  contextMenu: ContextMenuData;
  setContextMenu: (v: ContextMenuData) => void;
}

export const createContextMenuSlice: StateCreator<ContextMenuSlice> = (set) => ({
  contextMenu: { show: false, x: 0, y: 0, items: [] },
  setContextMenu: (v) => set(() => ({ contextMenu: v }))
});