import { Orchestrator } from "@holochain/tryorama";
import who from "./who";

let orchestrator = new Orchestrator();
who(orchestrator);
orchestrator.run();
/*
orchestrator = new Orchestrator()
require('./profile')(orchestrator)
orchestrator.run()
*/
