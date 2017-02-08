import now from "../now";
import { complain } from "../complain";
const defaultState: IExercise = {
    selectedTaskCollections: [],
    startedAt: null,
    numberOfCorrectTasks: null,
    numberOfWrongAnswers: null,
    currentTaskCollection: null,
    currentTask: null,
    currentSuggestedAnswer: null,
    stoppedAt: null
};

export default function exerciseReducer(
    state = defaultState,
    action: ExerciseAction) {

    switch (action.type) {

        case "SELECT_TASK_COLLECTION":
            if (state.selectedTaskCollections.indexOf(
                action.taskCollection) !== -1) {
                complain("The task collection that is to be selected has already been selected.");
                break;
            }

            return {
                ...state,
                selectedTaskCollections: [
                    ...state.selectedTaskCollections,
                    action.taskCollection
                ]
            };

        case "UNSELECT_TASK_COLLECTION":
            if (state.selectedTaskCollections.indexOf(action.taskCollection) === -1) {
                complain("The task collection that is to be unselected is not in the list of selected task collections.");
                break;
            }

            return {
                ...state,
                selectedTaskCollections:
                    state.selectedTaskCollections
                        .filter(c => c !== action.taskCollection)
            };

        case "START_EXERCISE":
            if (state.selectedTaskCollections.length === 0) {
                complain("A task collection must be selected before an exercise can be started.");
                break;
            }

            if (state.startedAt !== null) {
                complain("An exercise that has already been started can not be started.");
                break;
            }

            return { ...state, startedAt: now() };

        case "SET_TASK":
            if (state.startedAt === null) {
                complain("The exercise must be started before a task can be set.");
                break;
            }

            if (state.selectedTaskCollections.indexOf(
                action.taskCollection) === -1) {
                complain("The current task collection can not be set to a task collection that has not been selected.");
                break;
            }

            if (state.stoppedAt !== null) {
                complain("A task can not be set after the exercise has been stopped.");
                break;
            }

            return {
                ...state,
                currentTaskCollection: action.taskCollection,
                currentTask: action.task
            };

        case "SUGGEST_ANSWER":
            if (state.currentTask === null) {
                complain("A task must be set before an answer can be suggested.");
                break;
            }

            if (state.stoppedAt !== null) {
                complain("An answer can not be selected after an exercise has been stopped.");
                break;
            }

            return { ...state, currentSuggestedAnswer: action.answer };

        case "STOP_EXERCISE":
            if (state.startedAt === null) {
                complain("An exercise that has not been started can not be stopped.");
                break;
            }

            if (state.stoppedAt !== null) {
                complain("An exercise that has already been stopped can not be stopped.");
                break;
            }

            return { ...state, stoppedAt: now() };

        case "NEW_EXERCISE":
            return { ...defaultState };

    }

    return state;
}

//
// State model.
//

export interface IExercise {
    readonly selectedTaskCollections: ReadonlyArray<string>;
    readonly startedAt: null | Date;
    readonly numberOfCorrectTasks: null | number;
    readonly numberOfWrongAnswers: null | number;
    readonly currentTaskCollection: null | string;
    readonly currentTask: null | string;
    readonly currentSuggestedAnswer: null | number;
    readonly stoppedAt: null | Date;
}

//
// Supported actions.
//

type ExerciseAction =
    ISelectTaskCollectionAction |
    IUnselectTaskCollectionAction |
    IStartExerciseAction |
    ISetTaskAction |
    ISuggestAnswerAction |
    IStopExerciseAction |
    INewExerciseAction;

export interface ISelectTaskCollectionAction {
    readonly type: "SELECT_TASK_COLLECTION";
    readonly taskCollection: string;
}

export interface IUnselectTaskCollectionAction {
    readonly type: "UNSELECT_TASK_COLLECTION";
    readonly taskCollection: string;
}

export interface IStartExerciseAction {
    readonly type: "START_EXERCISE";
}

export interface ISetTaskAction {
    readonly type: "SET_TASK";
    readonly taskCollection: string;
    readonly task: string;
}

export interface ISuggestAnswerAction {
    readonly type: "SUGGEST_ANSWER";
    readonly answer: number;
}

export interface IStopExerciseAction {
    readonly type: "STOP_EXERCISE";
}

export interface INewExerciseAction {
    readonly type: "NEW_EXERCISE";
}
