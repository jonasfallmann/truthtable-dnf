import { Assignment } from "./Assignment";
import { Literal } from "./Literal";

export class Clause{
    constructor(public literals: Literal[]){
        
    }

    public evaluate(assignments: Assignment[]): boolean{
        var ret = false;
        this.literals.forEach(l => {
            var assignment = assignments.find(x => x.name == l.name);
            if(assignment){
                if((assignment.assignment && !l.negated) || (!assignment.assignment && l.negated)){
                    ret = true;
                }
            }
        });

        return ret;
    }
}