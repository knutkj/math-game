import { IDeviceReadyAction } from "./reducer";

export function deviceReady(): IDeviceReadyAction {
    return { type: "DEVICE_READY" };
}
