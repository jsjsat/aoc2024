import { solution1 } from "./1/solution"
import { solution2 } from "./2/solution";
import { Solution } from "./solution";

export default function getSolution(id: string) : Solution | undefined {
    switch(id) {
        case "1": return solution1;
        case "2": return solution2;
        default: return undefined;
    }
}