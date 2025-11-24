import ModalProvider from './components/Provider/ModalProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import DragProvider from './components/Provider/DragProvider';
import gsap from 'gsap';
import { DrawSVGPlugin, MotionPathPlugin } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import { Outlet } from 'react-router';
import { GoogleOAuthProvider } from '@react-oauth/google';

gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin, useGSAP);

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId="1065788413490-0sl0ualo6o7od2emndcriri4lbq1dcm5.apps.googleusercontent.com">
          <Outlet />
          <ModalProvider />
          <ReactQueryDevtools initialIsOpen={false} />
          <DragProvider />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
