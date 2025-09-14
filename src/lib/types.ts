export type ContentType = 'Reels' | 'Screenshots' | 'Greetings';

export type ContentItem = {
    id: string;
    type: ContentType;
    data: Record<string, any>;
    createdAt: Date;
};
