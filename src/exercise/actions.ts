import * as r from "./reducer";

export function selectTaskCollection(
    taskCollection: string): r.ISelectTaskCollectionAction {
    return { type: "SELECT_TASK_COLLECTION", taskCollection };
}

export function unselectTaskCollection(
    taskCollection: string): r.IUnselectTaskCollectionAction {
    return { type: "UNSELECT_TASK_COLLECTION", taskCollection };
}

export function startExercise(): r.IStartExerciseAction {
    return { type: "START_EXERCISE" };
}

export function setTask(
    taskCollection: string,
    task: string): r.ISetTaskAction {
    return {
        type: "SET_TASK",
        taskCollection,
        task
    };
}

export function suggestAnswer(answer: number): r.ISuggestAnswerAction {
    return { type: "SUGGEST_ANSWER", answer };
}

export function stopExercise(): r.IStopExerciseAction {
    return { type: "STOP_EXERCISE" };
}

export function newExercise(): r.INewExerciseAction {
    return { type: "NEW_EXERCISE" };
}
