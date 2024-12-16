import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution9 : Solution = {
    compute(): string {
        return this.compute1() + " </br> " + this.compute2();
    },
    
    compute1() {
        const file = readFileSync('./src/9/input.txt', 'utf-8');
        let line = file.split("\n")[0];
        let resArr : string[] = [];
        let res = 0;

        for(let i = 0; i < line.length; i++) {
            let value = +line[i];
            let id = i%2 == 0 ? "" + Math.floor(i / 2) : '.';
            for (let j = 0; j < value; j++) {
                resArr.push(id);
            }
        }

        for(let i = 0; i < resArr.length; i++) {
            let item = resArr.at(i)
            if (!item) {
                break;
            }

            if (item === '.') {
                let newItem = getAndRemoveLastBlock(resArr, i);
                if (!newItem) {
                    break;
                }

                resArr[i] = newItem;
            }
        }

        res = resArr.filter(item => item !== '.').map((item,i) => (+item) * i).reduce((agg, cur) => agg + cur, 0);

        return "" + resArr.join('') + "</br>" + res;
    },


    compute2() {
        const file = readFileSync('./src/9/input.txt', 'utf-8');
        let line = file.split("\n")[0];
        let resArr : string[][] = [];
        let res = 0;

        for(let i = 0; i < line.length; i++) {
            let value = +line[i];
            let id = i%2 == 0 ? "" + Math.floor(i / 2) : '.';
            resArr.push(new Array(value).fill(id));
        }

        for(let i = resArr.length - 1; i >= 0; i--) {
            let item = resArr.at(i);

            if(!item) {
                break;
            }

            if (item[0] === '.') {
                continue;
            }

            let blockSize = item.length;
            let spaceIndex = getSpace(resArr, blockSize, i);
            if(spaceIndex == -1) {
                continue;
            }

            let space = resArr[spaceIndex];
            let spaceSize = space.length;
            let spaceLeft = spaceSize - blockSize;
            if (spaceLeft === 0) {
                resArr[i] = space;
                resArr[spaceIndex] = item;
            } else {
                resArr[spaceIndex] = item;
                resArr[i] = new Array(blockSize).fill('.');
                resArr.splice(spaceIndex+1, 0, new Array(spaceLeft).fill('.'));
                i++;
            }
        }

        res = resArr.flat().map((item,i) => item === '.' ? 0 : (+item) * i).reduce((agg, cur) => agg + cur, 0);

        return "" + resArr.flat().join('') + "</br>" + res;
    },
}

function getAndRemoveLastBlock(resArr: string[], limit: number): string | undefined {
    for(let i = resArr.length - 1; i > limit; i--) {
        let value = resArr[i];
        if (value != '.') {
            resArr.splice(i,1);
            return value;
        }
    }

    return undefined;
}

function getSpace(resArr: string[][], blockSize: number, limit: number):number {
    for(let i = 0; i < limit; i++) {
        let item = resArr[i];
        if (item[0] === '.' && item.length >= blockSize) {
            return i;
        }
    }
    return -1;
}

