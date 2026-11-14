import heroSlideOne from '../assets/images/gta-banner.webp';
import heroSlideTwo from '../assets/images/cod-banner.jpg';
import heroSlideThree from '../assets/images/uncharted-banner.jpg';

export interface HeroSlide {
  id: string;
  src: string;
  alt: string;
}

export const defaultHeroSlides: HeroSlide[] = [
  { id: 'hero-1', src: heroSlideOne, alt: 'Grand Theft Auto V' },
  { id: 'hero-2', src: heroSlideTwo, alt: 'Call of Duty' },
  { id: 'hero-3', src: heroSlideThree, alt: 'Uncharted 4' },
];
