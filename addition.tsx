import * as React from "react";
import { ITaskProps, /*ITask,*/ taskCollections } from "./task";
import { range } from "underscore";
import createTasks from "./src/createTasks";

interface IAdditionTaskProps extends ITaskProps {
    task: string;
}

//interface IAdditionTask extends ITask<IAdditionTaskProps> {}

class AdditionTask
    extends React.Component<IAdditionTaskProps, { value: string }> {

    element: HTMLInputElement;
    left: number;
    right: number;
    answer: number;
    done: boolean;

    constructor(props: IAdditionTaskProps) {
        super(props);
        this.state = { value: "" };
        this.setMembersFromProps(props);
    }

    componentWillReceiveProps(newProps) {
        this.setState({ value: "" });
        this.setMembersFromProps(newProps);
    }

    render() {
        return (
            <form>
                <div id="task">{this.props.task}=</div>
                <input
                    ref={e => this.element = e}
                    id="answer"
                    onChange={this.onChange.bind(this)}
                    value={this.state.value}
                    type="number"
                    maxLength={2} />
            </form>
        );
    }

    componentDidMount() {
        this.element.focus();
    }

    componentDidUpdate() {
        !this.done && this.element.focus();
    }

    onChange() {
        const value = this.element.value;

        this.setState({ value: value.substr(0, 2) });

        const numberOfChars = value.length;
        const parsedValue = parseInt(this.element.value, 10);

        if (numberOfChars === 0) {
            this.props.onReset();
        } else if (parsedValue === this.answer) {
            this.done = true;
            this.props.onCorrect();
        } else if (numberOfChars === ("" + this.answer).length) {
            this.props.onWrong();
        }
    }

    setMembersFromProps(props: IAdditionTaskProps) {
        this.done = false;
        const task = props.task;
        this.left = parseInt(task.split("+")[0], 0);
        this.right = parseInt(task.split("+")[1], 0);
        this.answer = this.left + this.right;
    }
}

//
// Creating task collections.
//

const zeroToTenTasks: string[] = [];
const tenToTwentyTasks: string[] = [];

for (let i = 0; i < 10; i++) {
    zeroToTenTasks.push.apply(
        zeroToTenTasks,
        range(0, 10 - i).map(n => `${i}+${n}`));
    zeroToTenTasks.push.apply(
        zeroToTenTasks,
        range(0, 10 - i).map(n => `${n}+${i}`));
}

for (let i = 0; i < 10; i++) {
    tenToTwentyTasks.push.apply(
        tenToTwentyTasks,
        range(10, 20 - i).map(n => `${i}+${n}`));
    tenToTwentyTasks.push.apply(
        tenToTwentyTasks,
        range(10, 20 - i).map(n => `${n}+${i}`));
}

//
// Adding task collections.
//

taskCollections.push({
    name: "Den lille addisjonstabellen",
    tasks: createTasks(zeroToTenTasks, AdditionTask)
});

taskCollections.push({
    name: "Addisjon 10-20",
    tasks: createTasks(tenToTwentyTasks, AdditionTask)
});

taskCollections.push({
    name: "Addisjon 0-20",
    tasks: createTasks(zeroToTenTasks, AdditionTask)
        .concat(createTasks(tenToTwentyTasks, AdditionTask))
});
