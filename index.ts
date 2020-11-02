import { count } from "console";
import fs from "fs";
import { Assignment } from "./Assignment";
import { Clause } from "./Clause";
import { Literal } from "./Literal";

fs.readFile("input.limboole", (err, data) => {
    let input = data.toString().trim();

    let lines = input.split("\n");
    console.log(lines.length);

    var clauses: Clause[] = [];
    var variables = new Set<string>();

    lines.forEach(line => {
        line = line.replace(/(\(|\)|&| )/g, "");
        var literalStrings = line.split("|");
        var literals = literalStrings.map(x => new Literal(x.charAt(x.length - 1), x.charAt(0) == "!"));
        literals.forEach(l => variables.add(l.name));
        clauses.push(new Clause(literals));
    })


    let assignmentAmount = Math.pow(2, variables.size);
    var spacing = "";
    for (let i = 0; i < variables.size; i++) {
        spacing += "0";
    }
    console.log("There are " + assignmentAmount + " number of  assignments");



    let fixedVars: string[] = [];
    variables.forEach(v => fixedVars.push(v));
    fixedVars.sort(function (a, b) {
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
    });

    var header = "";
    fixedVars.forEach(v => header += `${v}`)
    header += "||";
    console.log(header);

    let models: Assignment[][] = [];
    let countermodels: Assignment[][] = [];

    for (let i = 0; i < assignmentAmount; i++) {
        var binary = i.toString(2);

        binary = spacing.substr(binary.length) + binary;
        let assignments: Assignment[] = [];
        for (let j = 0; j < binary.length; j++) {
            assignments.push(new Assignment(fixedVars[j], binary.charAt(j) == "1"));
        }

        var result = true;
        for (let k = 0; k < clauses.length && result; k++) {
            result = clauses[k].evaluate(assignments);
        }
        if (result) {
            models.push(assignments);
        }
        else {
            countermodels.push(assignments);
        }
        console.log(`${binary}||${result ? "1" : "0"}`);

    }

    console.log(`Found ${models.length} models`);

    console.log("Representation in DNF:")
    let complDNF = "";
    models.forEach(a => {
        var astr = "(";
        a.forEach(ass => {
            astr += (ass.assignment ? ass.name : `!${ass.name}`) + " & ";
        })
        astr = astr.substr(0, astr.length - 2);
        astr += ") | ";
        complDNF += astr;
    })
    complDNF = complDNF.substr(0, complDNF.length - 2);
    console.log(complDNF);
    


})