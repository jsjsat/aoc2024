import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution15 : Solution = {
    compute(): string {
        return this.compute1() + "</br>" +  this.compute2();
    },
    
    compute1() {
        let lines = readFileSync('./src/15/input.txt', 'utf-8').split("\n").slice(0, -1);
        let map: string[][] = lines.filter(line => line[0] ==="#").map(line => line.split(""));
        let moves: string = lines.filter(line => line.startsWith("<") || line.startsWith("^") || line.startsWith(">") || line.startsWith("v")).join("");
        let robot: Robot = findRobot(map);
        let result = 0;

        for (let move of moves) {
            simulate1(map, robot, move);
        }

        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (map[i][j] === 'O') {
                    result+= i * 100 + j;
                }
            }
        }
        
        return map.join("</br>") + "</br>" + result;
    },

    compute2() {
        let lines = readFileSync('./src/15/input.txt', 'utf-8').split("\n").slice(0, -1);
        let map: string[][] = lines.filter(line => line[0] ==="#").map(line => convertLine(line)).map(line => line.split(""));
        let moves = lines.filter(line => line.startsWith("<") || line.startsWith("^") || line.startsWith(">") || line.startsWith("v")).join("");
        let fieldMap = convertMap(map);
        let result = 0;

        for (let move of moves) {
            moveRobot(fieldMap, move);
        }
        
        let str = drawMap(fieldMap, map.length, map[0].length);
        for(let f of fieldMap) {
            if (f.type === FieldType.stone) {
                result+= f.y * 100 + f.x;
            }
        }
        
        
        return str + result;
    },

}

function simulate1(map: string[][], robot: Robot, move: string) {
    let x = robot.x;
    let y = robot.y;

    let xdif = 0;
    let ydif = 0;

    switch(move) {
        case "v":
            ydif++;
            break;
        case "<":
            xdif--;
            break;
        case ">":
            xdif++;
            break;
        case "^":
            ydif--;
            break;
    }

    let nx = x + xdif;
    let ny = y + ydif;
    let neighbor = map[ny][nx];

    if (neighbor == '#') {
        return map;
    }

    if (neighbor == '.') {
         // old robot position is now a .
        map[y][x] = ".";
        map[ny][nx] = '@';
        robot.x = nx;
        robot.y = ny;
        return;
    }

    let nearestSpace = findNearestSpace(move, robot, map);
    if (!nearestSpace) {
        return;
    }

    map[y][x] = ".";
    map[nearestSpace.y][nearestSpace.x] = "O";
    map[ny][nx] = '@';
    robot.x = nx;
    robot.y = ny;   
    
    return;
}

interface Robot {
    x: number;
    y: number;
}

enum FieldType {
    robo,
    stone,
    wall,
}

class Field {
    x: number;
    y: number;
    type: FieldType;

    constructor(x: number, y: number, type: FieldType) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}

function findNearestSpace(dir: string, robot: Robot, map: string[][]): Robot | undefined {
    let pos = -1;

    if (dir === '>') {
        for(let i = robot.x + 2; i < map[0].length; i++) {
            let place = map[robot.y][i];
            if (place === '.') {
                return {x: i, y: robot.y};
            }

            if (place === '#') {
                return undefined;
            }
        }
    }

    if (dir === '<') {
        for(let i = robot.x - 2; i >= 0; i--) {
            let place = map[robot.y][i];
            if (place === '.') {
                return {x: i, y: robot.y};
            }

            if (place === '#') {
                return undefined;
            }
        }
    }

    if (dir === 'v') {
        for(let i = robot.y + 2; i < map.length; i++) {
            let place = map[i][robot.x];
            if (place === '.') {
                return {x: robot.x, y: i}
            }

            if (place === '#') {
                return undefined;
            }
        }
    }

    if (dir === '^') {
        for(let i = robot.y - 2; i >= 0; i--) {
            let place = map[i][robot.x];
            if (place === '.') {
                return {x: robot.x, y: i}
            }

            if (place === '#') {
                return undefined;
            }
        }
    }

    return undefined;


}

