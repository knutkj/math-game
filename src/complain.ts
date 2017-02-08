export function setMode (mode: "ignore" | "alert" | "console" | "show" | "throw"): void {
    switch (mode) {
        case "ignore":
            complain = ignore;
            break;

        case "alert":
            complain = alert;
            break;

        case "console":
            complain = consoleLogError;
            break;

        case "throw":
            complain = throwError;
            break;
    }
}

export let complain: (message: string) => void = ignore;

function consoleLogError (message: string): void {
    console.error(message);
}

function throwError (message: string): void {
    throw new Error(message);
}

//function setErrorMessage (message: string): void {
//
//}

function ignore () {}
