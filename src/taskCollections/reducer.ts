import { ITask } from "../Task";
import { KeyBoardType } from "../store";

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

//
// State model.
//

export interface ITaskCollection {
    readonly name: string;
    readonly tasks: ITask[];
    readonly keyboard: {
        name: KeyBoardType,
        props?: any
    };
}

//
// Supported actions.
//

type TaskCollectionsActions = IAddTaskCollectionAction;

export interface IAddTaskCollectionAction {
    type: "ADD_TASK_COLLECTION";
    name: string;
    tasks: any[];
    keyboard: string;
}
