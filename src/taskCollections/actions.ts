export interface IAddTaskCollectionAction {
    type: "ADD_TASK_COLLECTION";
    name: string;
    tasks: any[];
    keyboard: string;
}

export function addTaskCollection(
    name: string,
    tasks: any[],
    keyboard: string = "numpad"): IAddTaskCollectionAction {
    return { type: "ADD_TASK_COLLECTION", name, tasks, keyboard };
}
