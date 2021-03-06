import * as React from "react";
import { getSelectedTasks } from "../store";
import store, { ITaskWrapper, KeyBoardType } from "../store";
import Numpad from "../Numpad";
import TwoLevelNumpad from "../TwoLevelNumpad";
import { ITask, TaskState } from "../Task";

const styles = require<any>("./TaskHost.less");

//
// Making all SVG files available.
//
const requireSvg = require.context("../../images", true, /set[0-9]\/(correct|wrong)\/[^/]+\.svg$/);
const correctEmoticons = requireSvg.keys().filter(k => /correct\/[^/]+$/.test(k));
const wrongEmoticons = requireSvg.keys().filter(k => /wrong\/[^/]+$/.test(k));

function pickEmoticon(emoticon: string[]): string {
    const index = Math.round(Math.random() * emoticon.length - .5);
    return emoticon[index];
}

interface ITaskHostState {
    readonly task: ITask | null;
    readonly state: TaskState;
    readonly value: number | null;
    readonly duration: number;
    readonly keyboard: KeyBoardType | null;
}

/**
 * Represents a task host which hosts tasks.
 */
export default class TaskHost extends React.Component<{}, ITaskHostState> {

    static contextTypes = { router: React.PropTypes.object.isRequired };

    private keyListener: (e: KeyboardEvent) => void;
    private unsubscribe: () => void;

    constructor(props, context) {
        super(props, context);
        let currentTask = store.getState().currentTask;
        if (!currentTask) {
            setTask();
            currentTask = store.getState().currentTask;
        }
        const currentKeyboard = store.getState().currentKeyboard;
        const keyboard = currentKeyboard ? currentKeyboard.name : null;
        if (currentTask) {
            this.state = {
                task: currentTask.task,
                state: currentTask.state,
                value: currentTask.suggestedAnswer,
                duration: getDuration(),
                keyboard

            };
        } else {
            this.state = {
                task: null,
                state: "active",
                value: null,
                duration: getDuration(),
                keyboard
            };
        }
        this.keyListener = this.onKeyDown.bind(this);
        addEventListener("keydown", this.keyListener);
    }

    componentWillMount() {
        this.unsubscribe = store.subscribe(() => {
            const currentTask = store.getState().currentTask;
            const currentKeyboard = store.getState().currentKeyboard;
            const keyboard = currentKeyboard ? currentKeyboard.name : null;
            if (currentTask) {
                this.setState({
                    state: currentTask.state,
                    task: currentTask.task,
                    value: currentTask.suggestedAnswer,
                    duration: getDuration(),
                    keyboard
                });
            }
        });
    }

    render() {
        return this.state.task ?
            this.renderTask(this.state.task) :
            this.renderDone();
    }

    renderTask(task: ITask) {
        return (
            <div
                id={styles.taskHost}
                className={styles[this.state.state]}
                onAnimationEnd={this.onAnimationEnd.bind(this)}>

                <Timer
                    duration={300 * 1000}
                    onOutOfTime={this.onOutOfTime.bind(this)} />

                <div id={styles.taskContainer}>
                    <task.component
                        task={task.task}
                        value={this.state.value}
                        answer={task.getAnswer()}
                        state={this.state.state} />
                </div>

                <img
                    id={styles.correctReaction}
                    src={requireSvg<string>(pickEmoticon(correctEmoticons))} />

                <img
                    id={styles.wrongReaction}
                    src={requireSvg<string>(pickEmoticon(wrongEmoticons))} />

                {this.state.keyboard ? (this.state.keyboard === "numpad" ?
                <Numpad /> :
                <TwoLevelNumpad />) : null}

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
        setTask();
        if (!store.getState().currentTask) {
            this.context.router.push("/summary");
        }
    }

    onKeyDown(e: KeyboardEvent) {
        if (!this.state.task) {
            return;
        }

        const stringValue = this.state.value === null ?
            "" : `${this.state.value}`;

        //
        // If a number character has been pressed.
        //
        if (/^[0-9]$/.test(e.key) && this.state.state === "active") {
            const value = parseInt(`${stringValue}${e.key}`, 10);
            store.dispatch({ type: "answer-suggested", value });

        //
        // If the backspace character has been pressed.
        //
        } else if (/^Backspace$/i.test(e.key)) {
            if (this.state.state === "correct" || stringValue.length === 0) {
                return;
            }
            const valueLength = stringValue.length;
            const value = valueLength === 1 ?
                null :
                parseInt(stringValue.substr(0, valueLength - 1), 10);

            store.dispatch({ type: "answer-suggested", value });
        }
    }

    onAnimationEnd() {
        if (this.state.state === "correct") {
            setTimeout(() => this.onNextTaskClick(), 600);
        }
    }

    onOutOfTime() {
        //store.dispatch({ type: "stop" });
        this.context.router.push("/summary");
    }

    componentWillUnmount() {
        this.unsubscribe();
        removeEventListener("keydown", this.keyListener);
    }
}

function setTask(): void {
    var task: ITaskWrapper,
        correctLimit = 3;
    const tasks = getSelectedTasks();
    var tasksLeft = tasks.map(w => w.task).some(function (t) {
        return t.numCorrect < correctLimit;
    });
    if (!tasksLeft) {
        store.dispatch({ type: "task-set", value: null });
        store.dispatch({ type: "set-keyboard", value: null });
    }
    do {
        task = tasks[Math.round(Math.random() * tasks.length)];
    } while (!task || task.task.numCorrect >= correctLimit);
    store.dispatch({ type: "task-set", value: task.task });
    store.dispatch({ type: "set-keyboard", value: task.collection.keyboard });
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
        <div className={styles.timer}>
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