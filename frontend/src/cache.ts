export interface CacheStore {
    clear(key: string): Promise<void>;
    get<T>(key: string): Promise<T | null | undefined>;
    put<T>(key: string, value: T | null): Promise<void>;
}

type LocalCacheStoreEntry<T> = {
    data: T | null
};

export class LocalCacheStore implements CacheStore {
    public async clear(key: string): Promise<void> {
        localStorage.removeItem(key);
    }

    public async get<T>(key: string): Promise<T | null | undefined> {
        const stringEntry = localStorage.getItem(key);
        if (stringEntry === null) {
            return undefined;
        }
        const entry: LocalCacheStoreEntry<T> = JSON.parse(stringEntry);
        const data = entry.data;
        return data;
    }

    public async put<T>(key: string, value: T | null): Promise<void> {
        const entry: LocalCacheStoreEntry<T> = {
            data: value
        };
        localStorage.setItem(key, JSON.stringify(entry));
    }
}

export class Cache<T> {
    private _key: string;
    private _store: CacheStore;
    private _data?: T;

    public constructor(key: string, store: CacheStore) {
        this._key = key;
        this._store = store;
    }

    public async clear(): Promise<void> {
        return this._store.clear(this._key);
    }

    public async get(): Promise<T | null | undefined> {
        const data = await this._store.get<T>(this._key);
        if (data && !this._data) {
            this._data = data;
        }
        return data;
    }

    public async put(value: T | null): Promise<void> {
        await this._store.put<T>(this._key, value);
        this._data = value;
    }
}
