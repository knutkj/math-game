import { indexBy, flatten } from "underscore";
import { createStore } from "redux";
import { ITaskCollection, ITask } from "./TaskHost";

export type TaskState = "active" | "correct" | "wrong";

interface IState {
    readonly deviceReady: boolean;
    readonly taskCollections: ReadonlyArray<ITaskCollection>;
    readonly selectedTaskCollections: ReadonlyArray<string>;
    readonly startedAt: Date | null;
    readonly numberOfCorrectTasks: number;
    readonly numberOfWrongAnswers: number;

    readonly currentTask: {
        readonly state: "active" | "correct" | "wrong";
        readonly startedAt: Date;
        readonly task: ITask | null;
        readonly suggestedAnswer: number | null;
    } | null;

}

export interface IAction {
    readonly type:
        "device-ready" |
        "add-task-collection" |
        "task-collection-selected" |
        "task-collection-unselected" |
        "start" |
        "task-set" |
        "stop" |
        "answer-suggested" |
        "restart";
    readonly value: any;
}

const defaultState: IState = {
    deviceReady: false,
    taskCollections: [],
    selectedTaskCollections: [],
    startedAt: null,
    numberOfCorrectTasks: 0,
    numberOfWrongAnswers: 0,
    currentTask: null
};

function reducer(state: IState = defaultState, action: IAction) {
    switch (action.type) {

        case "device-ready": {
            return { ...state, deviceReady: true };
        }

        case "add-task-collection":
            return {
                ...state,
                taskCollections: state.taskCollections.concat(action.value),
                selectedTaskCollections: state.selectedTaskCollections
            };

        case "task-collection-selected":
            return {
                ...state,
                selectedTaskCollections:
                    state.selectedTaskCollections.concat(action.value)
            };

        case "task-collection-unselected":
            return {
                ...state,
                selectedTaskCollections:
                    state.selectedTaskCollections
                        .filter(c => c !== action.value)
            };

        case "start":
            return {
                ...state,
                startedAt: new Date()
            };

        case "task-set":
            return action.value ?
                {
                    ...state,
                    currentTask: {
                        state: "active",
                        startedAt: new Date(),
                        task: action.value,
                        suggestedAnswer: null
                    }
                } as IState :

                { ...state, currentTask: null } as IState;

        case "stop":
            return {
                ...state,
                startedAt: null
            };

        case "answer-suggested": {
            if (!state.currentTask) {
                throw new Error("No current task while answer suggested.");
            }

            if (!state.currentTask.task) {
                throw new Error("No task while answer suggested.");
            }

            const taskState = state.currentTask.task.getState(action.value);

            return {
                ...state,
                numberOfCorrectTasks: taskState === "correct" ?
                    state.numberOfCorrectTasks + 1 : state.numberOfCorrectTasks,
                numberOfWrongAnswers: taskState === "wrong" ?
                    state.numberOfWrongAnswers - 1 : state.numberOfWrongAnswers,
                currentTask: {
                    ...state.currentTask,
                    state: taskState,
                    suggestedAnswer: action.value
                }
            } as IState;
        }

        case "restart":
            return {
                ...state,
                startedAt: null,
                selectedTaskCollections: [],
                numberOfCorrectTasks: 0,
                currentTask: null
            };

    }

    return state;
}

const store = createStore<IState>(reducer);
export default store;

export function getSelectedTasks(): ReadonlyArray<ITask> {
    const index = indexBy(store.getState().taskCollections, c => c.name);
    const selected = store.getState().selectedTaskCollections;
    return flatten(selected.map(c => index[c]).map(c => c.tasks));
}

export function getNumberOfSelectedTaskCollections() {
    return store.getState().selectedTaskCollections.length;
}

export function isDeviceReady() {
    return store.getState().deviceReady;
}
