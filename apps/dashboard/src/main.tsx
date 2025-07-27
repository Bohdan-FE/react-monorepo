import './styles.css';
import { createBrowserRouter, RouterProvider } from 'react-router';

import ReactDOM from 'react-dom/client';
import App from './app/App';
import Home from './app/pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '/',
        Component: Home,
      },
    ],
  },
]);

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
