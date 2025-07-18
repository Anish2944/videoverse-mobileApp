export interface Video {
    _id: string;
    title: string;
    thumbnail: string;
    avatar?: string;
    views: number;
    duration: number;
    isPublished: boolean;
    description: string;
    videoFile: string;
    owner: string;
    channel?: string;
    createdAt: Date;
}