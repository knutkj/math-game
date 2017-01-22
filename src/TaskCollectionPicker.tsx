import * as React from "react";
import { taskCollections, ITaskCollection, tasks } from "../task";

export default class TaskCollectionPicker
    extends React.Component<{}, {}> {

    static contextTypes = { router: React.PropTypes.object.isRequired };

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
        this.context.router.push("/tasks");
    }

}
