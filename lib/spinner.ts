import chalk from "chalk";
import { Spinner as Base, createSpinner as createNanoSpinner } from "nanospinner";

class Spinner {
    private spinner: Base;

    constructor(text: string) {
        const frames = [
            "1000000", "1100000",
            "1110000", "1111000",
            "1111100", "1111110",
            "1111111", "0111111",
            "0011111", "0001111",
            "0000111", "0000011",
            "0000001", "0000000",
        ];
        const symbols = ['.', ':', '*', 'o', 'O', '+', 'x', '%', '#'];
        let finalFrames: string[] = [];
        for (const symbol of symbols) {
            for (const frame of frames) {
                finalFrames.push(frame.replace(/1/g, symbol).replace(/0/g, ' '));
            }
        }
        this.spinner = createNanoSpinner(text, {
            interval: 150,
            frames: finalFrames.map(frame => chalk.bold.blue(` ${frame} `)),
        });
    }
    fail(reason: string) {
        this.spinner.error({ text: chalk.bold.red(reason) });
    }
    succeed(message: string) {
        this.spinner.success({ text: chalk.bold.green(message) });
    }
    start() {
        this.spinner.start();
    }
}

export default Spinner;