function findRobot(map: string[][]) : Robot {
    let x = -1;
    let y = -1;

    for(let i = 0; i < map.length; i++) {
        for(let j = 0; j < map[0].length; j++) {
            if (map[i][j] === "@") {
                return {x:j, y:i};
            }
        }
    }

    return {x, y};
}

function convertField(field: string): string {
    switch(field[0]) {
        case ".": {
            return "..";
        }
        case "#": {
            return "##";
        }
        case "@": {
            return "@.";
        }
    }
    return "[]";
}

function convertLine(line: string): any {
    let str = "";
    for(let i = 0; i < line.length; i++) {
        str +=convertField(line[i]);
    }

    return str;
}

function convertMap(map: string[][]): Field[] {
    let result = [];
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            let str = map[i][j];

            if (str === '.' || str === ']') {
                continue;
            }

            let fieldType = str === '#' ? FieldType.wall : str === '[' ? FieldType.stone : FieldType.robo;
            result.push(new Field(j, i, fieldType));
        }
    }
    return result;
}

function moveRobot(fieldMap: Field[], move: string) {
    let robot = fieldMap.filter(field => field.type === FieldType.robo)[0];

    let xdif = 0;
    let ydif = 0;

    switch(move) {
        case "v":
            ydif++;
            break;
        case "<":
            xdif--;
            break;
        case ">":
            xdif++;
            break;
        case "^":
            ydif--;
            break;
    }

    let nx = robot.x + xdif;
    let ny = robot.y + ydif;

    let neighbor = fieldMap.filter((field => (field.x === nx || (field.x  === nx - 1 && field.type === FieldType.stone)) && field.y === ny))[0];
    if (!neighbor) {
        robot.x = nx;
        robot.y = ny;
        return;
    }

    if (neighbor.type === FieldType.wall) {
        return;
    }

    if(canMoveStone(fieldMap, neighbor, xdif, ydif)) {
        moveStone(fieldMap, neighbor, xdif, ydif);
        robot.x = nx;
        robot.y = ny;
    }

}

function canMoveStone(fieldMap: Field[], neighbor: Field, xdif: number, ydif: number) : boolean {
    let fields = getNeighbors(fieldMap, neighbor, xdif, ydif);
    for (let field of fields) {
        if (field.type === FieldType.wall) {
            return false;
        }

        if (field.type === FieldType.stone && !canMoveStone(fieldMap, field, xdif, ydif)) {
            return false;
        }
    }

    return true;
}

function moveStone(fieldMap: Field[], field: Field, xdif: number, ydif: number) {
    let neighbors = getNeighbors(fieldMap, field, xdif, ydif);
    for (let neighbor of neighbors) {
        if (neighbor.type === FieldType.stone) {
            moveStone(fieldMap, neighbor, xdif, ydif);
        }
    }
    field.x+= xdif;
    field.y+= ydif;
}

function getNeighbors(fieldMap: Field[], cur: Field, xdif: number, ydif: number) : Field[] {
    let nx = cur.x + xdif;
    let ny = cur.y + ydif;

    // left ?
    if (xdif === -1) {
        return fieldMap.filter((field => (field.x === nx || (field.x  === nx - 1 && field.type === FieldType.stone)) && field.y === ny));
    }
    // right ?
    if (xdif === 1) {
        return fieldMap.filter((field => (field.x === nx + 1) && field.y === ny));
    }

    // up ?
    if (ydif === -1) {
        return fieldMap.filter((field => (field.x === nx || field.x === nx + 1 ||  (field.x  === nx - 1 && field.type === FieldType.stone)) && field.y === ny));
    }

    // down?
    return fieldMap.filter((field => (field.x === nx || field.x === nx + 1 ||  (field.x  === nx - 1 && field.type === FieldType.stone)) && field.y === ny));
}

function convertType(type: FieldType, move: string) {
    return type === FieldType.robo ? move : type === FieldType.wall ? '#' : '[';
}

function drawMap(fieldMap: Field[], height: number, width: number) : string {
    let str = "";
    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            let f = fieldMap.filter(field => field.x === j && field.y === i);
            if (f[0]) {
                str+= convertType(f[0].type, "@");
                if (f[0].type == FieldType.stone) {
                    str+="]";
                    j++;
                }
            } else {
                str+= '.';
            }
        }   
        str+="</br>";
    }
    return str;
}

