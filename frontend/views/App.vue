<template>
    <v-app>
        <v-navigation-drawer app v-model="drawer">
            <v-list nav>
                <v-list-group v-if="isLoggedIn" no-action prepend-icon="mdi-view-dashboard" :value="true">
                    <template v-slot:activator>
                        <v-list-item-content>
                            <v-list-item-title>Dashboard</v-list-item-title>
                        </v-list-item-content>
                    </template>
                    <v-list-item to="/devices" replace>
                        <v-list-item-content>
                            <v-list-item-title>Devices</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item to="/schedules" replace>
                        <v-list-item-content>
                            <v-list-item-title>Schedules</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                <v-list-item-group>
                    <v-list-item v-if="!isLoggedIn" to="/auth/login" replace>
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Log in</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="isLoggedIn" to="/auth/logout" replace>
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Log out</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item to="/support" replace>
                        <v-list-item-icon>
                            <v-icon>mdi-help</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title>Get help</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar app>
            <v-app-bar-nav-icon v-if="!$route.meta.showBackButton" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-btn v-if="$route.meta.showBackButton" icon active-class="" @click="navigateBack" replace>
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <component :is="toolbarRightActions" />
        </v-app-bar>
        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<style lang="scss">
</style>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class App extends Vue {
    drawer = null

    get toolbarRightActions() {
        return this.$route.meta.toolbarRightActions;
    }

    get isLoggedIn(): boolean {
        return !!this.$store.state.user;
    }

    navigateBack() {
        const newPath = this.$route.path.split("/").slice(0, -1).join("/");
        this.$router.replace(newPath);
    }
}
</script>
