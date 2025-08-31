export default function CatLogo({ size = 24 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            role="img"
            aria-label="Cat logo"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-siamBrown"
        >
            {/* 얼굴 배경 */}
            <circle cx="32" cy="32" r="26" className="fill-cream" />
            {/* 귀 */}
            <path d="M18 16 L26 22 L20 30 Z" className="fill-siamBrown" />
            <path d="M46 16 L38 22 L44 30 Z" className="fill-siamBrown" />
            {/* 눈 */}
            <ellipse cx="24" cy="34" rx="3" ry="2" className="fill-siamBrown" />
            <ellipse cx="40" cy="34" rx="3" ry="2" className="fill-siamBrown" />
            {/* 입 */}
            <path d="M28 42 Q32 45 36 42" className="stroke-siamBrown" strokeWidth="2" fill="none" />
            {/* 코 */}
            <circle cx="32" cy="38" r="1.5" className="fill-siamBrown" />
            {/* 수염 */}
            <path d="M32 39 q-8 4 -14 4" className="stroke-siamBrown" strokeWidth="1.5" fill="none" />
            <path d="M32 39 q8 4 14 4" className="stroke-siamBrown" strokeWidth="1.5" fill="none" />
        </svg>
    );
}
