import { range } from "underscore";
import * as React from "react";
import store, { TaskState } from "./store"
import { ITaskCollection, ITask } from "./TaskHost";
import strings from "./strings";
import { formatString } from "./string";

const styles = require<any>("./DoubleTask.less");

interface IDoubleTaskProps {
    task: string;
    state: TaskState;
    value: number | null;
    answer: number;
}

class DoubleTask
    extends React.Component<IDoubleTaskProps, {}> {

    render() {
        return (
            <div
                className={styles.doubleTask}
                style={{ fontSize: "10vw" }}>

                {this.props.state === "wrong" ?
                <DoubleTaskHelp answer={this.props.answer} /> : null}

                {this.props.task}={this.props.value}
            </div>
        );
    }
}

const DoubleTaskHelp = ({ answer }: { answer: number; }) =>
    <div className={styles.doubleTaskHelp}>
        <Blocks answer={answer} />
        <div className={styles.plus}>+</div>
        <Blocks answer={answer} />
    </div>;

const Blocks = ({ answer }: { answer: number; }) =>
    <div>
        {range(0, Math.floor(answer / 2 / 10))
            .map(() => 10)
            .concat((answer / 2) % 10)
            .filter(b => b > 0)
            .map((b, i) =>
            <div key={i}>
                <img src={blockGroups[b]} />
            </div>)}
    </div>;

const blockSize =   10;
const blockMargin =  2;
const groupWidth = (blockSize + blockMargin) * 2 + blockMargin;
const groupHeight = (blockSize + blockMargin) * 5 + blockMargin;

const canvas = document.createElement("canvas");
canvas.width = groupWidth;
canvas.height = groupHeight;
const ctx = canvas.getContext("2d")!;
const blockGroups = range(0, 11).map(n => {
    ctx.beginPath();
    ctx.rect(0, 0, groupWidth, groupHeight);
    ctx.fillStyle = "silver";
    ctx.fill();
    ctx.closePath();
    range(0, n).forEach(n => {
        ctx.beginPath();
        ctx.rect(
            ((n % 2) + 1) * blockMargin + (n % 2) * blockSize,
            blockMargin + blockMargin * Math.floor(n / 2) + blockSize * Math.floor(n / 2),
            blockSize,
            blockSize);
        ctx.fillStyle = "gray";
        ctx.fill();
        ctx.closePath();
    });

    return canvas.toDataURL();
});

/**
 * Represents a double task.
 */
class Double implements ITask {

    readonly component = DoubleTask;
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
        } else if (numberOfChars >= `${answer}`.length) {
            return "wrong";
        }
        return "active";
    }

    getAnswer(): number {
        return this.getNumbers()[0] * 2;
    }

    getNumbers() {
        return [parseInt(/([1-9]?[0-9])$/.exec(this.task)![1], 10)];
    }
}

//
// Adding task collections.
//

store.dispatch({
    type: "add-task-collection",
    value: {
        name: strings.doubleTaskCollectionName,
        tasks: range(0, 51)
            .map(n => new Double(formatString(strings.double, n))),
        keyboard: { name: "two-level-numpad" }
    } as ITaskCollection
});
