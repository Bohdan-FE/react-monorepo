import { useStore } from '../../../store/store';

function ModalProvider() {
  const modal = useStore((state) => state.modal);

  return <>{modal ? modal : null}</>;
}

export default ModalProvider;
