import { HeroSlideDto } from './hero-slide.dto';
import { HowItWorksStepDto } from './how-it-works-step.dto';

export class HomepageContentDto {
  heroSlides: HeroSlideDto[];
  howItWorksSteps: HowItWorksStepDto[];
}
