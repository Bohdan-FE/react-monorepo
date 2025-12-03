import { BsFillGrid1X2Fill } from 'react-icons/bs';

import { MdBubbleChart } from 'react-icons/md';
import { AiFillWechat } from 'react-icons/ai';
import { IoMdSettings } from 'react-icons/io';

export const NAVIGATION = [
  {
    name: 'Home',
    href: '/',
    IconComponent: BsFillGrid1X2Fill,
  },
  {
    name: 'Chat',
    href: '/chat',
    IconComponent: AiFillWechat,
  },
  {
    name: 'Bubbles',
    href: '/game',
    IconComponent: MdBubbleChart,
  },
  {
    name: 'Settings',
    href: '/settings',
    IconComponent: IoMdSettings,
  },
];
