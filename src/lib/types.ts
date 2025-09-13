export type ContentType = 'YouTube' | 'Images' | 'Reels' | 'Screenshots';

export type ContentItem = {
    id: string;
    type: ContentType;
    data: Record<string, any>;
};
