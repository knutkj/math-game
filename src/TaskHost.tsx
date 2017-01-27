import * as React from "react";
import { getSelectedTasks } from "./store";
import store from "./store";

const styles = require<any>("./TaskHost.less");

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

const correctEmoticons = ([] as string[]).concat(
[
    "angel.svg",
    "cap.svg",
    "clown.svg",
    "cool.svg",
    "eyeglass.svg",
    "geek.svg",
    "happy.svg",
    "humor.svg",
    "kiss.svg",
    "laughing.svg",
    "like.svg",
    "love.svg",
    "mustache.svg",
    "punk.svg",
    "robot.svg",
    "smile.svg",
    "star.svg",
    "sunglass.svg",
    "sunglass_2.svg",
    "sunglass_3.svg",
    "wink.svg"
].map(i => `images/set1/correct/${i}`),
[
    "alien.svg",
    "emoticon-1.svg",
    "emoticon-2.svg",
    "emoticon-3.svg",
    "emoticon-4.svg",
    "emoticon.svg",
    "happy-1.svg",
    "happy-2.svg",
    "happy-3.svg",
    "happy-4.svg",
    "happy-5.svg",
    "happy-6.svg",
    "happy.svg",
    "in-love-1.svg",
    "in-love.svg",
    "kiss.svg",
    "laughing.svg",
    "listening.svg",
    "people-1.svg",
    "people-2.svg",
    "people.svg",
    "signs.svg",
    "smile.svg",
    "wink.svg",
    "winking.svg"
].map(i => `images/set2/correct/${i}`),
[
    "1f31e.svg",
    "1f339.svg",
    "1f385.svg",
    "1f386.svg",
    "1f3f5.svg",
    "1f406.svg",
    "1f407.svg",
    "1f40c.svg",
    "1f41b.svg",
    "1f41d.svg",
    "1f41e.svg",
    "1f42c.svg",
    "1f431.svg",
    "1f435.svg",
    "1f439.svg",
    "1f44d.svg",
    "1f44f.svg",
    "1f467.svg",
    "1f47b.svg",
    "1f47d.svg",
    "1f48b.svg",
    "1f60d.svg",
    "1f638.svg",
    "1f923.svg",
    "1f981.svg",
    "2603.svg",
    "26c4.svg"
].map(i => `images/set3/correct/${i}`));

const wrongEmoticons = ([] as string[]).concat(
[
    "confused.svg",
    "crying.svg",
    "depression.svg",
    "dislike.svg",
    "sleepi.svg",
    "smarth.svg",
    "surprise.svg"
].map(i => `images/set1/wrong/${i}`),
[
    "confused.svg",
    "crying.svg",
    "emoticon-1.svg",
    "emoticon-10.svg",
    "emoticon-11.svg",
    "emoticon-12.svg",
    "emoticon-13.svg",
    "emoticon-14.svg",
    "emoticon-15.svg",
    "emoticon-16.svg",
    "emoticon-2.svg",
    "emoticon-3.svg",
    "emoticon-4.svg",
    "emoticon-5.svg",
    "emoticon-6.svg",
    "emoticon-7.svg",
    "emoticon-8.svg",
    "emoticon-9.svg",
    "emoticon.svg",
    "interface-1.svg",
    "interface-2.svg",
    "interface-3.svg",
    "interface-4.svg",
    "interface.svg",
    "people-1.svg",
    "people-2.svg",
    "people-3.svg",
    "people-4.svg",
    "people-5.svg",
    "people-6.svg",
    "people-7.svg",
    "people-8.svg",
    "people-9.svg",
    "people.svg",
    "sad-1.svg",
    "sad.svg",
    "scared-1.svg",
    "scared.svg",
    "sceptic.svg",
    "shocked.svg",
    "sick.svg",
    "silent.svg",
    "smiley.svg",
    "square-1.svg",
    "square-2.svg",
    "square.svg",
    "thinking.svg",
    "tired.svg"
].map(i => `images/set2/wrong/${i}`));

function pickEmoticon(emoticon) {
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
                    <img id={styles.correctReaction} src={pickEmoticon(correctEmoticons)} />
                    <img id={styles.wrongReaction} src={pickEmoticon(wrongEmoticons)} />
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