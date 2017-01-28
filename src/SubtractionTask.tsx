import { range } from "underscore";
import * as React from "react";
import { ITask } from "./TaskHost";
import store, { TaskState } from "./store";

const styles = require<any>("./SubtractionTask.css");

interface ISubtractionTaskProps {
    task: string;
    state: TaskState;
    value: number | null;
    answer: number;
}

class SubtractionTask
    extends React.Component<ISubtractionTaskProps, {}> {

    render() {
        return (
            <form className={styles.subtractionTask}>
                <div className={styles.text} style={{ fontSize: "20vw" }}>
                    {this.props.task}={this.props.value}
                </div>
                {this.props.state === "wrong" ?
                <div className={styles.help}>
                    {this.renderHelp()}
                </div> :
                null}
            </form>
        );
    }

    renderHelp() {
        const [left] = this.props.task.split("-").map(parseInt);
        const items: React.ReactElement<{}>[] = [];
        let currentAnswer = this.props.value || -1;
        for (var i = 0; i < left; i++) {
            const classNames = [
                styles.helpItem,
                i < currentAnswer ?
                    styles.answer :
                    "",
                i < this.props.answer ?
                    styles.left :
                    styles.right
            ].join(" ");
            items.push(
                <span key={i} className={classNames}>
                    {i + 1}
                </span>
            );
        }
        return items;
    }
}

/**
 * Represents a subtraction task.
 */
class Subtraction implements ITask {

    readonly component = SubtractionTask;
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
        return left - right;
    }

    getNumbers() {
        return this.task.split("-").map(t => parseInt(t, 10));
    }
}

store.dispatch({
    type: "add-task-collection",
    value: {
        name: "Minus 0-10",
        tasks: createSubtractionStrings(0, 10).map(t => new Subtraction(t))
    }
});

store.dispatch({
    type: "add-task-collection",
    value: {
        name: "Minus 10-20",
        tasks: createSubtractionStrings(10, 20).map(t => new Subtraction(t))
    }
});

store.dispatch({
    type: "add-task-collection",
    value: {
        name: "Minus 0-20",
        tasks: createSubtractionStrings(0, 20).map(t => new Subtraction(t))
    }
});

export function createSubtractionStrings(start: number, stop: number) {
    const strings: string[] = [];
    for (let i = start; i <= stop; i++) {
        strings.push.apply(
            strings,
            range(0, stop)
                .filter(n => n <= i)
                .map(n => `${i}-${n}`));
    }
    return strings;
}
