import { $ } from "./dom";
import { ApiClient } from "./api";
import { Device, DeviceType } from "@langnes/smart-home-system-shared/domain";

export async function initDashboard() {
    const api = new ApiClient();

    const ui = {
        tableBody: $<HTMLTableSectionElement>("#dashboard-devices tbody").first()!,
        commandButtons: $<HTMLElement>("#dashboard-devices button"),
        rowTemplate: $<HTMLTemplateElement>("#dashboard-device-row-template").first()!,
        plugCommandsTemplate: $<HTMLTemplateElement>("#dashboard-device-row-template-commands-plug").first()!
    };

    async function fetchDevices() {
        let devices: Device[] = [];
        try {
            devices = await api.getDeviceList();
            document.dispatchEvent(new CustomEvent<Device[]>("FetchedDevices", {
                detail: devices
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(fetchDevices, 5000);
        }
    }

    function createPowerButton(device: Device) {
        const button = document.createElement("button");
        button.classList.add("button");
        button.textContent = device.state.relayState ? "Turn off" : "Turn on";
        button.addEventListener("click", async () => {
            button.disabled = true;
            const updatedDevice = await api.executeCommand({
                id: device.id,
                command: device.state.relayState ? "off" : "on"
            });
            document.dispatchEvent(new CustomEvent<Device>("DeviceUpdated", {
                detail: updatedDevice
            }));
        });
        return button;
    }

    function populateDeviceRow(device: Device) {
        let row = $<HTMLElement>(`[data-id='${device.id}']`, ui.tableBody).first();
        if (!row) {
            row = ui.rowTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
            ui.tableBody.appendChild(row);
        }

        row.dataset.id = device.id;
        $<HTMLElement>("[data-id]", row).first()!.textContent = device.id;
        $<HTMLElement>("[data-name]", row).first()!.textContent = device.name;
        $<HTMLElement>("[data-type]", row).first()!.textContent = device.type;
        $<HTMLElement>("[data-address]", row).first()!.textContent = device.address;
        const buttons = ui.plugCommandsTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
        const commandsCell = $<HTMLElement>("[data-commands]", row).first()!;
        [...commandsCell.children].forEach(child => child.parentElement?.removeChild(child));
        commandsCell.appendChild(buttons);

        switch (device.type) {
            case DeviceType.PLUG:
                buttons.appendChild(createPowerButton(device));
                break;
        }
    }

    document.addEventListener("DeviceUpdated", e => {
        const device = (e as CustomEvent<Device>).detail;
        populateDeviceRow(device);
    });

    document.addEventListener("FetchedDevices", e => {
        const devices = (e as CustomEvent<Device[]>).detail;
        devices.sort((a, b) => a.name.localeCompare(b.name));
        // Remove rows for removed devices
        const deviceIds = new Set(devices.map(device => device.id));
        for (const row of ui.tableBody.rows) {
            if (!deviceIds.has(row.dataset.id!)) {
                row.parentElement!.removeChild(row);
            }
        }
        // Update table
        devices.forEach(device => populateDeviceRow(device));
    });

    await fetchDevices();
};
