import { indexBy, flatten } from "underscore";
import { createStore } from "redux";
import { ITaskCollection, ITask } from "./TaskHost";

interface IState {
    readonly taskCollections: ReadonlyArray<ITaskCollection>;
    readonly selectedTaskCollections: ReadonlyArray<string>;
    startedAt: Date | null;
    numberOfCorrectTasks: number;
}

export interface IAction {
    type:
        "add-task-collection" |
        "task-collection-selected" |
        "task-collection-unselected" |
        "unselect-all-task-collections" |
        "start" |
        "stop" |
        "increment-correct";
    value: any;
}

const defaultState: IState = {
    taskCollections: [],
    selectedTaskCollections: [],
    startedAt: null,
    numberOfCorrectTasks: 0
};

function reducer(state: IState = defaultState, action: IAction) {
    switch (action.type) {

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

        case "unselect-all-task-collections":
            return {
                ...state,
                selectedTaskCollections: [],
                numberOfCorrectTasks: 0
            };

        case "start":
            return {
                ...state,
                startedAt: new Date()
            };

        case "stop":
            return {
                ...state,
                startedAt: null
            };

        case "increment-correct":
            return {
                ...state,
                numberOfCorrectTasks: state.numberOfCorrectTasks + 1
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
