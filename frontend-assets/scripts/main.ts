import { initAuth } from "./auth";
import { initDashboard } from "./dashboard";
import { initFramework } from "./framework";

document.addEventListener("DOMContentLoaded", () => {
    initFramework();
    initAuth();
    initDashboard();
});
