import * as React from "react";
import { ITask, ITaskCollection } from "./TaskHost";
import { flatten, range } from "underscore";
import store, { TaskState } from "./store";

const styles = require<any>("./AdditionTask.less");

interface IAdditionTaskProps {
    task: string;
    state: TaskState;
    value: number | null;
    answer: number;
}

class AdditionTask
    extends React.Component<IAdditionTaskProps, {}> {

    render() {
        return (
            <div className={styles.text} style={{ fontSize: "20vw" }}>
                {this.props.task}={this.props.value}
            </div>
        );
    }
}

/**
 * Represents a addition task.
 */
class Addition implements ITask {

    readonly component = AdditionTask;
    numCorrect = 0;
    numWrong = 0;

    constructor(
        public readonly task: string) {
    }

    getState(value: number): TaskState {
        const numberOfChars = `${value}`.length;
        const answer = this.getAnswer();
        if (numberOfChars === 0) {
            return "active";
        } else if (value === answer) {
            return "correct";
        } else if (numberOfChars === ("" + answer).length) {
            return "wrong";
        }
        return "active";
    }

    getAnswer(): number {
        const [left, right] = this.getNumbers();
        return left + right;
    }

    getNumbers() {
        return this.task.split("+").map(t => parseInt(t, 10));
    }
}

//
// Adding task collections.
//

store.dispatch({
    type: "add-task-collection",
    value: {
        name: "Den lille addisjonstabellen",
        tasks: createAdditionTasks(0, 10).map(t => new Addition(t)),
        keyboard: { name: "numpad" } 
    } as ITaskCollection
});

store.dispatch({
    type: "add-task-collection",
    value: {
        name: "Pluss 10-20",
        tasks: createAdditionTasks(10, 20).map(t => new Addition(t)),
        keyboard: { name: "two-level-numpad" } 
    } as ITaskCollection
});

store.dispatch({
    type: "add-task-collection",
    value: {
        name: "Pluss 0-20",
        tasks: createAdditionTasks(0, 20).map(t => new Addition(t)),
        keyboard: { name: "two-level-numpad" } 
    } as ITaskCollection
});

store.dispatch({
    type: "add-task-collection",
    value: {
        name: "Pluss 0-30",
        tasks: createAdditionTasks(0, 30).map(t => new Addition(t)),
        keyboard: { name: "two-level-numpad" } 
    } as ITaskCollection
});

export function createAdditionTasks(start: number, stop: number): string[] {
    if (start === stop) {
        return [`${start}+${stop}`];
    }
    return flatten(range(start, stop + 1)
        .map(n => range(0, stop + 1 - n)
            .map(k => `${n}+${k}`)));
}
