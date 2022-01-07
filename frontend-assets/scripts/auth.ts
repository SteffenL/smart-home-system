import { $ } from "./dom";

export function initAuth() {
    const ui = {
        logoutConfirmButton: $<HTMLButtonElement>("#logout-confirm-button").first()!,
        logoutForm: $<HTMLFormElement>("#logout-form").first()!
    };

    ui.logoutConfirmButton.addEventListener("click", () => {
        ui.logoutForm.submit();
    });
};
