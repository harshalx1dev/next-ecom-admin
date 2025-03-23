import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  open: boolean;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const AlertModal = ({ loading, onClose, onConfirm, open }: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal title="Are you sure?" description="This action cannot be reversed" onClose={onClose} isOpen={open}>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button className="cursor-pointer" disabled={loading} variant={'outline'} onClick={onClose}>Cancel</Button>
        <Button className="cursor-pointer" disabled={loading} variant={'destructive'} onClick={onConfirm}>Delete</Button>
      </div>
    </Modal>
  )
}