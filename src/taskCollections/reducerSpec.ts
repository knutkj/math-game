import * as deepFreeze from "deep-freeze";
import taskCollectionsReducer from "./reducer";
import { addTaskCollection } from "./actions";

describe("taskCollections", () => {

    describe("taskCollectionsReducer", () => {

        it("ignores unknown actions", () => {
            const stateBefore = deepFreeze([]);
            const action = deepFreeze({ type: "unknown" }) as any;
            const stateAfter = [];
            expect(taskCollectionsReducer(stateBefore, action))
                .toEqual(stateAfter);
        });

        it("handles the ADD_TASK_COLLECTION action", () => {
            const stateBefore = deepFreeze([]);
            const name = "task collection name";
            const tasks = [];
            const keyboard = "two-level-numpad";
            const action = deepFreeze(
                addTaskCollection(name, tasks, keyboard));
            const stateAfter = [
                { name, tasks, keyboard: { name: keyboard } }
            ];
            expect(taskCollectionsReducer(stateBefore, action))
                .toEqual(stateAfter);
        });

    });

});
