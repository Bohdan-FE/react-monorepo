import { useRef } from 'react';
import Portal from '../components/Portal/Portal';
import { useStore } from '../../store/store';

function ModalLayout({ children }: { children: React.ReactNode }) {
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const closeModal = useStore((state) => state.closeModal);

  const onCloseModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (backdropRef.current && backdropRef.current === e.target) {
      closeModal();
    }
  };

  return (
    <Portal>
      <div
        ref={backdropRef}
        className="fixed inset-0 w-full h-dvh bg-backdrop flex items-center justify-center z-50"
        onClick={(e) => onCloseModal(e)}
      >
        {children}
      </div>
    </Portal>
  );
}

export default ModalLayout;
