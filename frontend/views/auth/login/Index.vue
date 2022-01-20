<template>
    <div>
        <v-container fluid>
            Log in with an authentication method of your choice.
        </v-container>
        <v-list three-line>
            <v-list-item-group>
                <v-list-item @click.stop="continueNetworkLogin()">
                    <v-list-item-content>
                        <v-list-item-title>Network</v-list-item-title>
                        <v-list-item-subtitle>Log in based on the network your device is currently connected to.</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item to="/auth/login/local" replace>
                    <v-list-item-content>
                        <v-list-item-title>Local account</v-list-item-title>
                        <v-list-item-subtitle>Log in with a local account.</v-list-item-subtitle>
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

@Component
export default class LoginIndex extends Vue {
    continueNetworkLogin() {
        this.$store.dispatch("networkLogin");
    }
}
</script>
