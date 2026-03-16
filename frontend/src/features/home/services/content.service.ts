import { api } from '@/lib/api';

export interface HeroSlide {
  id: string;
  title: string;
  imageUrl: string;
  label?: string;
}

export interface HowItWorksStep {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface HomepageContent {
  heroSlides: HeroSlide[];
  howItWorksSteps: HowItWorksStep[];
}

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const data = await api.get('/content/homepage');
    return data;
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return {
      heroSlides: [],
      howItWorksSteps: [],
    };
  }
}
