/// <reference types="jasmine" />

import { createAdditionTasks } from "./AdditionTask";

describe("AdditionTask", () => {

    describe("createAdditionTasks", () => {

        it("works for 0/0", () => {
            const tasks = createAdditionTasks(0, 0);
            expect(tasks).toEqual(["0+0"]);
        });

        it("works for 0/1", () => {
            const tasks = createAdditionTasks(0, 1);
            expect(tasks).toEqual(["0+0", "0+1", "1+0"]);
        });

        it("works for 0/2", () => {
            const tasks = createAdditionTasks(0, 2);
            expect(tasks).toEqual(["0+0", "0+1", "0+2", "1+0", "1+1", "2+0"]);
        });

        it("works for 10/20", () => {
            const tasks = createAdditionTasks(10, 20);
            expect(tasks[0]).toEqual("10+0");
            expect(tasks[tasks.length - 1]).toEqual("20+0");
        });

    });

});
