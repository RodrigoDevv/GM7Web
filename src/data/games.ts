import apexImage from '../assets/images/ps5_apex_hero_1791730950598.jpg';
import fpsImage from '../assets/images/ArcRiders.jpeg';
import soulsImage from '../assets/images/ps5_souls_elden_1791730984139.jpg';
import heistImage from '../assets/images/ps5_city_heist_1791730967151.jpg';
import soccerImage from '../assets/images/ps5_esports_soccer_1791731018539.jpg';
import kickStreamImg from '../assets/images/LastOfUs.jpg';

export interface GameItem {
  id: string;
  title: string;
  genre: string;
  category: string;
  tag: string;
  image: string;
  scheduleDay: string;
  initialHypes: number;
  rankBadge: string;
  loadout: string;
  squadStatus: string;
  description: string;
}

export interface UpcomingGame {
  id: string;
  hint: string;
}

export const defaultGames: GameItem[] = [
  {
    id: 'apex',
    title: 'Ghost of Tsushima',
    genre: 'Action RPG',
    category: 'RPG',
    tag: 'Main Grind',
    image: apexImage,
    scheduleDay: 'Mon & Fri',
    initialHypes: 1240,
    rankBadge: 'Predator Top 500',
    loadout: 'Wingman + R-99 (Wraith / Octane)',
    squadStatus: 'Open for Community 1v1s & Trios',
    description: 'High APM movement tech, ranked drops, and 20-bomb challenges every Monday & Friday night.',
  },
  {
    id: 'tactical-fps',
    title: 'Arc Riders',
    genre: 'Tactical Shooter',
    category: 'FPS',
    tag: 'Ranked Demon',
    image: fpsImage,
    scheduleDay: 'Tue & Thu',
    initialHypes: 980,
    rankBadge: '22,500 Premier ELO / Radiant',
    loadout: 'Vandal / AK-47 One-Taps Only',
    squadStatus: '5-Stack Subscriber Queue',
    description: 'Tactical execute rounds, headshot accuracy practice, and high-stakes wager matches on stream.',
  },
  {
    id: 'elden-ring',
    title: 'Red Dead',
    genre: 'Action-adventure',
    category: 'Adventure',
    tag: 'No-Hit Runs',
    image: soulsImage,
    scheduleDay: 'Wednesdays',
    initialHypes: 1540,
    rankBadge: 'All Bosses RL1 Cleared',
    loadout: 'Naked Club / Dual Curved Swords',
    squadStatus: 'Chat Chooses Challenge Modifiers',
    description: 'Punishing challenge runs, DLC boss speedruns, and community co-op invasions.',
  },
  {
    id: 'gta-rp',
    title: 'GTA V',
    genre: 'Open World',
    category: 'RP',
    tag: 'Crime Boss',
    image: heistImage,
    scheduleDay: 'Saturdays',
    initialHypes: 1890,
    rankBadge: 'Most Wanted — $50M+ Earned',
    loadout: 'Custom Tuner + Suppressed SMG',
    squadStatus: 'Subscribers Join Bank Heist Crew',
    description: 'High-speed getaway chases, multi-million dollar bank heists, and legendary storylines.',
  },
  {
    id: 'fc26',
    title: 'EA Sports FC 27',
    genre: 'Competitive Football',
    category: 'Sports',
    tag: 'Champions',
    image: soccerImage,
    scheduleDay: 'Sundays',
    initialHypes: 820,
    rankBadge: 'Rank 1 / Elite Division',
    loadout: '4-3-2-1 Direct Passing Meta',
    squadStatus: 'Viewer 1v1 Friendlies & Squad Battles',
    description: 'Ultimate Team Champions finals, pack openings, and custom tactics breakdown with chat.',
  },
  {
    id: 'cs2',
    title: 'The Last Of Us',
    genre: 'Tactical Shooter',
    category: 'FPS',
    tag: 'Premier Grind',
    image: kickStreamImg,
    scheduleDay: 'Tuesdays',
    initialHypes: 1120,
    rankBadge: '15,000 Premier ELO',
    loadout: 'AK-47 One-Taps & AWP Holds',
    squadStatus: '5-Stack Subscriber Queue',
    description: 'Premier rank climbs, sharp utility executes, and clutch highlight rounds every Tuesday night.',
  },
];

export const upcomingGames: UpcomingGame[] = Array.from({ length: 30 }, (_, index) => ({
  id: `upcoming-${index + 1}`,
  hint: 'Soon',
}));
