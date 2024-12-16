import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution10 : Solution = {
    compute(): string {
        return this.compute1() + " </br> " + this.compute2();
    },
    
    compute1() {
        const rows = readFileSync('./src/10/input.txt', 'utf-8').split("\n").slice(0, -1);
        let result = 0;

        for(let i = 0; i < rows.length; i++) {
            for(let j = 0; j < rows[0].length; j++) {
                let item = rows[i][j];
                if (item !== '0') {
                    continue;
                }

                result += getTrailHeadAmount(rows, i, j);

            }
        }


        return "" + result;
    },


    compute2() {
        const rows = readFileSync('./src/10/input.txt', 'utf-8').split("\n").slice(0, -1);
        let result = 0;

        for(let i = 0; i < rows.length; i++) {
            for(let j = 0; j < rows[0].length; j++) {
                let item = rows[i][j];
                if (item !== '0') {
                    continue;
                }

                result += getTrailAmount(rows, i, j);

            }
        }


        return "" + result;
    },
}

function getTrailHeadAmount(rows: string[], i: number, j: number) : number {
    let trailHeads : Set<string> = new Set<string>();

    walkTrail(trailHeads, rows, 0, i + 1, j);
    walkTrail(trailHeads, rows, 0, i - 1, j);
    walkTrail(trailHeads, rows, 0, i, j + 1);
    walkTrail(trailHeads, rows, 0, i, j - 1);

    return trailHeads.size;
}

function getTrailAmount(rows: string[], i: number, j: number) : number {
    let count = 0;

    count += walkTrailCount(rows, 0, i + 1, j);
    count += walkTrailCount(rows, 0, i - 1, j);
    count += walkTrailCount(rows, 0, i, j + 1);
    count += walkTrailCount(rows, 0, i, j - 1);

    return count;
}

function walkTrail(trailHeads: Set<string>, rows: string[], height: number, i: number, j: number) {
    if (i < 0 || j < 0 || i >= rows.length || j >= rows[0].length) {
        return;
    }

    let curHeight = +rows[i][j];

    if(curHeight == height + 1) {
        if (curHeight === 9) {
            trailHeads.add(i + "x" + j);
            return;
        }
        walkTrail(trailHeads, rows, curHeight, i + 1, j);
        walkTrail(trailHeads, rows, curHeight, i - 1, j);
        walkTrail(trailHeads, rows, curHeight, i, j + 1);
        walkTrail(trailHeads, rows, curHeight, i, j - 1);
    }
}

function walkTrailCount(rows: string[], height: number, i: number, j: number): number {
    if (i < 0 || j < 0 || i >= rows.length || j >= rows[0].length) {
        return 0;
    }

    let curHeight = +rows[i][j];
    let count = 0;

    if(curHeight == height + 1) {
        if (curHeight === 9) {
            return 1;
        }
        count += walkTrailCount(rows, curHeight, i + 1, j);
        count += walkTrailCount(rows, curHeight, i - 1, j);
        count += walkTrailCount(rows, curHeight, i, j + 1);
        count += walkTrailCount(rows, curHeight, i, j - 1);
    }

    return count;
}

