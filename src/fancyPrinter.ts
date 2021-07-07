export default function createProgressLogger(type: string, count: number): (counter: number) => void {
    const prefix = `${type} Progress: `;

    return function print(counter: number) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(prefix + `${Math.round(counter / count * 100)}% (${counter}/${count})`);
        if (counter === count)
            process.stdout.write("\n");
    }
}
