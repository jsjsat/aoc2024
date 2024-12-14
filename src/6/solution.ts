import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution6 : Solution = {
    compute(): string {
        return "1:" + this.compute1() + "\n" + "2:" + this.compute2();
    },
    
    compute1() {
        const file = readFileSync('./src/6/input.txt', 'utf-8');
        const map = file.split("\n").slice(0, -1);
        let result = 1;
        let guard = new Guard(map);
        while(guard.move(map)) {
            if (map[guard.posY][guard.posX] != 'X') {
                map[guard.posY] = replace(map[guard.posY], guard.posX, 'X');
                result++;
            }
        }
        return "" + result;

    },

    compute2() {
        const file = readFileSync('./src/6/input.txt', 'utf-8');
        const map = file.split("\n").slice(0, -1);
        let result = 0;
        
        for(let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if(map[i][j] == '.') {
                    map[i] = replace(map[i], j, '#');
                    result+= isMapALoop(map);
                    map[i] = replace(map[i], j, '.');
                }
            }
        }
        
        return "" + result;
    },
}

function replace(str: string, index: number, replacement: string) {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

class Guard {
    posX: number = 0;
    posY: number = 0;
    speedX: number = 0;
    speedY: number = 0;
    history: Set<string> = new Set<string>();

    constructor(map: string[]) {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                let value = map[i][j];
                if ("^V<>".includes(value)) {
                    this.posX = j;
                    this.posY = i;
                    this.speedX = value == '>' ? 1 : (value == '<' ? -1 : 0);
                    this.speedY = value == '^' ? -1 : (value == 'V' ? +1 : 0);
                    break;
                }
            }
        } 
    }

    move(map: String[]) : boolean{
        let tempX = this.posX + this.speedX;
        let tempY = this.posY + this.speedY;

        if (tempX < 0 || tempY < 0 || tempX >= map[0].length || tempY >= map.length) {
            return false;
        }

        if (map[tempY][tempX] == '#') {
            this.turn();
            return this.move(map);
        }

        this.posX = tempX;
        this.posY = tempY;

        return this.posX > 0 && this.posY > 0 && this.posX < map[0].length && this.posY < map.length;
    }

    turn() {
        if (this.speedX == 1) {
            this.speedX = 0;
            this.speedY = 1;
        } else if (this.speedX == -1) {
            this.speedX = 0;
            this.speedY = -1;
        } else if (this.speedY == 1) {
            this.speedY = 0;
            this.speedX = -1;
        } else if (this.speedY == -1) {
            this.speedY = 0;
            this.speedX = 1;
        }
    }

    markInHistory() {
        this.history.add(this.posX + "x" + this.posY + "x" + this.speedX + "x" + this.speedY);
    }

    isStuck(): boolean {
        return this.history.has(this.posX + "x" + this.posY + "x" + this.speedX + "x" + this.speedY);
    }
}

function isMapALoop(map: string[]) {
    let guard = new Guard(map);
    while(guard.move(map)) {
        if (guard.isStuck()) {
            return 1;
        }
        guard.markInHistory();
    }
    return 0;
}
