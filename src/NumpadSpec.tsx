/// <reference types="jasmine" />

import { getKeys } from "./Numpad";

describe("Numpad", () => {

    describe("getKeys", () => {

        it("contains 0 - 11", () => {
            expect(getKeys()).toEqual([
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
            ]);
        });

    });

});
