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
