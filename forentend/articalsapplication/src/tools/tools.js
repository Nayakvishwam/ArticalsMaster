export const getLocalStorage = (key) => {
    if (typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
    }
    return null;
};

export const setLocalStorage = (key, value) => {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
    }
};

export const removeLocalStorage = (key) => {
    if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
    }
};