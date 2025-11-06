import ModalProvider from './components/Provider/ModalProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import DragProvider from './components/Provider/DragProvider';
import gsap from 'gsap';
import { DrawSVGPlugin, MotionPathPlugin } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import { Outlet } from 'react-router';

gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin, useGSAP);

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <ModalProvider />
        <ReactQueryDevtools initialIsOpen={false} />
        <DragProvider />
      </QueryClientProvider>
    </>
  );
}

export default App;
