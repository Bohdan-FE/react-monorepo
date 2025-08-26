import DashBoardLayout from './layout/DashBoardLayout';
import ModalProvider from './components/Provider/ModalProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import DragProvider from './components/Provider/DragProvider';
import gsap from 'gsap';
import { DrawSVGPlugin, MotionPathPlugin } from 'gsap/all';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(MotionPathPlugin, DrawSVGPlugin, useGSAP);

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <DashBoardLayout />
        <ModalProvider />

        <ReactQueryDevtools initialIsOpen={false} />
        <DragProvider />
      </QueryClientProvider>
    </>
  );
}

export default App;
