export default function AuthorBadge({ role }: { role: '운영자' | '집사' }) {
    const isOp = role === '운영자';
    return (
        <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-medium ${isOp ? 'bg-[var(--color-pastelPink)] text-white' : 'bg-[var(--color-pastelBlue)] text-white'}`}>
      {role}
    </span>
    );
}
