import { initAuth } from "./auth";
import { initFramework } from "./framework";

document.addEventListener("DOMContentLoaded", () => {
    initFramework();
    initAuth();
});
