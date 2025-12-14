type technologies =
  | 'react'
  | 'tailwind'
  | 'tanstack'
  | 'zustand'
  | 'angular'
  | 'nodejs'
  | 'nextjs'
  | 'scss';

export interface Project {
  title: string;
  description: string;
  images: string[];
  technologies: technologies[];
  href: string;
}

export const PROJECTS_DATA: Project[] = [
  {
    title: 'Naruto Dashboard',
    description:
      'Anime-Inspired  Task Tracker & Live Chat App. A dynamic, Naruto-themed dashboard application designed to make productivity fun and social.',
    images: [
      '/naruto/1765048144454.jpeg',
      '/naruto/1765048222155.jpeg',
      '/naruto/1765048191836.jpeg',
      '/naruto/1765048263683.jpeg',
      '/naruto/1765048587057.jpeg',
    ],
    technologies: ['react', 'tailwind', 'tanstack', 'zustand', 'nodejs'],
    href: 'https://react-monorepo-eta.vercel.app',
  },
  {
    title: 'Citizen Conflict',
    description:
      'Landing page for the Citizen Conflict game, designed to showcase game features, factions, and the world of dystopian conflicts through an engaging and dynamic UI.',
    images: [
      '/cc/Screenshot-2025-12-08-at-23.17.31.png',
      '/cc/Screenshot-2025-12-08-at-23.17.48.png',
      '/cc/Screenshot-2025-12-08-at-23.18.02.png',
      '/cc/Screenshot-2025-12-08-at-23.18.15.png',
      '/cc/Screenshot-2025-12-08-at-23.18.51.png',
      '/cc/Screenshot-2025-12-08-at-23.19.09.png',
    ],
    technologies: ['angular', 'tailwind', 'scss'],
    href: 'https://citizenconflict.com',
  },
  {
    title: 'Aneemate',
    description:
      'A multi-page website for the Aneemate game universe, featuring game history, detailed character pages, and an integrated marketplace for buying and selling in-game tokens.',
    images: [
      '/anmt/Screenshot-2025-12-08-at-23.12.09.png',
      '/anmt/Screenshot-2025-12-08-at-23.12.36.png',
      '/anmt/Screenshot-2025-12-08-at-23.13.25.png',
      '/anmt/Screenshot-2025-12-08-at-23.13.39.png',
      '/anmt/Screenshot-2025-12-08-at-23.13.57.png',
      '/anmt/Screenshot-2025-12-08-at-23.14.28.png',
      '/anmt/Screenshot-2025-12-08-at-23.14.46.png',
      '/anmt/Screenshot-2025-12-08-at-23.16.29.png',
    ],
    technologies: ['angular', 'react', 'tailwind', 'tanstack'],
    href: 'https://aneemate.com',
  },

  {
    title: 'PlayOnToy',
    description:
      'An ecosystem platform for the TOY token, featuring blogs, a community portal, and interactive pages to explore token utilities and ecosystem insights.',
    images: [
      '/toy/Screenshot-2025-12-08-at-23.24.13.png',
      '/toy/Screenshot-2025-12-08-at-23.24.27.png',
      '/toy/Screenshot-2025-12-08-at-23.24.43.png',
      '/toy/Screenshot-2025-12-08-at-23.25.15.png',
      '/toy/Screenshot-2025-12-08-at-23.26.02.png',
      '/toy/Screenshot-2025-12-08-at-23.26.27.png',
    ],
    technologies: ['angular', 'tailwind', 'scss'],
    href: 'https://playontoy.com',
  },

  {
    title: 'PlayOnToy Market',
    description:
      'A web3 marketplace within the PlayOnToy ecosystem, enabling users to create wallets, buy, list, make offers on assets, and explore NFT collections seamlessly.',
    images: [
      '/market/Screenshot-2025-12-08-at-23.36.53.png',
      '/market/Screenshot-2025-12-08-at-23.37.08.png',
      '/market/Screenshot-2025-12-08-at-23.37.16.png',
      '/market/Screenshot-2025-12-08-at-23.37.26.png',
      '/market/Screenshot-2025-12-08-at-23.37.45.png',
      '/market/Screenshot-2025-12-08-at-23.39.04.png',
      '/market/Screenshot-2025-12-08-at-23.39.35.png',
    ],
    technologies: ['nextjs', 'tailwind', 'tanstack'],
    href: 'https://playontoy.com/market',
  },

  {
    title: 'Qorpo',
    description:
      'A comprehensive platform for the Qorpo ecosystem, allowing users to create wallets, explore and manage projects like Aneemate, Citizen Conflict, Toy, and Taix, and interact with the ecosystem seamlessly.',
    images: [
      '/qw/Screenshot-2025-12-08-at-23.20.36.png',
      '/qw/Screenshot-2025-12-08-at-23.20.51.png',
      '/qw/Screenshot-2025-12-08-at-23.21.13.png',
      '/qw/Screenshot-2025-12-08-at-23.21.23.png',
      '/qw/Screenshot-2025-12-08-at-23.21.46.png',
      '/qw/Screenshot-2025-12-08-at-23.22.42.png',
      '/qw/Screenshot-2025-12-08-at-23.22.21.png',
      '/qw/Screenshot-2025-12-08-at-23.22.51.png',
      '/qw/Screenshot-2025-12-08-at-23.23.20.png',
    ],
    technologies: ['angular', 'tailwind', 'scss'],
    href: 'https://qorpo.world',
  },

  {
    title: 'Taix',
    description:
      'A platform integrated with AI and Twitch services, allowing users to stream their gameplay while an AI commentator provides real-time commentary for viewers, showing followers how to play.',
    images: [
      '/taix/Screenshot-2025-12-08-at-23.27.23.png',
      '/taix/Screenshot-2025-12-08-at-23.27.47.png',
      '/taix/Screenshot-2025-12-08-at-23.27.58.png',
      '/taix/Screenshot-2025-12-08-at-23.28.26.png',
      '/taix/Screenshot-2025-12-08-at-23.28.09.png',
      '/taix/Screenshot-2025-12-08-at-23.28.37.png',
      '/taix/Screenshot-2025-12-08-at-23.30.48.png',
      '/taix/Screenshot-2025-12-08-at-23.30.29.png',
    ],
    technologies: ['angular', 'tailwind', 'scss'],
    href: 'https://taix.ai',
  },

  {
    title: 'DaoBlackSwan',
    description:
      'An investor portal where users can purchase investment packages, manage affiliates, and track the growth of their funds with a clear and interactive dashboard.',
    images: [
      '/dao/Screenshot-2025-12-08-at-23.31.41.png',
      '/dao/Screenshot-2025-12-08-at-23.32.20.png',
      '/dao/Screenshot-2025-12-08-at-23.33.03.png',
      '/dao/Screenshot-2025-12-08-at-23.34.06.png',
      '/dao/Screenshot-2025-12-08-at-23.33.35.png',
      '/dao/Screenshot-2025-12-08-at-23.34.52.png',
      '/dao/Screenshot-2025-12-08-at-23.35.06.png',
    ],
    technologies: ['angular', 'tailwind', 'scss'],
    href: 'https://daoblackswan.com/',
  },

  {
    title: 'FlixHub',
    description:
      'A web application to explore films and series, search content, read about actors, check reviews, and save favorites for later reference.',
    images: [
      '/flixHub/1718466417616.jpeg',
      '/flixHub/1718466493698.jpeg',
      '/flixHub/1718466542049.jpeg',
      '/flixHub/1718466752743.jpeg',
      '/flixHub/1718466675284.jpeg',
    ],
    technologies: ['nextjs', 'tailwind'],
    href: 'https://next-project-eight-khaki.vercel.app',
  },

  {
    title: 'Tamitos',
    description:
      'A playful educational project that helps neurodivergent kids feel understood and seen.',
    images: [
      '/tamitos/Screenshot6.png',
      '/tamitos/Screenshot2.png',
      '/tamitos/Screenshot3.png',
      '/tamitos/Screenshot4.png',
      '/tamitos/Screenshot5.png',
      '/tamitos/Screenshot1.png',
    ],
    technologies: ['angular', 'scss', 'tailwind'],
    href: 'https://tamitos.com',
  },
];
