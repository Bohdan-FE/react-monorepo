import { BsFillChatSquareTextFill } from 'react-icons/bs';
import { BsFillGrid1X2Fill } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdBubbleChart } from 'react-icons/md';

export const NAVIGATION = [
  {
    name: 'Home',
    href: '/',
    IconComponent: BsFillGrid1X2Fill,
  },
  {
    name: 'Chat',
    href: '/chat',
    IconComponent: BsFillChatSquareTextFill,
  },
  {
    name: 'Game',
    href: '/game',
    IconComponent: MdBubbleChart,
  },
  {
    name: 'Settings',
    href: '/settings',
    IconComponent: IoSettingsOutline,
  },
];
