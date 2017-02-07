export default function settingsReducer(
    state: ISettings = { deviceReady: false },
    action: SettingsAction) {

    switch (action.type) {
        case "DEVICE_READY":
            return { deviceReady: true };
    }

    return state;
}

//
// State model.
//

export interface ISettings {
    readonly deviceReady: boolean;
}

//
// Supported actions.
//

type SettingsAction = IDeviceReadyAction;

export interface IDeviceReadyAction {
    readonly type: "DEVICE_READY";
}
