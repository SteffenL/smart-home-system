import { Device } from "@langnes/smart-home-system-shared/domain";

export class ApiClient {
    public async getDeviceList(): Promise<Device[]> {
        return await this.apiGet<Device[]>("/api/devices");
    }

    public async executeCommand(params?: any): Promise<Device> {
        return await this.apiPost<Device>("/api/command", params);
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
        return await response.json();
    }

    private async apiGet<T>(path: string): Promise<T> {
        return await this.callApi<T>("GET", path);
    }

    private async apiPost<T>(path: string, params?: any): Promise<T> {
        return await this.callApi<T>("POST", path, params);
    }
}
