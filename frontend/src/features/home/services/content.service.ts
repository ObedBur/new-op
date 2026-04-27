import { api } from '@/lib/axios';

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
    const response = await api.get<HomepageContent>('/content/homepage');
    return response.data;
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return {
      heroSlides: [],
      howItWorksSteps: [],
    };
  }
}
