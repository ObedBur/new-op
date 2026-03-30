import { ContentService } from './content.service';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    getHomepageContent(): Promise<import("./dto/homepage-content.dto").HomepageContentDto>;
}
