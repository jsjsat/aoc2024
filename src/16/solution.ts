import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution16 : Solution = {
    compute(): string {
        return "</br>" +  this.compute2();
    },
    
    compute1() {
        let lines = readFileSync('./src/16/input.txt', 'utf-8').split("\n").slice(0, -1);
        let nodes: Map<string, Node> = getNodes(lines);
        let path = findBestPaths(nodes)[0];
        return "" + path.steps; 
    },

    compute2() {
        let lines = readFileSync('./src/16/input.txt', 'utf-8').split("\n").slice(0, -1);
        let nodes: Map<string, Node> = getNodes(lines);
        let bestPaths = findBestPaths(nodes);
        let fields = new Set<string>(bestPaths.map(path => path.path).flat());
        let str = drawMap(nodes, Array.from(fields), lines.length, lines[0].length);
        return str + fields.size; 
    },

}

let globalmin = 85480;
let dirs = getDirs();

interface Path {
    steps: number;
    path: string[];
}

class Node {
    id: string;
    x: number;
    y: number;
    isStart: boolean;
    isEnd: boolean;

    constructor(x: number, y: number, isStart: boolean, isEnd: boolean) {
        this.x = x;
        this.y = y;
        this.id = y + "|" + x;
        this.isEnd = isEnd;
        this.isStart = isStart;
    }

    getNeighborId(direction: string) {
        let newX = direction === '<' ? this.x - 1 : direction === ">" ? this.x + 1 : this.x;
        let newY = direction === '^' ? this.y - 1 : direction === "v" ? this.y + 1 : this.y;
        return newY + "|" + newX;
    }

    getNeighbors(nodeMap: Map<string, Node>): Node[] {
        let res = [];
        let up = nodeMap.get(this.getNeighborId("^"));
        let down = nodeMap.get(this.getNeighborId("v"));
        let right = nodeMap.get(this.getNeighborId("<"));
        let left = nodeMap.get(this.getNeighborId(">"));
        if (up) {
            res.push(up);
        }
        if (down) {
            res.push(down);
        }
        if (left) {
            res.push(left);
        }
        if (right) {
            res.push(right);
        }
        return res;
    }
}

function getNodes(lines: string[]): Map<string, Node> {
    let nodes = new Map<string, Node>();
    for(let i = 0; i < lines.length; i++) {
        for(let j = 0; j < lines[0].length; j++) {
            let item = lines[i][j];
            if (item == '#') {
                continue;
            }

            let isStart = item === 'S';
            let isEnd = item === 'E';

            let node = new Node(j, i, isStart, isEnd);
            nodes.set(node.id, node);
        }
    }

    return nodes;
}
function findBestPaths(nodes: Map<string, Node>) : Path[] {
    let steps = 0;
    let start = Array.from(nodes.values()).filter(node => node.isStart)[0];
    let history = new Map<string, number>();
    let end = Array.from(nodes.values()).filter(node => node.isEnd)[0];
    let bestPaths : Path[] = [];
    traverseMin(">", start.id, nodes, history, steps, end.id, bestPaths, [start.id]);
    bestPaths = bestPaths.filter(path => path.steps === globalmin);
    return bestPaths;
}

function traverseMin(curDir: string, cur: string, nodes: Map<string, Node>, history: Map<string, number>, steps: number, end: string, bestPaths: Path[], currentPath: string[]): number {
    if (cur === end) {
        if (steps <= globalmin) {
            bestPaths.push({steps, path: currentPath});
            globalmin = steps;
        }
        return steps;
    }

    if (steps > globalmin) {
        return -1;
    }

    let node = nodes.get(cur);

    if (!node) {
        return -1;
    }

    if (history.has(cur + curDir)) {
        let oldSteps = history.get(cur + curDir);
        if (oldSteps && oldSteps < steps) {
            return -1;
        }
    }

    history.set(cur + curDir, steps);

    let nextDirs = dirs.get(curDir);
    if (!nextDirs) {
        return 0;
    }
    let res = -1;
    for(let dir of nextDirs) {
        let nextNode = node.getNeighborId(dir);
        if (nodes.has(nextNode)) {
            let nextSteps = steps + calculateSteps(curDir, dir);
            let tempRes = traverseMin(dir, nextNode, nodes, history, nextSteps, end, bestPaths, [...currentPath, nextNode]);
            if (tempRes !== -1) {
                res = res === -1 ? tempRes : Math.min(res, tempRes);
            }
        }
    }

    return res;
}

function calculateSteps(curDir: string, dir: string) {
    if (curDir == dir) {
        return 1;
    } else {
        return 1001;
    }
 }

function getDirs(): Map<string, string[]> {
    let dirs = new Map<string, string[]>();
    dirs.set("^", ["^",">","<"]);
    dirs.set("v", ["v",">","<"]);
    dirs.set(">", [">","^","v"]);
    dirs.set("<", ["<","^","v"]);
   return dirs;
}
function drawMap(nodes: Map<string, Node>, fields: string[], height: number, width: number) : string {
    let str = "";
    for(let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let id = i + "|" + j;
            let node = nodes.get(id);
            let bestPath = fields.filter(field => field === id).length;

            if (!node) {
                str += "#";
            } else if (bestPath) {
                str+= "X";
            } else {
                str += ".";
            }
        }
        str+="</br>";
    }

    return str;
}

