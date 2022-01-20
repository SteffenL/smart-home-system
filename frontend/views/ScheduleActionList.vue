<template>
    <div v-if="schedule">
        <v-list flat>
            <v-list-item-group active-class="">
                <template v-for="action, index in schedule.actions">
                    <v-divider v-if="index > 0" :key="`${index}-a`"></v-divider>
                    <v-list-item :key="`${index}-b`">
                        <v-list-item-content>
                            <v-list-item-title>{{ _getActionTitle(action) }}</v-list-item-title>
                            <v-list-item-subtitle>{{ _getActionSubtitle(action, index) }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </template>
            </v-list-item-group>
        </v-list>
    </div>
</template>

<style lang="scss">
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { ApiClient } from "../src/api";
import { Action, ActionType, CommandAction, DelayAction, Device } from "@langnes/smart-home-system-shared/api";

@Component
export default class ScheduleActionList extends Vue {
    private schedule = null;
    private actionReferences = {};

    private _api: ApiClient

    async created() {
        this._api = (this as any).$api as ApiClient;
        const id = (this as any).$route.params.id;
        const schedule = await this._api.getSchedule(id);

        for (const index in schedule.actions) {
            const action = schedule.actions[index];
            switch (action.type) {
                case ActionType.COMMAND: {
                    const a = action as CommandAction;
                    const device = await this._api.getDevice(a.device);
                    this.$set(this.actionReferences, index, device);
                }

                case ActionType.DELAY:
                    break;
            }
        }
        this.schedule = schedule;
    }

    private _getActionTitle(action: Action): string {
        switch (action.type) {
            case ActionType.COMMAND:
                return "Command";
            case ActionType.DELAY:
                return "Delay";
        }
    }

    private _getActionSubtitle(action: Action, index: number): string {
        switch (action.type) {
            case ActionType.COMMAND: {
                const device = this.actionReferences[index] as CommandAction;
                const commandAction = action as CommandAction;
                return `Send command "${commandAction.command}" to device "${device.name}".`;
            }

            case ActionType.DELAY: {
                const delayAction = action as DelayAction;
                return `Delay for ${delayAction.value} ${delayAction.unit}(s).`;
            }
        }
    }
}
</script>
