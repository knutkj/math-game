import { IAddTaskCollectionAction } from "./reducer";

export function addTaskCollection(
    name: string,
    tasks: any[],
    keyboard: string = "numpad"): IAddTaskCollectionAction {
    return { type: "ADD_TASK_COLLECTION", name, tasks, keyboard };
}
