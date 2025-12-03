import { useState } from 'react';
import ModalLayout from '../../layout/ModalLayout';
import LoginForm from '../LoginForm';
import { useUser } from '../../../hooks/useUser';

function AuthModal() {
  const [activeModal, setActiveModal] = useState(<LoginForm />);
  const { data: user } = useUser();

  if (user) {
    return null;
  }

  return (
    <ModalLayout>
      {activeModal}
      {/* <button>
        <span onClick={() => setActiveModal(<LoginForm />)}>Login</span>
        <span
          onClick={() =>
            setActiveModal(<RegisterForm setActiveModal={setActiveModal} />)
          }
        >
          Register
        </span>
      </button> */}
    </ModalLayout>
  );
}

export default AuthModal;
