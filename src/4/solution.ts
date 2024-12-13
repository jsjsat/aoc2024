import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution4 : Solution = {
    compute(): string {
        return "1:" + this.compute1() + "\n" + "2:" + this.compute2();
    },
    
    compute1() {
        const file = readFileSync('./src/4/input.txt', 'utf-8');
        let lines = file.split("\n").slice(0, -1);
        let result = 0;
        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines[0].length; j++) {
                if (lines[i][j] === 'X') {
                    result += checkXmasCount1(i, j, lines);
                }
            }
        }


        return "" + result;

    },

    compute2() {
        const file = readFileSync('./src/4/input.txt', 'utf-8');
        let lines = file.split("\n").slice(0, -1);
        let result = 0;
        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines[0].length; j++) {
                if (lines[i][j] === 'A') {
                    result += checkXmasCount2(i, j, lines);
                }
            }
        }


        return "" + result;
    },

}

function checkXmasCount1(i: number, j: number, lines: string[]): number {
    let count = 0;
    // n
    if (i > 2) {
        if (lines[i-1][j] == 'M' && lines[i-2][j] == 'A' && lines[i-3][j] == 'S') {
            count++;
        }
    }
    // s
    if (i < lines.length - 3) {
        if (lines[i+1][j] == 'M' && lines[i+2][j] == 'A' && lines[i+3][j] == 'S') {
            count++;
        }
    }
    // w
    if (j > 2) {
        if (lines[i][j-1] == 'M' && lines[i][j-2] == 'A' && lines[i][j-3] == 'S') {
            count++;
        }
    }
    // e
    if (j < lines[0].length - 3) {
        if (lines[i][j+1] == 'M' && lines[i][j+2] == 'A' && lines[i][j+3] == 'S') {
            count++;
        }
    }

    //nw
    if (i > 2 && j > 2) {
        if (lines[i-1][j-1] == 'M' && lines[i-2][j-2] == 'A' && lines[i-3][j-3] == 'S') {
            count++;
        }
    }

    //se
    if (i < lines.length - 3 && j < lines[0].length - 3) {
        if (lines[i+1][j+1] == 'M' && lines[i+2][j+2] == 'A' && lines[i+3][j+3] == 'S') {
            count++;
        }
    }

    //ne
    if (j < lines[0].length - 3 && i > 2) {
        if (lines[i-1][j+1] == 'M' && lines[i-2][j+2] == 'A' && lines[i-3][j+3] == 'S') {
            count++;
        }
    }
    //sw 
    if (i < lines.length - 3 && j > 2) {
        if (lines[i+1][j-1] == 'M' && lines[i+2][j-2] == 'A' && lines[i+3][j-3] == 'S') {
            count++;
        }
    }


    return count;
}

function checkXmasCount2(i: number, j: number, lines: string[]): number {

    if (i > 0 && j > 0 && j < lines[0].length - 1 && i < lines.length - 1) {
        if ((lines[i-1][j-1] == 'M' && lines[i+1][j+1] == 'S') || (lines[i-1][j-1] == 'S' && lines[i+1][j+1] == 'M')) {
            if ((lines[i-1][j+1] == 'M' && lines[i+1][j-1] == 'S') || (lines[i-1][j+1] == 'S' && lines[i+1][j-1] == 'M')) {
                return 1;
            }
        }
    }

    return 0;
}
