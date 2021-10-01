import { Orchestrator, Config, InstallAgentsHapps } from '@holochain/tryorama'
import path from 'path'
import * as _ from 'lodash'
import { RETRY_DELAY, RETRY_COUNT, localConductorConfig, networkedConductorConfig, installAgents, awaitIntegration, delay } from './common'
import { Base64 } from "js-base64";

function serializeHash(hash: Uint8Array): string {
  return `u${Base64.fromUint8Array(hash, true)}`;
}
export default async (orchestrator) => {

  orchestrator.registerScenario('who basic tests', async (s, t) => {
    // Declare two players using the previously specified config, nicknaming them "alice" and "bob"
    // note that the first argument to players is just an array conductor configs that that will
    // be used to spin up the conductor processes which are returned in a matching array.
    const [a_and_b_conductor] = await s.players([localConductorConfig])

    a_and_b_conductor.setSignalHandler((signal) => {
      console.log("Received Signal:",signal)
      t.deepEqual(signal.data.payload.message, { type: 'Placeholder', content: {foo: 'bar'} })
    })

    // install your happs into the conductors and destructuring the returned happ data using the same
    // array structure as you created in your installation array.
    let [alice_who_happ/*, bobbo_who_happ*/] = await installAgents(a_and_b_conductor, ["alice"/*, 'bobbo'*/])
    const [alice_who] = alice_who_happ.cells
//    const [bobbo_who] = bobbo_who_happ.cells
  })
}
