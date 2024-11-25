import { ReactNode } from "react";
import { create } from "zustand";

type ModalConfig = {
  title: string;
  description?: string;
  content?: ReactNode;
  footer: ReactNode;
};

type State = {
  open: boolean;
  config?: ModalConfig;
};

type Action = {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
};

const useModalStore = create<State & Action>((set) => ({
  open: false,
  config: undefined,
  openModal: (config) => set({ open: true, config }),
  closeModal: () => set({ open: false, config: undefined }),
}));

export { useModalStore };
