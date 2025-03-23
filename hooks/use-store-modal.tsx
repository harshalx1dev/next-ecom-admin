"use client";

import { create } from "zustand";

interface UseStoreModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useStoreModal = create<UseStoreModalStore>((set) => {
  const openModal = () => {
    set({ isOpen: true });
  }

  const closeModal = () => {
    set({ isOpen: false })
  }

  return {
    isOpen: false,
    onOpen: openModal,
    onClose: closeModal
  }
});