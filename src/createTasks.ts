import { ITaskProps, ITask, onReset, onCorrect, onWrong } from "../task";

export default function createTasks<T extends ITaskProps>(
    tasks: string[],
    component,
    taskProps: Readonly<ITaskProps> =
        { onReset, onCorrect, onWrong }) {
    return tasks.map(task => ({        
        props: { task: task, ...taskProps },
        numCorrect: 0,
        numWrong: 0,
        component: component
    } as ITask<T & { task: string }>));
}
