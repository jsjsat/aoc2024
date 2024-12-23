import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution13 : Solution = {
    compute(): string {
        return this.compute1() + " </br> " + this.compute2();
    },
    
    compute1() {
        let lines = readFileSync('./src/13/input.txt', 'utf-8').split("\n").slice(0, -1).filter(x => x.length !== 0);
        let machines = lines.length / 3;
        let result = 0;
        for (let i = 0; i < machines; i++) {
            let m = new Machine([lines[i * 3],lines[i*3+1], lines[i*3+2]], 0);
            
            let mres = m.calculate();
            if (mres !== -1) {
                result+=mres;
            }
        }

        return "" + result;
       },


       compute2() {
        let lines = readFileSync('./src/13/input.txt', 'utf-8').split("\n").slice(0, -1).filter(x => x.length !== 0);
        let machines = lines.length / 3;
        let result = 0;
        for (let i = 0; i < machines; i++) {
            let m = new Machine([lines[i * 3],lines[i*3+1], lines[i*3+2]], 10000000000000);
           
            let mres = m.calculate(); 
            if (mres !== -1) {
                result+=mres;
            }
            
        }

        return "" + result;
       },
}

class Machine {
    a: Button;
    b: Button;
    prize: Prize;

    constructor(lines: string[], prizePlus: number) {
        this.a = new Button(lines[0], 3);
        this.b = new Button(lines[1], 1);
        this.prize = new Prize(lines[2], prizePlus);
    }

    play(): number {
        let result = -1;

        for(let pressA = 0; pressA <= 100; pressA++) {
            for( let pressB = 0; pressB <= 100; pressB++) {
                let x = (pressA * this.a.xPlus) + (pressB * this.b.xPlus);
                let y = (pressA * this.a.yPlus) + (pressB * this.b.yPlus);

                if (this.prize.x === x && this.prize.y === y) {
                    let tokens = (pressA * this.a.cost) + (pressB * this.b.cost);
                    result = result === -1 ? tokens : Math.min(result, tokens);
                }
            }
        }

        return result;

    }

    calculate(): number {
        // Calculate the determinant
        const determinant = this.a.xPlus * this.b.yPlus - this.b.xPlus * this.a.yPlus;

        if (determinant === 0) {
           return -1;
        }

        // Calculate A and B using Cramer's rule
        const A = (this.prize.x * this.b.yPlus - this.prize.y * this.b.xPlus) / determinant;
        const B = (this.a.xPlus * this.prize.y - this.a.yPlus * this.prize.x) / determinant;

        if (Math.floor(A) === A && Math.floor(B) === B) {
            return A * this.a.cost + B * this.b.cost;
        }

        return -1;
    }
    
    toString(): string {
        return "A:" + this.a.toString() + ", B:" + this.b.toString() + ", Prize:" + this.prize.toString();
    }
}

class Button {
    cost: number;
    xPlus: number;
    yPlus: number;

    constructor(line: string, cost: number) {
        this.cost = cost;
        let iX = line.indexOf("X");
        let iCol = line.indexOf(",");
        this.xPlus = +line.substring(iX+2, iCol);
        this.yPlus = +line.substring(iCol+4); 
    }

    toString() : string {
        return "x=+" + this.xPlus + ", y=+" + this.yPlus + ",cost=" + this.cost;
    }
}

class Prize {
    x: number;
    y: number;

    constructor(line: string, prizePlus: number) {
        let iEq = line.indexOf("=");
        let iCol = line.indexOf(",");
        this.x = +line.substring(iEq + 1, iCol) + prizePlus;
        this.y = +line.substring(iCol+4) + prizePlus;
    }

    toString() {
        return "x=" + this.x + ", y=" + this.y;
    }
}