export const isClient = typeof window !== 'undefined';

export const getOperatorUIDs = (): string[] => {
    const raw = process.env.NEXT_PUBLIC_OPERATOR_UIDS || '';
    return raw.split(',').map(s => s.trim()).filter(Boolean);
};

export const getDeviceId = (): string => {
    if (!isClient) return 'server';
    const key = 'catiopia_device_id';
    let id = localStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
    }
    return id;
};
