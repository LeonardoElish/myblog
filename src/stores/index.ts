import { create } from "zustand";
import { createDockSlice, type DockSlice } from "./slices/dock";
import { createSystemSlice, type SystemSlice } from "./slices/system";
import { createUserSlice, type UserSlice } from "./slices/user";
import { createContextMenuSlice, ContextMenuSlice } from "./slices/contextMenu";

type StoreState = DockSlice & SystemSlice & UserSlice & ContextMenuSlice;
export const useStore = create<StoreState>()((...a) => ({
  ...createDockSlice(...a),
  ...createSystemSlice(...a),
  ...createUserSlice(...a),
  ...createContextMenuSlice(...a),
}));

