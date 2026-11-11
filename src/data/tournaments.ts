import apexHeroImg from '../assets/images/ps5_apex_hero_1791730950598.jpg';
import tacticalFpsImg from '../assets/images/ps5_tactical_fps_1791731000845.jpg';
import heistCityImg from '../assets/images/ps5_city_heist_1791730967151.jpg';
import soccerEsportsImg from '../assets/images/ps5_esports_soccer_1791731018539.jpg';

export type RegistrationStatus = 'Registration Open' | 'Closing Soon' | 'Waitlist';

export interface TournamentWinner {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

export interface AvailableTournament {
  id: string;
  name: string;
  game: string;
  format: string;
  dateLabel: string;
  startIso: string;
  prizePool: string;
  entry: string;
  filledSlots: number;
  maxSlots: number;
  status: RegistrationStatus;
  platform: string;
  description: string;
  image: string;
  featured?: boolean;
  squadRegistration?: boolean;
  winner?: TournamentWinner | null;
}

export interface TournamentSeasonStats {
  hosted: string;
  prizePool: string;
  players: string;
  champions: string;
}

export const defaultTournamentStats: TournamentSeasonStats = {
  hosted: '24',
  prizePool: '$18,400',
  players: '1,286',
  champions: '24',
};

export const defaultAvailableTournaments: AvailableTournament[] = [
  {
    id: 'dojo-cup-7',
    name: 'GM7 Dojo Cup #7',
    game: 'Apex Legends',
    format: '3v3 · Double Elimination · Bo3',
    dateLabel: 'Sat, Nov 7 · 18:00 UTC',
    startIso: '2026-11-07T18:00:00Z',
    prizePool: '$2,000',
    entry: 'Free entry',
    filledSlots: 47,
    maxSlots: 64,
    status: 'Registration Open',
    platform: 'PC / Console crossplay',
    description:
      'The flagship community cup returns. Squad up with two teammates, survive the double-elimination bracket, and take the Dojo Cup trophy live on Kick.',
    image: apexHeroImg,
    featured: true,
  },
  {
    id: 'midnight-vault',
    name: 'Midnight Vault Heist',
    game: 'GTA V RP',
    format: '4-player crews · Point race',
    dateLabel: 'Sat, Nov 14 · 20:00 UTC',
    startIso: '2026-11-14T20:00:00Z',
    prizePool: '$1,000',
    entry: 'Free entry',
    filledSlots: 21,
    maxSlots: 32,
    status: 'Registration Open',
    platform: 'PC only · NoPixel ruleset',
    description:
      'Four-player crews race the clock through three custom heists. Fastest clean getaway takes the vault, with bonus cash for zero alerts.',
    image: heistCityImg,
  },
  {
    id: 'fc-clash',
    name: 'FC Clash Invitational',
    game: 'EA Sports FC 27',
    format: '1v1 · Single Elimination · Bo3',
    dateLabel: 'Sat, Nov 21 · 17:00 UTC',
    startIso: '2026-11-21T17:00:00Z',
    prizePool: '$750',
    entry: 'Free entry',
    filledSlots: 96,
    maxSlots: 128,
    status: 'Closing Soon',
    platform: 'Crossplay · 6-min halves',
    description:
      'The fastest 128 players on the server go head-to-head. Ultimate Team or preset squads allowed, custom tactics encouraged.',
    image: soccerEsportsImg,
  },
  {
    id: 'precision-protocol',
    name: 'Precision Protocol',
    game: 'Valorant / CS2',
    format: '5v5 · Swiss into playoffs',
    dateLabel: 'Sat, Nov 28 · 19:00 UTC',
    startIso: '2026-11-28T19:00:00Z',
    prizePool: '$1,500',
    entry: 'Free entry',
    filledSlots: 32,
    maxSlots: 32,
    status: 'Waitlist',
    platform: 'PC only · Anti-cheat required',
    description:
      'A tactical shooter gauntlet for full five-stacks. Swiss stage seeds the top eight into a single-elimination playoff on stream.',
    image: tacticalFpsImg,
  },
];

