<template>
    <div v-if="device">
        <v-list flat subheader>
            <v-subheader>General</v-subheader>
            <v-list-item-group active-class="">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Name</v-list-item-title>
                        <v-list-item-subtitle>{{ device.name }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Address</v-list-item-title>
                        <v-list-item-subtitle>{{ device.address }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Type</v-list-item-title>
                        <v-list-item-subtitle>{{ device.type }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <template v-if="device.type === 'plug'">
                    <v-divider></v-divider>
                    <v-list-item @click.stop="onRelayStateChange(device)">
                        <v-list-item-content>
                            <v-list-item-title>Relay state</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-switch readonly :input-value="device.state.relayState" inset :label="device.state.relayState ? 'On' : 'Off'"></v-switch>
                        </v-list-item-action>
                    </v-list-item>
                </template>
            </v-list-item-group>
        </v-list>
    </div>
</template>

<style lang="scss">
</style>

<script lang="ts">
import { Device, DeviceType } from "@langnes/smart-home-system-shared/api";
import Vue from "vue";
import Component from "vue-class-component";
import { ApiClient } from "../src/api";

@Component
export default class DeviceDetail extends Vue {
    private device = null;
    private _api: ApiClient
    private _pollTimer

    async created() {
        this._api = (this as any).$api as ApiClient;
        const id = (this as any).$route.params.id;
        this.device = await this._api.getDevice(id);
    }

    beforeDestroy() {
        if (this._pollTimer) {
            clearTimeout(this._pollTimer);
            this._pollTimer = null;
        }
    }

    async onRelayStateChange(device: Device) {
        await this._executeCommand(device, device.state.relayState ? "off" : "on");
    }

    async _executeCommand(device: Device, command: string) {
        const updatedDevice = await this._api.executeCommand({
            id: device.id,
            command
        });
        Object.assign(device, updatedDevice);
    }
}
</script>
