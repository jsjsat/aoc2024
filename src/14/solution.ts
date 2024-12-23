import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution14 : Solution = {
    compute(): string {
        return this.compute1() + "</br> " + this.compute2();
    },
    
    compute1() {
        const seconds = 100;
        const height = 103;
        const width = 101;
        let robots = readFileSync('./src/14/input.txt', 'utf-8').split("\n").slice(0, -1).map(line => new Robot(line));
        robots.forEach(robot => robot.simulate(seconds, width, height));
        let q1 = robots.filter(robot => filterQ(robot, 1, width, height)).length;
        let q2 = robots.filter(robot => filterQ(robot, 2, width, height)).length;
        let q3 = robots.filter(robot => filterQ(robot, 3, width, height)).length;
        let q4 = robots.filter(robot => filterQ(robot, 4, width, height)).length;

        return printMap(width, height, robots) + "</br>" + (q1*q2*q3*q4);
       },


       compute2() {
        const height = 103;
        const width = 101;
        let robots = readFileSync('./src/14/input.txt', 'utf-8').split("\n").slice(0, -1).map(line => new Robot(line));
        let i = 1;
        while(i < 100000) {
            robots.forEach(robot => robot.simulate(1, width, height));
            let max = robots.filter(robot => hasAllNeighbors(robots, robot));
            if (max.length > 100) {
                break;
            }
            i++;
        }
    

        return printMap(width, height, robots) + "</br>" + i;
       },

}

class Robot {
    x: number;
    y: number;
    vX: number;
    vY: number;

    constructor(line: String) {
        let eq1 = line.indexOf("=");
        let eq2 = line.lastIndexOf("=");
        let col1 = line.indexOf(",");
        let col2 = line.lastIndexOf(",");
        let space = line.indexOf(" ");

        this.x = +line.substring(eq1 + 1, col1);
        this.y = +line.substring(col1 + 1, space);
        this.vX = +line.substring(eq2 + 1, col2);
        this.vY = +line.substring(col2+1);
    }

    simulate(seconds: number, width: number, height: number) {
        let newX = (this.x + this.vX * seconds) % width;
        let newY = (this.y + this.vY * seconds) % height;
        

        if (newX < 0) {
            newX = width + newX;
        }

        if (newY < 0) {
            newY = height + newY;
        }

        this.x = newX;
        this.y = newY;
    }
}

function printMap(width: number, height: number, robots: Robot[] ): string {
    let res = "";
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let count = robots.filter(robot => robot.x === j && robot.y === i).length;
            res += count > 0 ? "X" : "&nbsp";
        }
        res +="</br>"
    }

    return res;
}

function filterQ(robot: Robot, q: number, width: number, height: number): boolean {
    if (q === 1) {
        return robot.x < ((width - 1) / 2) && robot.y < ((height - 1)  / 2);
    }

    if (q === 2) {
        return robot.x > ((width - 1) / 2) && robot.y < ((height - 1)  / 2);
    }

    if (q === 3) {
        return robot.x < ((width - 1) / 2) && robot.y > ((height - 1)  / 2);
    }

    if (q === 4) {
        return robot.x > ((width - 1) / 2) && robot.y > ((height - 1)  / 2);
    }

    return false;
}
function hasAllNeighbors(robots: Robot[], robot: Robot): boolean {
    let left = robots.filter(other => other.x === robot.x-1 && other.y == robot.y).length;
    let right = robots.filter(other => other.x === robot.x+1 && other.y == robot.y).length;
    let up = robots.filter(other => other.x === robot.x && other.y == robot.y-1).length;
    let down = robots.filter(other => other.x === robot.x && other.y == robot.y+1).length;

    return left > 0 && right > 0 && up > 0 && down > 0;
}

