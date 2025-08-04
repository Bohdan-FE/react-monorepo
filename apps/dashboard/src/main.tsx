import './styles.css';
import { createBrowserRouter, RouterProvider } from 'react-router';

import ReactDOM from 'react-dom/client';
import App from './app/App';
import Home from './app/pages/Home';
import ChatPage from './app/pages/Chat';

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '/',
        Component: Home,
      },
      {
        path: '/chat',
        Component: ChatPage,
      },
    ],
  },
]);

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
