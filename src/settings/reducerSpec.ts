import * as deepFreeze from "deep-freeze";
import settingsReducer, { IDeviceReadyAction, ISettings } from "./reducer";

describe("settings", () => {

    describe("reducer", () => {

        const stateBefore: ISettings = deepFreeze({ deviceReady: false });

        it("ignores unknown actions", () => {
            const action = deepFreeze({ type: "unknown" }) as any;
            const stateAfter = stateBefore;
            expect(settingsReducer(stateBefore, action))
                .toEqual(stateAfter);
        });

        it("handles the DEVICE_READY action", () => {
            const action: IDeviceReadyAction = deepFreeze(
                { type: "DEVICE_READY" as "DEVICE_READY" });
            const stateAfter: ISettings = deepFreeze({ deviceReady: true });
            expect(settingsReducer(stateBefore, action))
                .toEqual(stateAfter);
        });

    });

});
