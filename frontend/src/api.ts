import { AuthenticationError, Authentication, Device, Schedule } from "@langnes/smart-home-system-shared/api";
import { Cache, CacheStore } from "./cache";
import { Device, Schedule } from "@langnes/smart-home-system-shared/api";

export class ApiClient {
    private _deviceCache: Cache<Device[]>;
    private _scheduleCache: Cache<Schedule[]>;

    public constructor(cacheStore: CacheStore) {
        this._deviceCache = new Cache<Device[]>("devices", cacheStore);
        this._scheduleCache = new Cache<Schedule[]>("schedules", cacheStore);
    }

    public async getDeviceList(forceUpdate: boolean = false): Promise<Device[]> {
        if (!forceUpdate) {
            const cached = await this._deviceCache.get();
            if (cached) {
                return cached;
            }
        }
        const updated = await this.apiGet<Device[]>("/api/devices");
        this._deviceCache.put(updated);
        return updated;
    }

    public async getScheduleList(forceUpdate: boolean = false): Promise<Schedule[]> {
        if (!forceUpdate) {
            const cached = await this._scheduleCache.get();
            if (cached) {
                return cached;
            }
        }
        const updated = await this.apiGet<Schedule[]>("/api/schedules");
        this._scheduleCache.put(updated);
        return updated;
    }

    public async getDevice(id: string, forceUpdate: boolean = false): Promise<Device> {
        const entities = await this.getDeviceList(forceUpdate);
        return entities.find(entity => entity.id === id);
    }

    public async getSchedule(id: string, forceUpdate: boolean = false): Promise<Schedule> {
        const entities = await this.getScheduleList(forceUpdate);
        return entities.find(entity => entity.id === id);
    }

    public async executeCommand(params?: any): Promise<Device> {
        const updatedEntity = await this.apiPost<Device>("/api/command", params);
        const cachedList = await this.getDeviceList();
        const cacheIndex = cachedList.findIndex(entity => entity.id === updatedEntity.id);
        if (cacheIndex !== -1) {
            cachedList.splice(cacheIndex, 1, updatedEntity);
            this._deviceCache.put(cachedList);
        }
        return updatedEntity;
    }

    public async getAuthentication(): Promise<Authentication> {
        return await this.apiGet<Authentication>("/api/auth/current");
    }

    public async networkLogin(): Promise<Authentication> {
        return await this.apiPost<Authentication>("/api/auth/login/network");
    }

    public async localLogin(username: string, password: string): Promise<Authentication> {
        return await this.apiPost<Authentication>("/api/auth/login/local", {
            username,
            password
        });
    }

    public async logOut(): Promise<void> {
        return await this.apiPost<void>("/api/auth/logout");
    }

    private async callApi<T>(method: string, path: string, params?: any): Promise<T> {
        const response = await fetch(path, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(params),
            credentials: "same-origin"
        });
        if (response.status === 401) {
            throw new AuthenticationError("Unauthorized");
        }
        return await response.json();
    }

    private async apiGet<T>(path: string): Promise<T> {
        return await this.callApi<T>("GET", path);
    }

    private async apiPost<T>(path: string, params?: any): Promise<T> {
        return await this.callApi<T>("POST", path, params);
    }
}
