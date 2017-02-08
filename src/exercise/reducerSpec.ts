import * as deepFreeze from "deep-freeze";
import exerciseReducer, { IExercise } from "./reducer";
import * as r from "./reducer";
import * as a from "./actions";
import * as nowModule from "../now";
import * as complainModule from "../complain";

describe("exercise", () => {

    complainModule.setMode("throw");

    describe("reducer", () => {

        const stateBefore: IExercise = deepFreeze({
            selectedTaskCollections: [],
            startedAt: null,
            numberOfCorrectTasks: null,
            numberOfWrongAnswers: null,
            currentTaskCollection: null,
            currentTask: null,
            currentSuggestedAnswer: null,
            stoppedAt: null
        });

        it("ignores unknown actions", () => {
            const action = deepFreeze({ type: "unknown" }) as any;
            const stateAfter = stateBefore;
            expect(exerciseReducer(stateBefore, action))
                .toBe(stateAfter);
        });

        it("handles the SELECT_TASK_COLLECTION action", () => {
            const expectedTaskCollection = "tc1";
            const action: r.ISelectTaskCollectionAction = deepFreeze(
                a.selectTaskCollection(expectedTaskCollection));

            const stateAfter: IExercise = deepFreeze({
                ...stateBefore,
                selectedTaskCollections: [expectedTaskCollection]
            });

            expect(exerciseReducer(stateBefore, action))
                .toEqual(stateAfter);
        });

        it("is not valid to select task collection more than once", () => {
            const spy = spyOn(complainModule, "complain");
            const selectedTaskCollection = "tc1";
            const action: r.ISelectTaskCollectionAction =
                deepFreeze(a.selectTaskCollection(selectedTaskCollection));

            const thisStateBefore: IExercise = deepFreeze({
                ...stateBefore,
                selectedTaskCollections: [selectedTaskCollection]
            });

            expect(exerciseReducer(thisStateBefore, action))
                .toBe(thisStateBefore);

            expect(spy).toHaveBeenCalledWith(
                "The task collection that is to be selected has already been selected.");
        });

        it("is not valid to unselect none selected task collection", () => {
            const spy = spyOn(complainModule, "complain");
            const action: r.IUnselectTaskCollectionAction =
                deepFreeze(a.unselectTaskCollection("ts1"));

            expect(exerciseReducer(stateBefore, action)).toBe(stateBefore);
            expect(spy).toHaveBeenCalledWith(
                "The task collection that is to be unselected is not in the list of selected task collections.");
        });

        it("handles the UNSELECT_TASK_COLLECTION action", () => {
            const taskCollectionToUnselect = "tc1";
            const action: r.IUnselectTaskCollectionAction =
                deepFreeze(a.unselectTaskCollection(taskCollectionToUnselect));

            const thisStateBefore: IExercise = deepFreeze({
                ...stateBefore,
                selectedTaskCollections: [taskCollectionToUnselect]
            });

            const stateAfter = stateBefore;
            expect(exerciseReducer(thisStateBefore, action))
                .toEqual(stateAfter);
        });

        //
        // START_EXERCISE.
        //

        it("is not valid to start exercise before at least one collection is selected", () => {
            const spy = spyOn(complainModule, "complain");
            const action: r.IStartExerciseAction =
                deepFreeze(a.startExercise());

            expect(exerciseReducer(stateBefore, action)).toBe(stateBefore);
            expect(spy).toHaveBeenCalledWith(
                "A task collection must be selected before an exercise can be started.");
        });

        it("handles the START_EXERCISE action", () => {
            const now = new Date();
            spyOn(nowModule, "default").and.returnValue(now);
            const action: r.IStartExerciseAction =
                deepFreeze(a.startExercise());

            const thisStateBefore: IExercise = deepFreeze({
                ...stateBefore,
                selectedTaskCollections: ["tc1"]
            });

            const stateAfter: IExercise =
                deepFreeze({ ...thisStateBefore, startedAt: now });

            expect(exerciseReducer(thisStateBefore, action))
                .toEqual(stateAfter);
        });

        it("is not valid to start a started exercise", () => {
            const spy = spyOn(complainModule, "complain");
            const thisStateBefore: IExercise = deepFreeze({
                ...stateBefore,
                selectedTaskCollections: ["tc1"],
                startedAt: new Date()
            });

            const action: r.IStartExerciseAction =
                deepFreeze(a.startExercise());

            expect(exerciseReducer(thisStateBefore, action))
                .toBe(thisStateBefore);

            expect(spy).toHaveBeenCalledWith(
                "An exercise that has already been started can not be started.");
        });

        //
        // SET_TASK.
        //

        it("is not valid to set a task if the exercise has not been started", () => {
            const spy = spyOn(complainModule, "complain");
            const action: r.ISetTaskAction =
                deepFreeze(a.setTask("tc1", "1+1"));

            expect(exerciseReducer(stateBefore, action)).toBe(stateBefore);
            expect(spy).toHaveBeenCalledWith(
                "The exercise must be started before a task can be set.");
        });

        it("is not valid to set the current task collection to a task collection that has not been selected", () => {
            const spy = spyOn(complainModule, "complain");
            const action: r.ISetTaskAction =
                deepFreeze(a.setTask("tc1", "1+1"));

            const thisStateBefore: IExercise = deepFreeze({
                ...stateBefore,
                startedAt: new Date()
            });

            expect(exerciseReducer(thisStateBefore, action))
                .toBe(thisStateBefore);

            expect(spy).toHaveBeenCalledWith(
                "The current task collection can not be set to a task collection that has not been selected.");
        });

        it("handles the SET_TASK action", () => {
            const now = new Date();
            const currentTaskCollection = "tc1";
            const currentTask = "1+1";
            spyOn(nowModule, "default").and.returnValue(now);
            const action: r.ISetTaskAction =
                deepFreeze(a.setTask(currentTaskCollection, currentTask));

            const thisStateBefore: IExercise = deepFreeze({
                ...stateBefore,
                selectedTaskCollections: [currentTaskCollection],
                startedAt: new Date()
            });

            const stateAfter: IExercise = deepFreeze({
                ...thisStateBefore,
                currentTaskCollection,
                currentTask
            });

            expect(exerciseReducer(thisStateBefore, action))
                .toEqual(stateAfter);
        });

        it("is not valid to set a task if the exercise has been stopped", () => {
            const spy = spyOn(complainModule, "complain");
            const selectedTaskCollections = ["tc1"];
            const action: r.ISetTaskAction =
                deepFreeze(a.setTask(selectedTaskCollections[0], "1+1"));

            const thisStateBefore: IExercise = deepFreeze({
                ...stateBefore,
                selectedTaskCollections,
                startedAt: new Date(),
                stoppedAt: new Date()
            });

            expect(exerciseReducer(thisStateBefore, action))
                .toBe(thisStateBefore);

            expect(spy).toHaveBeenCalledWith(
                "A task can not be set after the exercise has been stopped.");
        });

        //
        // SUGGEST_ANSWER.
        //

        it("is not valid to suggest an answer if no task has been set", () => {
            const spy = spyOn(complainModule, "complain");
            const action: r.ISuggestAnswerAction =
                deepFreeze(a.suggestAnswer(1));

            expect(exerciseReducer(stateBefore, action)).toBe(stateBefore);
            expect(spy).toHaveBeenCalledWith(
                "A task must be set before an answer can be suggested.");
        });

        it("handles the SUGGEST_ANSWER action", () => {
            const currentSuggestedAnswer = 1;
            const action: r.ISuggestAnswerAction =
                deepFreeze(a.suggestAnswer(currentSuggestedAnswer));

            const thisStateBefore: IExercise =
                deepFreeze({ ...stateBefore, currentTask: "1+1" });

            const stateAfter: IExercise =
                deepFreeze({ ...thisStateBefore, currentSuggestedAnswer });

            expect(exerciseReducer(thisStateBefore, action))
                .toEqual(stateAfter);
        });

        it("is not valid to suggest an answer after an exercise has been stopped", () => {
            const spy = spyOn(complainModule, "complain");
            const action: r.ISuggestAnswerAction =
                deepFreeze(a.suggestAnswer(1));

            const thisStateBefore: IExercise = deepFreeze({
                ...stateBefore,
                currentTask: "1+1",
                stoppedAt: new Date()
            });

            expect(exerciseReducer(thisStateBefore, action)).toBe(thisStateBefore);
            expect(spy).toHaveBeenCalledWith(
                "An answer can not be selected after an exercise has been stopped.");
        });

        //
        // STOP_EXERCISE.
        //

        it("is not valid to stop an exercise that has not been started", () => {
            const spy = spyOn(complainModule, "complain");
            const action: r.IStopExerciseAction = deepFreeze(a.stopExercise());
            expect(exerciseReducer(stateBefore, action)).toBe(stateBefore);
            expect(spy).toHaveBeenCalledWith(
                "An exercise that has not been started can not be stopped.");
        });

        it("handles the STOP_EXERCISE action", () => {
            const now = new Date();
            spyOn(nowModule, "default").and.returnValue(now);
            const action: r.IStopExerciseAction =
                deepFreeze(a.stopExercise());

            const thisStateBefore: IExercise = deepFreeze({
                ...stateBefore,
                selectedTaskCollections: ["tc1"],
                startedAt: new Date()
            });

            const stateAfter: IExercise =
                deepFreeze({ ...thisStateBefore, stoppedAt: now });

            expect(exerciseReducer(thisStateBefore, action))
                .toEqual(stateAfter);
        });

        it("is not valid to stop an exercise that has already been stopped", () => {
            const spy = spyOn(complainModule, "complain");
            const action: r.IStopExerciseAction = deepFreeze(a.stopExercise());

            const thisStateBefore: IExercise = deepFreeze({
                ...stateBefore,
                selectedTaskCollections: ["tc1"],
                startedAt: new Date(),
                stoppedAt: new Date()
            });

            expect(exerciseReducer(thisStateBefore, action))
                .toBe(thisStateBefore);

            expect(spy).toHaveBeenCalledWith(
                "An exercise that has already been stopped can not be stopped.");
        });

        //
        // STOP_EXERCISE.
        //

        it("handles the NEW_EXERCISE action", () => {
            const action: r.INewExerciseAction = deepFreeze(a.newExercise());
            expect(exerciseReducer(stateBefore, action)).toEqual(stateBefore);
            expect(exerciseReducer(stateBefore, action)).not.toBe(stateBefore);
        });

    });

});
