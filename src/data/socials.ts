export type SocialPlatform = 'youtube' | 'kick' | 'tiktok' | 'instagram';

export interface SocialVideo {
  id: string;
  platform: SocialPlatform;
  title: string;
  url: string;
  thumb: string;
  category: string;
  duration?: string;
  views?: string;
  likes?: string;
  publishedAt?: string;
}
