export type ContentType = 'Reels' | 'Screenshots';

export type ContentItem = {
    id: string;
    type: ContentType;
    data: Record<string, any>;
};
