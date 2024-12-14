import { solution1 } from "./1/solution"
import { solution2 } from "./2/solution";
import { solution3 } from "./3/solution";
import { solution4 } from "./4/solution";
import { solution5 } from "./5/solution";
import { solution6 } from "./6/solution";
import { solution7 } from "./7/solution";
import { solution8 } from "./8/solution";
import { Solution } from "./solution";

export default function getSolution(id: string) : Solution | undefined {
    switch(id) {
        case "1": return solution1;
        case "2": return solution2;
        case "3": return solution3;
        case "4": return solution4;
        case "5": return solution5;
        case "6": return solution6;
        case "7": return solution7;
        case "8": return solution8;
        default: return undefined;
    }
}