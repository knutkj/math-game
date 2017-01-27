import * as React from "react";
import { getSelectedTasks } from "./store";
import store from "./store";

const styles = require<any>("./TaskHost.less");

//
// Making all SVG files available.
//
const requireSvg = require.context("../images", true, /set[0-9]\/(correct|wrong)\/[^/]+\.svg$/);
const correctEmoticons = requireSvg.keys().filter(k => /correct\/[^/]+$/.test(k));
const wrongEmoticons = requireSvg.keys().filter(k => /wrong\/[^/]+$/.test(k));

export type TaskState = "active" | "correct" | "wrong";

export interface ITaskProps {
    readonly task: string;
    readonly state: TaskState;
    readonly value: number | null;
    readonly answer: number;
}

export interface ITask {
    readonly task: string;
    readonly component: React.ComponentClass<ITaskProps>;
    numCorrect: number;
    numWrong: number;
    getState(value: number): TaskState;
    getAnswer(): number;
    getNumbers(): number[];
}

export interface ITaskCollection {
    readonly name: string;
    readonly tasks: ITask[];
}

function pickEmoticon(emoticon: string[]): string {
    const index = Math.round(Math.random() * emoticon.length - .5);
    return emoticon[index];
}

interface ITaskHostState {
    readonly task: ITask | null;
    readonly state: TaskState;
    readonly value: string;
    readonly duration: number;
}

/**
 * Represents a task host which hosts tasks.
 */
export default class TaskHost extends React.Component<{}, ITaskHostState> {

    static contextTypes = { router: React.PropTypes.object.isRequired };

    private nextButton: HTMLButtonElement;
    private keyListener: (e: KeyboardEvent) => void;

    constructor(props, context) {
        super(props, context);
        this.state = {
            task: getTask(),
            state: "active",
            value: "",
            duration: getDuration()
        };
        this.keyListener = this.onKeyDown.bind(this);
        addEventListener("keydown", this.keyListener);
    }

    render() {
        return this.state.task ?
            this.renderTask(this.state.task) :
            this.renderDone();
    }

    renderTask(task: ITask) {
        return (
            <div>
                <Timer
                    duration={300 * 1000}
                    onOutOfTime={this.onOutOfTime.bind(this)} />
                <div
                    id={styles.taskHost}
                    className={styles[this.state.state]}
                    onAnimationEnd={this.onAnimationEnd.bind(this)}>

                    <task.component
                        task={task.task}
                        value={this.state.value ? parseInt(this.state.value, 10) : null}
                        answer={task.getAnswer()}
                        state={this.state.state} />
                    {this.state.state === "correct" ?
                    <button
                        ref={e => this.nextButton = e}
                        id={styles.nextButton}
                        onClick={this.onNextTaskClick.bind(this)}>
                        Neste oppgave
                    </button> : null}

                    <img
                        id={styles.correctReaction}
                        src={requireSvg<string>(pickEmoticon(correctEmoticons))} />

                    <img
                        id={styles.wrongReaction}
                        src={requireSvg<string>(pickEmoticon(wrongEmoticons))} />

                    <div id={styles.stats}>
                        {`Rett: ${task.numCorrect} | Feil: ${task.numWrong}`}
                    </div>
                </div>
            </div>
        );
    }

    renderDone() {
        return (
            <div id={styles.taskHost} className={styles.correct}>
                <span id={styles.doneMessage}>Du klarte alle!</span>
            </div>
        );
    }

    onNextTaskClick() {
        const nextTask = getTask();
        if (!nextTask) {
            this.context.router.push("/summary");
        } else {
            this.setState({
                ...this.state,
                task: nextTask,
                state: "active",
                value: ""
            });
        }
    }

    onCorrect() {
        if (!this.state.task) {
            throw new Error("onCorrect: No task state.");
        }
        store.dispatch({ type: "increment-correct" });
        this.state.task.numCorrect++;
        //defer(() => this.nextButton.focus());
    }

    onWrong() {
        if (!this.state.task) {
            throw new Error("onWrong: No task state.");
        }
        this.state.task.numWrong++;
    }

    onKeyDown(e: KeyboardEvent) {
        if (!this.state.task) {
            return;
        }
        let value: string = this.state.value;
        if (/^[0-9]$/.test(e.key)) {
            if (this.state.state === "active") {
                value = `${this.state.value}${e.key}`;
            } else {
                return;
            }

        } else if (/^Backspace$/i.test(e.key)) {
            if (this.state.state === "correct") {
                return;
            }
            value = this.state.value.substr(0, this.state.value.length - 1);

        } else if (/^ |Enter$/i.test(e.key)) {
            if (this.state.state === "correct") {
                this.onNextTaskClick();
            }
            return;

        } else {
            return;
        }
        const state = this.state.task.getState(parseInt(value, 0));
        switch (state) {
            case "correct":
                this.onCorrect();
                break;
            case "wrong":
                this.onWrong();
                break;
        }
        this.setState({ ...this.state, value, state });
    }

    onAnimationEnd() {
        if (this.state.state === "correct") {
            setTimeout(() => this.onNextTaskClick(), 600);
        }
    }

    onOutOfTime() {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        store.dispatch({ type: "stop" });
        this.context.router.push("/summary");
    }

    componentWillUnmount() {
        removeEventListener("keydown", this.keyListener);
    }
}

function getTask(): ITask | null {
    var task: ITask,
        correctLimit = 3;
    const tasks = getSelectedTasks();
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

//
// Timer component.
//

interface ITimerProps {
    duration: number;
    onOutOfTime: () => void;
}

class Timer extends React.Component<ITimerProps, { duration: number; }> {

    private interval: number;

    constructor() {
        super();
        this.state = { duration: getDuration() }
    }

    componentWillMount() {
        this.interval = window.setInterval(() => {
            const duration = getDuration();
            const timeLeft = this.getTimeLeft(duration);

            this.setState({
                ...this.state,
                duration: duration
            });

            if (timeLeft === 0) {
                clearInterval(this.interval);
                this.props.onOutOfTime();
            }

        }, 1000);
    }

    getTimeLeft(duration: number) {
        return Math.max(Math.round((this.props.duration - duration) / 1000), 0);
    }

    render() { return (
        <div className={styles.clock}>
            {this.getTimeLeft(this.state.duration)}
        </div>);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

}

function getDuration(): number {
    return Date.now() - store.getState().startedAt!.valueOf();
}