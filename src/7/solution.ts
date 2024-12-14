import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution7 : Solution = {
    compute(): string {
        return "1:" + this.compute1() + "\n" + "2:" + this.compute2();
    },
    
    compute1() {
        const file = readFileSync('./src/7/input.txt', 'utf-8');
        let equations = file.split("\n").slice(0, -1);
        return "" + equations.filter(eq => isValid1(eq)).map(eq => +eq.split(":")[0]).reduce((sum, current) => sum + current, 0);
    },

    compute2() {
        const file = readFileSync('./src/7/input.txt', 'utf-8');
        let equations = file.split("\n").slice(0, -1);
        return "" + equations.filter(eq => isValid2(eq)).map(eq => +eq.split(":")[0]).reduce((sum, current) => sum + current, 0);
    },
}
function isValid1(eq: string): boolean {
    const parts = eq.split(": ");
    const testresult = +parts[0];
    const operants = parts[1].split(" ").map(Number).reverse();

    let firstOperant = operants.pop();
    firstOperant = firstOperant === undefined ? 0 : firstOperant;
    return validate1(testresult, [...operants], firstOperant);
}

function validate1(testResult: number, operants: number[], cur: number) : boolean {
    if(operants.length == 0 || cur > testResult) {
        return testResult === cur;
    }

    let operant = operants.pop() ?? 0;

    return validate1(testResult, [...operants], cur + operant) || validate1(testResult, [...operants], cur * operant);   
}

function isValid2(eq: string): boolean {
    const parts = eq.split(": ");
    const testresult = +parts[0];
    const operants = parts[1].split(" ").map(Number).reverse();

    let firstOperant = operants.pop();
    firstOperant = firstOperant === undefined ? 0 : firstOperant;
    return validate2(testresult, [...operants], firstOperant);
}

function validate2(testResult: number, operants: number[], cur: number) : boolean {
    if(operants.length == 0 || cur > testResult) {
        return testResult === cur;
    }

    let operant = operants.pop() ?? 0;

    return validate2(testResult, [...operants], cur + operant) || validate2(testResult, [...operants], cur * operant) || validate2(testResult, [...operants], +(cur + "" + operant));   
}

