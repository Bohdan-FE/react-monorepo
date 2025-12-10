// Uncomment this line to use CSS modules
// import styles from './app.module.css';

import { useLocation, useOutlet } from 'react-router';
import Layout from './layout/Layout';
import { AnimatePresence } from 'motion/react';

export function App() {
  const location = useLocation();
  const outlet = useOutlet();
  return (
    <Layout>
      <AnimatePresence mode="wait">
        {outlet && (
          <div className=" " key={location.pathname}>
            {outlet}
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;
