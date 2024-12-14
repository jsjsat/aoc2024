import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution5 : Solution = {
    compute(): string {
        return "1:" + this.compute1() + "\n" + "2:" + this.compute2();
    },
    
    compute1() {
        const file = readFileSync('./src/5/input.txt', 'utf-8');
        let result = 0;
        let input = file.split("\n\n");
        let rulesstr = input[0];
        let rules = rulesstr.split("\n");
        let ruleMap = buildRuleMap(rules);

        let reportArr = input[1].split("\n").slice(0, -1);
        let reports = reportArr.map(report => report.split(","));
        result = reports.filter(report => isValid(report, ruleMap))
                        .map(report => getMiddleItem(report))
                        .reduce((sum, current) => sum + current, 0);
        return "" + result;

    },

    compute2() {
        const file = readFileSync('./src/5/input.txt', 'utf-8');
        let result = 0;
        let input = file.split("\n\n");
        let rulesstr = input[0];
        let rules = rulesstr.split("\n");
        let ruleMap = buildRuleMap(rules);

        let reportArr = input[1].split("\n").slice(0, -1);
        let reports = reportArr.map(report => report.split(","));
        result = reports.filter(report => !isValid(report, ruleMap))
                        .map(report => correctReport(report, ruleMap))
                        .map(report => getMiddleItem(report))
                        .reduce((sum, current) => sum + current, 0);
        return "" + result;
    },
}

function buildRuleMap(rules: string[]): Map<string, string[]> {
    let ruleMap = new Map<string, string[]>();
    for(let rule of rules) {
        let ruleArr = rule.split("|");
        let pre = ruleArr[0];
        let post = ruleArr[1];
        let preArr = ruleMap.get(pre);
        if(!preArr) {
            preArr = [];
        }
        preArr.push(post);
        ruleMap.set(pre, preArr);
    }
    
    return ruleMap;
}
function isValid(report: string[], ruleMap: Map<string, string[]>): boolean {
    let cur :string[] = [];
    for(let item of report) {
        let post = ruleMap.get(item);
        if (post) {
            var intersection = post.filter(value => cur.includes(value));
            if (intersection.length > 0) {
                return false;
            }
        }
        cur.push(item);
    }
    return true;
}

function getMiddleItem(report: string[]): number {
    return +report[Math.floor(report.length / 2)];
}

function correctReport(report: string[], ruleMap: Map<string, string[]>): string[] {
    return   report.sort((a, b) => {
        let mapA = ruleMap.get(a);
        let mapB = ruleMap.get(b);
        if (mapA?.includes(b)) {
            return -1;
        }

        if (mapB?.includes(a)) {
            return 1;
        }

        return 0;
    });
}

