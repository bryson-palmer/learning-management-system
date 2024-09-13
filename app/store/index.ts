import { create } from 'zustand'

type DrawerState = {
  showSheet: boolean,
}

type DrawerAction = {
  setShowSheet: (showSheet: DrawerState['showSheet']) => void
}

export const useDrawerStore = create<DrawerState & DrawerAction>(set => ({
  showSheet: false,
  setShowSheet: showSheet => set(() => ({ showSheet: showSheet }))
}))