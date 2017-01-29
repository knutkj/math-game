import strings from "./strings";

export function formatString (template: string, ...args: any[]): string {
    return args.reduce(
        (prev, value, i) => prev.replace(`{${i}}`, getValue(value)),
        template);
}

export function getValue (value: string | boolean): string {
    if (typeof value === "boolean") {
        return strings[value ? "yes" : "no"];
    }
    return value;
}
