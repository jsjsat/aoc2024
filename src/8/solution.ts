import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution8 : Solution = {
    compute(): string {
        return "1:" + this.compute1()  + "\n" + "2:" + this.compute2();
    },
    
    compute1() {
        const file = readFileSync('./src/8/input.txt', 'utf-8');
        let lines = file.split("\n").slice(0, -1);
        const resultSet = new Set<string>();
        let nodeMap: Map<string, number[][]> = buildNodeMap(lines);

        for(let [fq, positions] of nodeMap) {
            for(let pos of positions) {
                calculateAntiNodes1(resultSet, nodeMap.get(fq), pos, lines.length, lines[0].length);
            }
        }

        return "" + resultSet.size;
    },

    compute2() {
        const file = readFileSync('./src/8/input.txt', 'utf-8');
        let lines = file.split("\n").slice(0, -1);
        const resultSet = new Set<string>();
        let nodeMap: Map<string, number[][]> = buildNodeMap(lines);

        for(let [fq, positions] of nodeMap) {
            for(let pos of positions) {
                calculateAntiNodes2(resultSet, nodeMap.get(fq), pos, lines.length, lines[0].length);
            }
        }

        return "" + resultSet.size;
    },
}

function buildNodeMap(lines: string[]): Map<string, number[][]> {
    const nodeMap = new Map<string, number[][]>();
    for(let i = 0; i < lines.length; i++) {
        for(let j = 0; j < lines[0].length; j++) {
            let item = lines[i][j];
            if(item !== '.') {
                let nodes = nodeMap.get(item);
                if (!nodes) {
                    nodes = [];
                }

                nodes.push([i, j]);
                nodeMap.set(item, nodes);
            }
        }
    }
    return nodeMap;
}
function calculateAntiNodes1(resultSet: Set<string>, nodes: number[][] | undefined, pos: number[], yMax: number, xMax: number) {
    if(!nodes) {
        return;
    }

    let posY = pos[0];
    let posX = pos[1];


    for(let node of nodes) {
        let nodeY = node[0];
        let nodeX = node[1];

        if (nodeX == posX && nodeY == posY) {
            continue;
        }

        let distX = posX - nodeX;
        let distY = posY - nodeY;

        let an1X = posX - 2*distX; 
        let an2X = posX - (-1 * distX);
        let an1Y = posY - 2*distY;
        let an2Y = posY - (-1* distY);

        if (an1X >= 0 && an1X < xMax && an1Y >= 0 && an1Y < yMax) {
            resultSet.add(an1Y + "x" + an1X);
        }

        if (an2X >= 0 && an2X < xMax && an2Y >= 0 && an2Y < yMax) {
            resultSet.add(an2Y + "x" + an2X);
        }

    }
}

function calculateAntiNodes2(resultSet: Set<string>, nodes: number[][] | undefined, pos: number[], yMax: number, xMax: number) {
    if(!nodes) {
        return;
    }

    let posY = pos[0];
    let posX = pos[1];


    for(let node of nodes) {
        let nodeY = node[0];
        let nodeX = node[1];

        if (nodeX == posX && nodeY == posY) {
            continue;
        }
        for (let i = 0; i < xMax; i++) {
         generateAntiNodes(resultSet, posX, posY, nodeX, nodeY, xMax, yMax, i);
        }

    }
}

function generateAntiNodes(resultSet: Set<string>, posX: number, posY: number, nodeX: number, nodeY: number, xMax: number, yMax: number, mult: number) {
    let distX = posX - nodeX;
    let distY = posY - nodeY;

    let an1X = posX - (2*distX * mult); 
    let an2X = posX - ((-1 * distX) * mult);
    let an1Y = posY - (2*distY * mult);
    let an2Y = posY - ((-1* distY) * mult);

    if (an1X >= 0 && an1X < xMax && an1Y >= 0 && an1Y < yMax) {
        resultSet.add(an1Y + "x" + an1X);
    }

    if (an2X >= 0 && an2X < xMax && an2Y >= 0 && an2Y < yMax) {
        resultSet.add(an2Y + "x" + an2X);
    }

}
