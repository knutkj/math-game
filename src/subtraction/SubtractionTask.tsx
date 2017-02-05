import { range, flatten } from "underscore";
import * as React from "react";
import { ITask } from "../taskHost/TaskHost";
import store, { TaskState } from "../store";
import { addTaskCollection } from "../taskCollections/actions";

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
        const items: JSX.Element[] = [];
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

store.dispatch(addTaskCollection(
    "Minus 0-10",
    createSubtractionStrings(0, 10).map(t => new Subtraction(t))));

store.dispatch(addTaskCollection(
    "Minus 10-20",
    createSubtractionStrings(10, 20).map(t => new Subtraction(t)),
    "two-level-numpad"));

store.dispatch(addTaskCollection(
    "Minus 0-20",
    createSubtractionStrings(0, 20).map(t => new Subtraction(t)),
    "two-level-numpad"));

export function createSubtractionStrings(start: number, stop: number) {
    if (start === stop) {
        return [`${start}-${stop}`];
    }
    return flatten(range(start, stop + 1)
        .map(n => range(0, n + 1)
            .map(k => `${n}-${k}`)));
}
