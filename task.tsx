import * as React from "react";
import * as ReactDOM from "react-dom";

export interface ITaskProps {
    onReset: () => void;
    onCorrect: () => void;
    onWrong: () => void;
}

export interface ITask<T extends ITaskProps> {
    component: any;
    props: T;
    numCorrect: number;
    numWrong: number;
}

export interface ITaskCollection<T extends ITaskProps> {
    name: string;
    tasks: ITask<T>[];
}

export const taskCollections: ITaskCollection<any>[] = []

export const tasks: ITask<any>[] = [];

var taskElement = document.querySelector("#task") as HTMLElement;
var answerInput = document.querySelector("#answer") as HTMLElement;
var nextButton = document.querySelector("#next-button") as HTMLElement;
var statsElement = document.querySelector("#stats") as HTMLElement;

var currentTask;

export function setTask () {
    resetApp();
    var task = currentTask = getTask();
    if (task) {
        ReactDOM.render(
            <task.component {...task.props} />,
            taskElement);
        updateStats();
    } else {
        document.querySelector("body").className = "correct";
        (document.querySelector("#done-message") as HTMLElement).style.display = "inline";
        taskElement.style.display = "none";
        statsElement.style.display = "none";
        answerInput.style.display = "none";
        nextButton.style.display = "none";
    }
}

window["setTask"] = setTask;

function resetApp() {
    document.querySelector("body").className = "";
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

function updateStats() {
    statsElement.innerHTML =
        "Rett: " + currentTask.numCorrect +" | " +
        "Feil: " + currentTask.numWrong;
}

export function onReset() {
    document.querySelector("body").className = "";
}

export function onCorrect() {
    currentTask.numCorrect++;
    document.querySelector("body").className = "correct";
    nextButton.focus();
    updateStats();
}

export function onWrong() {
    currentTask.numWrong++;
    document.querySelector("body").className = "wrong";
    updateStats();
}

import TaskCollectionPicker from "./src/TaskCollectionPicker";

export function pickTasks (onPicked) {
    ReactDOM.render(
        <TaskCollectionPicker onPicked={onPicked} />,
        taskElement);
}
