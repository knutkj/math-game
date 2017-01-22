import { ITaskProps, ITask } from "../task";

export default function createTasks<T extends ITaskProps>(
    tasks: string[],
    component) {
    return tasks.map(task => ({
        props: { task: task },
        numCorrect: 0,
        numWrong: 0,
        component: component
    } as ITask<T & { task: string }>));
}
