// lib/types.ts

export type ThemeMode = 'light' | 'dark';
export type ViewMode = 'board' | 'gallery';

export type UserSettings = {
    theme: ThemeMode;
    viewMode: ViewMode;
};

export type MediaType = 'image' | 'video';

export interface MediaItem {
    url: string;
    type: MediaType;
    path: string;
}

export type AuthorRole = '운영자' | '집사';

export interface PostDoc {
    id: string;
    title: string;
    content: string;
    author: string; // 표시용 이름
    authorRole: AuthorRole;
    media: MediaItem[];
    thumbnailUrl?: string | null;
    likeCount: number;
    createdAt: Date | null;
    uid?: string | null;
}

export interface CommentDoc {
    id: string;
    text: string;
    author: string;
    authorRole: AuthorRole;
    parentId?: string | null;
    createdAt: Date | null;
}
