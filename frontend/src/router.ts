import VueRouter from "vue-router";

import Support from "../views/Support.vue";
import LoginIndex from "../views/auth/login/Index.vue";
import LocalLogin from "../views/auth/login/LocalLogin.vue";
import Logout from "../views/auth/Logout.vue";
import DeviceDetail from "../views/DeviceDetail.vue";
import DeviceList from "../views/DeviceList.vue";
import ScheduleList from "../views/ScheduleList.vue";
import ScheduleDetail from "../views/ScheduleDetail.vue";
import ScheduleDetailRoot from "../views/ScheduleDetailRoot.vue";
import ScheduleActionList from "../views/ScheduleActionList.vue";
import ScheduleActionListToolbarActions from "../views/ScheduleActionListToolbarActions.vue";
import ScheduleDetailToolbarActions from "../views/ScheduleDetailToolbarActions.vue";
import Dashboard from "../views/Dashboard.vue";

export function createRouter(): VueRouter {
    const router = new VueRouter({
        //mode: "history",
        mode: "hash",
        routes: [
            {
                path: "/",
                component: Dashboard,
                redirect: "/devices",
                meta: {
                    title: "Dashboard",
                    requiresAuthentication: true
                },
                children: [
                    {
                        path: "devices",
                        component: DeviceList,
                        meta: {
                            title: "Devices",
                            requiresAuthentication: true
                        }
                    },
                    {
                        path: "devices/:id",
                        component: DeviceDetail,
                        meta: {
                            title: "Device",
                            requiresAuthentication: true,
                            showBackButton: true
                        }
                    },
                    {
                        path: "schedules",
                        component: ScheduleList,
                        meta: {
                            title: "Schedules",
                            requiresAuthentication: true
                        }
                    },
                    {
                        path: "schedules/:id",
                        component: ScheduleDetailRoot,
                        meta: {
                            title: "Schedule",
                            requiresAuthentication: true
                        },
                        children: [
                            {
                                path: "",
                                component: ScheduleDetail,
                                meta: {
                                    title: "Schedule",
                                    requiresAuthentication: true,
                                    toolbarRightActions: ScheduleDetailToolbarActions,
                                    showBackButton: true
                                }
                            },
                            {
                                path: "actions",
                                component: ScheduleActionList,
                                meta: {
                                    title: "Scheduled actions",
                                    requiresAuthentication: true,
                                    toolbarRightActions: ScheduleActionListToolbarActions,
                                    showBackButton: true
                                }
                            }
                        ]
                    }
                ]
            },
            {
                path: "/support",
                component: Support,
                meta: {
                    title: "Support",
                    requiresAuthentication: false
                }
            },
            {
                path: "/auth/login",
                component: LoginIndex,
                meta: {
                    title: "Log in",
                    requiresAuthentication: false
                }
            },
            {
                path: "/auth/login/local",
                component: LocalLogin,
                meta: {
                    title: "Local account",
                    requiresAuthentication: false
                }
            },
            {
                path: "/auth/logout",
                component: Logout,
                meta: {
                    title: "Log out",
                    requiresAuthentication: false
                }
            }
        ]
    });

    return router;
}
