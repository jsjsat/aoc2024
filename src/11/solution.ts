import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution11 : Solution = {
    compute(): string {
        return this.compute1() + " </br> " + this.compute2();
    },
    
    compute1() {
        const blinks = 25;
        let stones = readFileSync('./src/11/input.txt', 'utf-8').split("\n")[0].split(" ").map(Number);

        for(let j = 1; j <= blinks; j++) {
            let newStones: number[] = [];
            stones.forEach((stone, i) => {
                let x: number[] = changeStone(stone);
                newStones.push(...x);
            })
            stones = newStones;
        }

        return "" + stones.length;
    },


    compute2() {
        const blinks = 75;
        let cache = new Map<string, number>();
        let stones = readFileSync('./src/11/input.txt', 'utf-8').split("\n")[0].split(" ").map(Number);

        return "" + stones.map(stone => count(stone, blinks, cache)).reduce((agg, cur) => agg + cur, 0);
    },
}
function changeStone(stone: number): number[] {
    if(stone === 0) {
        return [1];
    }
    let digits = stone.toString().length;
    if (digits % 2 == 0) {
        let left = +stone.toString().substring(0, digits / 2);
        let right = +stone.toString().substring(digits / 2);
        return [left, right];
    }

    return [stone * 2024];
}

function count(x: number, blinks: number, cache: Map<string, number>): number {
    if (blinks === 0) {
        return 1;
    }

    let cacheKey = x + "x" + blinks;
    let res = cache.get(cacheKey);
    if (res) {
        return res;
    }

    if (x == 0) {
        res = count(1, blinks - 1, cache)
        cache.set(cacheKey, res);
        return res;
    }

    let digits = x.toString().length;
    if (digits % 2 == 0) {
        let left = +x.toString().substring(0, digits / 2);
        let right = +x.toString().substring(digits / 2);
        let res = count(left, blinks-1, cache) + count(right, blinks-1, cache);
        cache.set(cacheKey, res);
        return res;
    }

    res = count(x*2024, blinks -1, cache);
    cache.set(cacheKey, res);
    return res;
}