import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution1 : Solution = {
    compute(): string {
        return "1:" + this.compute1() + "\n" + "2:" + this.compute2();
    },
    
    compute1() {
        const file = readFileSync('./src/1/input.txt', 'utf-8');
        const arr = file.split("\n");
        const arrL = arr.map(line => +line.split("   ")[0]).sort((a,b) => b - a);
        const arrR = arr.map(line => +line.split("   ")[1]).sort((a,b) => b - a);
        let result = 0;
        for (let i = 0; i < arrL.length - 1; i++) {
            result += Math.abs(arrL[i] - arrR[i]);
        }
        return ""+result;
    },

    compute2() {
        const file = readFileSync('./src/1/input.txt', 'utf-8');
        const arr = file.split("\n");
        const arrL = arr.map(line => +line.split("   ")[0]).sort((a,b) => b - a);
        const arrR = arr.map(line => +line.split("   ")[1]).sort((a,b) => b - a);
        const arrCounts = arrL.map(x => arrR.filter(y => x === y).length);
        let result = 0;
        for (let i = 0; i < arrL.length - 1; i++) {
            result += Math.abs(arrL[i] * arrCounts[i]);
        }
        return ""+result;
    }
}