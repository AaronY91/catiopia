export interface Post {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    author: string;
    createdAt: Date | null;
    likes: number;
    commentsCount: number;
}

export interface Comment {
    id: string;
    postId: string;
    author: string;
    text: string;
    parentId: string | null;
    createdAt: Date | null;
}

export interface UserSettings {
    theme: 'light' | 'dark';
    viewMode: 'board' | 'gallery';
}
