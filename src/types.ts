export const BLOCK_TYPES = ['text', 'image', 'button', 'divider', 'spacer', 'social', 'menu', 'hero', 'video', 'row'] as const;
export type BlockType = typeof BLOCK_TYPES[number];

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'github';
  url: string;
  active: boolean;
}

export interface MenuItem {
  label: string;
  url: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  backgroundImage: string;
  overlayOpacity: number;
  overlayColor: string;
}

export interface VideoData {
  thumbnailUrl: string;
  videoUrl: string;
  playButtonColor: string;
  playButtonSize: string;
}

export interface EmailBlock {
  id: string;
  type: BlockType;
  content?: string;
  url?: string;
  socialLinks?: SocialLink[];
  menuItems?: MenuItem[];
  heroData?: HeroData;
  videoData?: VideoData;
  columns?: EmailColumn[];
  style: {
    backgroundColor?: string;
    color?: string;
    padding?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontSize?: string;
    borderRadius?: string;
    width?: string;
    height?: string;
    blockBackgroundColor?: string;
    iconSize?: string;
    itemSpacing?: string;
  };
}

export interface EmailColumn {
  id: string;
  width: string; // e.g. "50%" or "100%"
  blocks: EmailBlock[];
}

export interface EmailTemplate {
  blocks: EmailBlock[];
}
