import { defer } from "underscore";
import * as React from "react";

const styles = require<any>("./TaskHost.css");

export interface ITaskProps {
    onReset: () => void;
    onCorrect: () => void;
    onWrong: () => void;
}

export interface ITask<T extends ITaskProps> {
    readonly component: any;
    readonly props: T;
    numCorrect: number;
    numWrong: number;
}

export interface ITaskCollection<T extends ITaskProps> {
    readonly name: string;
    readonly tasks: ITask<T>[];
}

export const taskCollections: ITaskCollection<any>[] = []

export const tasks: ITask<any>[] = [];

var currentTask;

interface ITaskHostState {
    readonly task: ITask<ITaskProps>;
    readonly state: "active" | "correct" | "wrong";
}

export default class TaskHost extends React.Component<{}, ITaskHostState> {

    private nextButton: HTMLButtonElement;

    constructor(props, context) {
        super(props, context);
        this.state = {
            task: getTask(),
            state: "active"
        };
        currentTask = this.state.task;
    }

    render() {
        return this.state.task ? this.renderTask() : this.renderDone();
    }

    renderTask() {
        const { task, state } = this.state;
        currentTask = task;
        return (
            <div id={styles.taskHost} className={styles[state]}>
                <this.state.task.component
                    {...this.state.task.props}
                    onCorrect={this.onCorrect.bind(this)}
                    onWrong={this.onWrong.bind(this)}
                    onReset={this.onReset.bind(this)} />
                <button
                    ref={e => this.nextButton = e}
                    id={styles.nextButton}
                    onClick={this.onNextTaskClick.bind(this)}>
                    Neste oppgave
                </button>
                <div id={styles.stats}>
                    {`Rett: ${task.numCorrect} | Feil: ${task.numWrong}`}
                </div>
            </div>
        );
    }

    renderDone() {
        currentTask = null;
        return (
            <div id={styles.taskHost} className={styles.correct}>
                <span id={styles.doneMessage}>Du klarte alle!</span>
            </div>
        );
    }

    onNextTaskClick() {
        this.setState({ task: getTask(), state: "active" });
    }

    onCorrect() {
        this.state.task.numCorrect++;
        this.setState({ ...this.state, state: "correct" });
        defer(() => this.nextButton.focus());
    }

    onWrong() {
        currentTask.numWrong++;
        this.setState({ ...this.state, state: "wrong" });
    }

    onReset() {
        this.setState({ ...this.state, state: "active" });
    }
}

function getTask() {
    var task,
        correctLimit = 3;
    var tasksLeft = tasks.some(function (t) {
        return t.numCorrect < correctLimit;
    });
    if (!tasksLeft) {
        return null;
    }
    do {
        task = tasks[Math.round(Math.random() * tasks.length)];
    } while (!task || task.numCorrect >= correctLimit);
    return task;
}
