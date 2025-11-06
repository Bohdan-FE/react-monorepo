import './styles.css';
import { createBrowserRouter, RouterProvider } from 'react-router';

import ReactDOM from 'react-dom/client';
import App from './app/App';
import Home from './app/pages/Home';
import ChatPage from './app/pages/Chat';
import Game from './app/pages/Game';
import ProtectedRoute from './app/components/ProtectedRouter/ProtectedRouter';
import Authenticate from './app/pages/Authenticate';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // base layout
    children: [
      {
        path: '/authenticate',
        element: <Authenticate />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'chat',
            element: <ChatPage />,
          },
          {
            path: 'game',
            element: <Game />,
          },
        ],
      },
    ],
  },
]);

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
