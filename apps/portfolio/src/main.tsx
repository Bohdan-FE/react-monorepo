import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './app/pages/Home';
import Skills from './app/pages/Skills';
import Projects from './app/pages/Projects';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'skills',
        element: <Skills />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
    ],
  },
]);

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
