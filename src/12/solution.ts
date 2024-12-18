import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution12 : Solution = {
    compute(): string {
        return this.compute1() + " </br> " + this.compute2();
    },
    
    compute1() {
        let lines = readFileSync('./src/12/input.txt', 'utf-8').split("\n").slice(0, -1);
        let garden = new Map<string, Set<Plot>>();
        let visited = new Set<String>();
        for(let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines[0].length; j++) {
                let result = new Set<Plot>();
                discover(lines, i, j, lines[i][j], visited, result);
                if (result.size > 0) {
                    garden.set(i + "x" + j, result);
                }
            }
        }

        let initialPoints = new Map<string, number>();
        garden.forEach((plot, key) => {
            let perimeterSum = Array.from(plot).map(p => p.perimeter).reduce((agg, cur) => agg + cur, 0);

            initialPoints.set(key, perimeterSum * plot.size);
        })

        return "" + Array.from(initialPoints.entries()).map(value => value[0] + "=" + value[1]).join("|") + "</br>" + Array.from(initialPoints.values()).reduce((agg, cur) => agg + cur, 0);
    },


    compute2() {
        let lines = readFileSync('./src/12/input.txt', 'utf-8').split("\n").slice(0, -1);
        let garden = new Map<string, Set<Plot>>();
        let visited = new Set<String>();
        for(let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines[0].length; j++) {
                let result = new Set<Plot>();
                discover(lines, i, j, lines[i][j], visited, result);
                if (result.size > 0) {
                    garden.set(i + "x" + j, result);
                }
            }
        }

        let initialPoints = new Map<string, number>();
        garden.forEach((plot, key) => {
            let plotArr = Array.from(plot);
            let perimeterSum = plotArr.map(p => calculateCorners([...plotArr], p, lines.length - 1, lines[0].length -1)).reduce((agg, cur) => agg + cur, 0);
            initialPoints.set(key, perimeterSum * plot.size);
        })

        return "" + Array.from(initialPoints.entries()).map(value => value[0] + "=" + value[1]).join("|") + "</br>" + Array.from(initialPoints.values()).reduce((agg, cur) => agg + cur, 0);
   
    },
}

interface Plot {
    y: number;
    x: number;
    perimeter: number;
}
function discover(lines: string[], y: number, x: number, cur: string, visited: Set<String>, res: Set<Plot>) {
    if (y < 0 || x < 0 || y > lines.length - 1 || x > lines[0].length - 1) {
        return;
    }
    
    if (cur !== lines[y][x]) {
        return;
    }

    if (visited.has(y + "x" + x)) {
      return;
    } else {
        visited.add(y + "x" + x);
    }

    let plot: Plot = {
        y: y,
        x: x,
        perimeter: calculatePerimeter(lines, y, x),
    }

    res.add(plot);

    discover(lines, y+1, x, cur, visited, res);
    discover(lines, y-1, x, cur, visited, res);
    discover(lines, y, x+1, cur, visited, res);
    discover(lines, y, x-1, cur, visited, res);

}

function calculatePerimeter(lines: string[], y: number, x: number): number {
    let result = 0;

    let cur = lines[y][x];

    if (y == 0 ||  lines[y-1][x] != cur){
        result++;
    }

    if (x == 0 || lines[y][x-1] != cur) {
        result++;
    }

    if (y == lines.length -1 || lines[y + 1][x] != cur) {
        result++;
    }

    if (x == lines[0].length - 1 || lines[y][x + 1] != cur) {
        result++;
    }
    
    return result;
}

function calculateCorners(plotArr: Plot[], point: Plot, maxY: number, maxX: number): number {
    return isTopLeftCornerOut(plotArr, point) + isTopRightCornerOut(plotArr, point, maxX) 
            + isBottomLeftCornerOut(plotArr, point, maxY) + isBottomRightCornerOut(plotArr, point, maxX, maxY)
            + isTopLeftCornerIn(plotArr, point) + isTopRightCornerIn(plotArr, point, maxX) 
            + isBottomLeftCornerIn(plotArr, point, maxY) + isBottomRightCornerIn(plotArr, point, maxX, maxY);  
}

function exists(plotArr: Plot[], x: number, y: number) : boolean {
    return plotArr.filter(p => p.y === y && p.x === x).length === 1;
}

/*
XO
OO
*/
function isTopLeftCornerOut(plotArr: Plot[], point: Plot): number {
    if(isTop(plotArr, point) && isLeft(plotArr, point)) {
        return 1;
    } else {
        return 0;
    }
}

/*
OX
OO
*/
function isTopRightCornerOut(plotArr: Plot[], point: Plot, maxX: number): number {
    if(isTop(plotArr, point) && isRight(plotArr, point, maxX)) {
        return 1;
    } else {
        return 0;
    }
}

/*
OO
XO
*/
function isBottomLeftCornerOut(plotArr: Plot[], point: Plot, maxY: number): number {
    if(isBottom(plotArr, point, maxY) && isLeft(plotArr, point)) {
        return 1;
    } else {
        return 0;
    }
}

/*
OO
OX
*/
function isBottomRightCornerOut(plotArr: Plot[], point: Plot, maxX: number, maxY: number): number {
    if(isBottom(plotArr, point, maxY) && isRight(plotArr, point, maxX)) {
        return 1;
    } else {
        return 0;
    }
}

/*
XX
X?
*/
function isTopLeftCornerIn(plotArr: Plot[], point: Plot): number {
    if(!exists(plotArr, point.x+1, point.y+1) && exists(plotArr, point.x+1, point.y) && exists(plotArr, point.x, point.y+1)) {
        return 1;
    } else {
        return 0;
    }
}

/*
XX
?X
*/
function isTopRightCornerIn(plotArr: Plot[], point: Plot, maxX: number): number {
    if(!exists(plotArr, point.x-1, point.y+1) && exists(plotArr, point.x-1, point.y) && exists(plotArr, point.x, point.y+1)) {
        return 1;
    } else {
        return 0;
    }
}

/*
X?
XX
*/
function isBottomLeftCornerIn(plotArr: Plot[], point: Plot, maxY: number): number {
    if(!exists(plotArr, point.x+1, point.y-1) && exists(plotArr, point.x+1, point.y) && exists(plotArr, point.x, point.y-1)) {
        return 1;
    } else {
        return 0;
    }
}

/*
?X
XX
*/
function isBottomRightCornerIn(plotArr: Plot[], point: Plot, maxX: number, maxY: number): number {
    if(!exists(plotArr, point.x-1, point.y-1) && exists(plotArr, point.x-1, point.y) && exists(plotArr, point.x, point.y-1)) {
        return 1;
    } else {
        return 0;
    }
}

function isTop(plotArr: Plot[], point: Plot) : boolean {
    return point.y === 0 || !exists(plotArr, point.x, point.y - 1);
}

function isBottom(plotArr: Plot[], point: Plot, maxY: number) : boolean {
    return point.y === maxY || !exists(plotArr, point.x, point.y + 1);
}

function isLeft(plotArr: Plot[], point: Plot) : boolean {
    return point.x === 0 || !exists(plotArr, point.x - 1, point.y);
}

function isRight(plotArr: Plot[], point: Plot, maxX: number) : boolean {
    return point.x === maxX || !exists(plotArr, point.x + 1, point.y);
}
