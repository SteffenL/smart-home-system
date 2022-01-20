<template>
    <v-list>
        <v-list-item-group>
            <template v-for="schedule, index in schedules">
                <v-divider v-if="index > 0" :key="index"></v-divider>
                <v-list-item :key="schedule.id" :to="`/schedules/${schedule.id}`" replace>
                    <v-list-item-content>
                        <v-list-item-title>{{ schedule.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ schedule.when }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-list-item-group>
    </v-list>
</template>

<style lang="scss">
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { ApiClient } from "../src/api";

@Component
export default class ScheduleList extends Vue {
    private schedules = [];
    private _api: ApiClient
    private _pollTimer

    created() {
        this._api = (this as any).$api as ApiClient;
        this._fetchSchedules();
    }

    beforeDestroy() {
        if (this._pollTimer) {
            clearTimeout(this._pollTimer);
            this._pollTimer = null;
        }
    }

    async _fetchSchedules() {
        try {
            const schedules = await this._api.getScheduleList(true);
            this.schedules.splice(0, this.schedules.length, ...schedules);
        } finally {
            this._pollTimer = setTimeout(() => this._fetchSchedules(), 5000);
        }
    }
}
</script>
