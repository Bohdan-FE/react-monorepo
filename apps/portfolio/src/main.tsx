import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './app/pages/Home';
import Skills from './app/pages/Skills';
import Projects from './app/pages/Projects';
import Contacts from './app/pages/Contacts';
import StylingSkillsPage from './app/components/StylingSkillsPage';
import LogicSkillsPage from './app/components/LogicSkillsPage';
import BackendSkillsPage from './app/components/BackendSkillsPage';

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
        children: [
          {
            index: true,
            element: <Skills />,
          },
          {
            path: 'styling',
            element: <StylingSkillsPage />,
          },
          {
            path: 'frontend',
            element: <LogicSkillsPage />,
          },
          {
            path: 'backend',
            element: <BackendSkillsPage />,
          },
        ],
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'contacts',
        element: <Contacts />,
      },
    ],
  },
]);

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
