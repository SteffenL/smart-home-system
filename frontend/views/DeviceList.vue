<template>
    <v-list flat subheader>
        <v-list-item-group active-class="" v-for="deviceType in Object.keys(devices)" :key="deviceType">
            <v-subheader>{{ getDeviceTypeHeader(deviceType) }}</v-subheader>
            <template v-for="device, index in devices[deviceType]">
                <v-divider v-if="index > 0" :key="index"></v-divider>
                <v-list-item :key="device.id" @click.stop="onTappedDevice(device)">
                    <v-list-item-icon>
                        <v-icon :title="device.type">{{ getDeviceTypeIcon(device.type) }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ device.name }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn @click.stop="onPerformDeviceAction(device)" v-if="deviceHasAction(device)" style="z-index: 1">
                            <v-icon :color="device.state.relayState ? 'green' : 'grey darken-1'" :alt="device.state.relayState ? 'On' : 'Off'">mdi-power</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
            </template>
        </v-list-item-group>
    </v-list>
</template>

<style lang="scss">
</style>

<script lang="ts">
import { Device, DeviceType } from "@langnes/smart-home-system-shared/api";
import Vue from "vue";
import Component from "vue-class-component";
import { ApiClient } from "../src/api";

@Component
export default class DeviceList extends Vue {
    private devices: { [key: string]: Device[] } = {};
    private _api: ApiClient
    private _pollTimer

    created() {
        this._api = (this as any).$api as ApiClient;
        this._fetchDevices();
    }

    beforeDestroy() {
        if (this._pollTimer) {
            clearTimeout(this._pollTimer);
            this._pollTimer = null;
        }
    }

    private getDeviceTypeHeader(type: DeviceType) {
        switch (type) {
            case DeviceType.PLUG:
                return "Plugs";
        }
    };

    private getDeviceTypeIcon(type: DeviceType) {
        switch (type) {
            case DeviceType.PLUG:
                return "mdi-power-plug";
        }
    };

    onTappedDevice(device: Device) {
        this.$router.replace(`/devices/${device.id}`);
    }

    async onPerformDeviceAction(device: Device) {
        switch (device.type) {
            case DeviceType.PLUG:
                await this._executeCommand(device, device.state.relayState ? "off" : "on");
                break;
        }
    }

    deviceHasAction(device: Device): boolean {
        switch (device.type) {
            case DeviceType.PLUG:
                return true;
            default:
                return false;
        }
    }

    async _executeCommand(device: Device, command: string) {
        const updatedDevice = await this._api.executeCommand({
            id: device.id,
            command
        });
        Object.assign(device, updatedDevice);
        const cachedDevices = await this._api.getDeviceList();
        const cachedDevice = cachedDevices.find(d => d.id === device.id);
        if (cachedDevice) {
            Object.assign(cachedDevice, device);
        }
    }

    private async _fetchDevices() {
        try {
            const devices = await this._api.getDeviceList(true);
            Object.keys(this.devices).forEach(k => delete this.devices[k]);
            for (const device of devices) {
                if (!this.devices[device.type]) {
                    Vue.set(this.devices, device.type, []);
                }
                this.devices[device.type].push(device);
            }
        } finally {
            this._pollTimer = setTimeout(() => this._fetchDevices(), 5000);
        }
    }
}
</script>
