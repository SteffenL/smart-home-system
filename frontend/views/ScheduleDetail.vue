<template>
    <div v-if="schedule">
        <v-list flat>
            <v-list-item-group active-class="">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Name</v-list-item-title>
                        <v-list-item-subtitle>{{ schedule.name }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Enabled</v-list-item-title>
                        <v-list-item-subtitle>{{ schedule.enabled ? "Yes" : "No" }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>When</v-list-item-title>
                        <v-list-item-subtitle>{{ schedule.when }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>Time zone</v-list-item-title>
                        <v-list-item-subtitle>{{ schedule.timeZone || "Default" }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
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

@Component
export default class ScheduleDetail extends Vue {
    private schedule = null;

    private _api: ApiClient

    async created() {
        this._api = (this as any).$api as ApiClient;
        const id = (this as any).$route.params.id;
        this.schedule = await this._api.getSchedule(id);
    }
}
</script>
