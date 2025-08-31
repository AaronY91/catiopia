export default function AuthorBadge({ role }: { role: '운영자' | '집사' }) {
    const isOperator = role === '운영자';
    return (
        <span
            className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium
        ${isOperator
                ? 'bg-pastelPink text-white dark:bg-pastelPink-dark dark:text-siamBrown-dark'
                : 'bg-pastelBlue text-white dark:bg-pastelBlue-dark dark:text-siamBrown-dark'
            }`}
        >
      {role}
    </span>
    );
}
