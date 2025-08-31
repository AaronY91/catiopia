import Link from 'next/link';
import Image from 'next/image';
import AuthorBadge from './AuthorBadge';
import LikeButton from './LikeButton';
import { MediaItem, PostDoc } from '@/lib/types';

export default function PostCard({ post }: { post: PostDoc }) {
    const thumb = post.thumbnailUrl || post.media?.[0]?.url || null;
    const isVideoThumb = thumb && post.media?.find((m: MediaItem) => m.url === thumb)?.type === 'video';

    return (
        <Link href={`/post/${post.id}`} className="card p-4 shadow hover:shadow-lg transition block">
            <h2 className="font-bold text-lg">{post.title}</h2>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span>{post.author}</span>
                <AuthorBadge role={post.authorRole} />
            </div>
            {thumb && (
                <div className="mt-3">
                    {isVideoThumb ? (
                        <video src={thumb} className="w-full h-56 object-cover rounded" muted playsInline />
                    ) : (
                        <Image
                            src={thumb}
                            alt="썸네일"
                            width={800}
                            height={450}
                            className="w-full h-56 object-cover rounded"
                        />
                    )}
                </div>
            )}
            <p className="mt-2 line-clamp-2">{post.content}</p>
            <div className="mt-3">
                <LikeButton postId={post.id} />
            </div>
        </Link>
    );
}
