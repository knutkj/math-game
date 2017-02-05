import { IAddTaskCollectionAction } from "./actions";
import { ITaskCollection } from "../task/TaskHost";
import { KeyBoardType } from "../store";

type TaskCollectionsActions = IAddTaskCollectionAction;

export default function taskCollectionsReducer (
    state: ReadonlyArray<ITaskCollection> = [],
    action: TaskCollectionsActions): ReadonlyArray<ITaskCollection> {

    switch (action.type) {
        case "ADD_TASK_COLLECTION":
            const { type, keyboard, ...collection } = action;
            return [
                ...state,
                {
                    ...collection,
                    keyboard: { name: keyboard as KeyBoardType }
                }
            ];
    }

    return state;
}
