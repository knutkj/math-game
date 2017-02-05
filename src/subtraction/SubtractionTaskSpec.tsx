/// <reference types="jasmine" />

import { createSubtractionStrings } from "./SubtractionTask";

describe("SubtractionTask", () => {

    describe("createSubtractionStrings", () => {

        it("works for 0/0", () => {
            const tasks = createSubtractionStrings(0, 0);
            expect(tasks).toEqual(["0-0"]);
        });

        it("works for 0/1", () => {
            const tasks = createSubtractionStrings(0, 1);
            expect(tasks).toEqual(["0-0", "1-0", "1-1"]);
        });

        it("works for 0/2", () => {
            const tasks = createSubtractionStrings(0, 2);
            expect(tasks).toEqual(["0-0", "1-0", "1-1", "2-0", "2-1", "2-2"]);
        });

        it("works for 10/20", () => {
            const tasks = createSubtractionStrings(10, 20);
            expect(tasks[0]).toEqual("10-0");
            expect(tasks[tasks.length - 1]).toEqual("20-20");
        });

    });

});
