import * as React from "react";
import { taskCollections, ITaskCollection, tasks, setTask } from "../task";

export default class TaskCollectionPicker
    extends React.Component<{}, {}> {

    render() {
        return (
            <div>
                {taskCollections.map((t, i) =>
                <button key={i} type="button" onClick={this.onPicked.bind(this, t)}>
                    {t.name}
                </button>)}
            </div>);
    }

    onPicked(taskCollection: ITaskCollection<any>) {
        tasks.push.apply(tasks, taskCollection.tasks);
        setTask();
    }

}
