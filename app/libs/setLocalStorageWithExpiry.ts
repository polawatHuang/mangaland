const setLocalStorageWithExpiry = (key: string, value: string, expiryInDays: number) => {
    const now = new Date();
    const expiryTimestamp = now.getTime() + expiryInDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    const data = {
        value,
        expiry: expiryTimestamp,
    };

    localStorage.setItem(key, JSON.stringify(data));
};