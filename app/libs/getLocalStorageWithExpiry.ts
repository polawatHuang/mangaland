const getLocalStorageWithExpiry = (key: string): string | null => {
    const storedData = localStorage.getItem(key);
    if (!storedData) return null;

    const { value, expiry } = JSON.parse(storedData);

    if (new Date().getTime() > expiry) {
        console.warn(`${key} has expired`);
        localStorage.removeItem(key);
        return null;
    }

    return value;
};