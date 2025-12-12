// Uncomment this line to use CSS modules
// import styles from './app.module.css';

import { useLocation, useOutlet } from 'react-router';
import Layout from './layout/Layout';
import { AnimatePresence } from 'motion/react';
import { ModalProvider } from './context/modal-context';
import { Toaster } from 'react-hot-toast';
import { ScrollToTop } from './components/ScrollToTop';

export function App() {
  const location = useLocation();
  const outlet = useOutlet();
  return (
    <>
      <ScrollToTop />
      <ModalProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#000',
              color: '#fff',
              border: '2px solid #4b0082',
              padding: '12px 16px',
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: '#4b0082',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Layout>
          <AnimatePresence mode="wait">
            {outlet && (
              <div className=" md:perspective-distant" key={location.pathname}>
                {outlet}
              </div>
            )}
          </AnimatePresence>
        </Layout>
      </ModalProvider>
    </>
  );
}

export default App;
