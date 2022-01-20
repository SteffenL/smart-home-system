import { User } from "@langnes/smart-home-system-shared/api";
import VueRouter from "vue-router";
import * as Vuex from "vuex";

import { ApiClient } from "./api";

export type State = {
    user?: User
};

export function createStore(router: VueRouter, api: ApiClient) {
    const store = new Vuex.Store({
        state: {
            user: null
        } as State,
        actions: {
            async networkLogin(context) {
                await api.networkLogin();
                router.replace("/");
            },
            async localLogin(context, params) {
                await api.localLogin(params.username, params.password);
                router.replace("/");
            },
            async logout(context) {
                await api.logOut();
                store.commit("setUser", null);
                router.replace("/");
            }
        },
        mutations: {
            setUser(state, user?: User) {
                state.user = user;
            }
        }
    });

    router.beforeEach(async (to, from, next) => {
        const requiresAuthentication = to.meta.requiresAuthentication;
        let user = store.state.user;
        if (!user) {
            try {
                const response = await api.getAuthentication();
                store.commit("setUser", response.user);
                user = response.user;
            } catch(err) {
                // Do nothing
            }
        }
        if (user || !requiresAuthentication) {
            next();
        } else {
            next({ path: "/auth/login", replace: true });
        }
    });

    return store;
}
