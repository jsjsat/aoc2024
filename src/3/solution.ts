import { Solution } from "../solution"
import { readFileSync } from 'fs';

export const solution3 : Solution = {
    compute(): string {
        return "1:" + this.compute1() + "\n" + "2:" + this.compute2();
    },
    
    compute1() {
        const file = readFileSync('./src/3/input.txt', 'utf-8');
        const test = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";
        const regex = RegExp("mul\\\(\(\\d\{1,3}\),\(\\d\{1,3}\)\\\)","g");
        let result = 0;
        let matches = file.matchAll(regex);
        if (matches) {
            for(const match of matches) {
                let a = match.at(1)
                let b = match.at(2);
                if (a && b) {
                    result += (+a) * (+b);
                }
            }
        }
        
        return "" + result;

    },

    compute2() {
        const file = readFileSync('./src/3/input.txt', 'utf-8');
        const test = "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";
        const regex = RegExp("\(mul\\\(\(\\d\{1,3}\),\(\\d\{1,3}\)\\\)\)\|do\\\(\\\)\|don\\'t\\\(\\\)","g");
        let result = 0;
        let enabled = true;
        let matches = file.matchAll(regex);
        if (matches) {
            for(const match of matches) {
                if (match[0] === "don't()") {
                    enabled = false;
                    continue;
                }
                
                if (match[0] === "do()") {
                    enabled = true;
                    continue;
                }
                let a = match.at(2)
                let b = match.at(3);
                if (a && b && enabled) {
                    result += (+a) * (+b);
                }
            }
        }
        return "" + result;
    },
}

