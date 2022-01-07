import * as net from "net";
import { AbstractTask, TaskCallback, TaskScheduler } from "../task";
import { Device } from "@langnes/smart-home-system-shared/domain";

export interface ApiParams {
    address: string;
    body: any;
}

export class ApiCipher {
    public static encrypt(plaintext: string): Buffer {
        const plaintextBuffer = Buffer.from(plaintext, "utf-8");
        const ciphertextBuffer = Buffer.alloc(4 + plaintextBuffer.byteLength);
        ciphertextBuffer.writeUInt32BE(plaintextBuffer.byteLength, 0);
        const encryptedPayloadBuffer = ciphertextBuffer.subarray(4);
        let key = 171;
        for (let i = 0; i < plaintextBuffer.byteLength; ++i) {
            key ^= plaintextBuffer.readUInt8(i);
            encryptedPayloadBuffer.writeUInt8(key, i);
        }
        return ciphertextBuffer;
    }

    public static decrypt(ciphertextBuffer: Buffer): string {
        const ciphertextLength = ciphertextBuffer.readUInt32BE(0);
        const encryptedPayloadBuffer = ciphertextBuffer.subarray(4, 4 + ciphertextLength);
        const plaintextBuffer = Buffer.alloc(ciphertextLength);
        let key = 171;
        for (let i = 0; i < encryptedPayloadBuffer.byteLength; ++i) {
            const c = encryptedPayloadBuffer.readUInt8(i);
            const a = key ^ c;
            key = c;
            plaintextBuffer.writeUInt8(a, i);
        }
        const plaintext = plaintextBuffer.toString("utf-8");
        return plaintext;
    }
}

export class ApiTask extends AbstractTask<any> {
    private readonly _params: ApiParams;

    public constructor(params: ApiParams, callback: TaskCallback<any>) {
        super(callback);
        this._params = params;
    }

    protected async _do_invoke(): Promise<any> {
        const plainDataToSend = JSON.stringify(this._params.body);
        const cipherDataToSend = ApiCipher.encrypt(plainDataToSend);
        const port = 9999;
        const timeout = 10000;
        const socketOptions: net.NetConnectOpts = {
            port,
            host: this._params.address,
            timeout
        };
        return await new Promise((resolve, reject) => {
            let result: string;
            let socketError: Error;
            const socket = net.createConnection(socketOptions);
            socket.on("connect", () => {
                //console.debug(`Sending to ${socket.remoteAddress}: ${plainDataToSend}`);
                socket.write(cipherDataToSend);
            });
            socket.on("data", data => {
                result = ApiCipher.decrypt(data);
                //console.debug(`Received from ${socket.remoteAddress}: ${result}`);
                socket.destroy();
            });
            socket.on("error", err => {
                socketError = err;
            });
            socket.on("close", hadError => {
                if (hadError) {
                    reject(socketError);
                } else {
                    resolve(JSON.parse(result));
                }
            });
        });
    }
}

const taskScheduler = new TaskScheduler();

function scheduleApiTask(params: ApiParams): Promise<any> {
    return new Promise((resolve, reject) => {
        const task = new ApiTask(params, {
            async completed(result) {
                resolve(result);

            },
            async errored(err?: any) {
                reject(err);
            }
        });
        taskScheduler.schedule(task);
    });
}

export async function setRelayState(device: Device, state: boolean): Promise<any> {
    const params: ApiParams = {
        address: device.address,
        body: { "system": { "set_relay_state": { "state": state } } }
    };
    const taskResult = await scheduleApiTask(params);
    return taskResult.system.set_relay_state;
}

export async function getSysInfo(device: Device): Promise<any> {
    const params: ApiParams = {
        address: device.address,
        body: { "system": { "get_sysinfo": null } }
    };
    const taskResult = await scheduleApiTask(params);
    return taskResult.system.get_sysinfo;
}
