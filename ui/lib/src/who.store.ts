import { EntryHashB64, HeaderHashB64, AgentPubKeyB64, serializeHash } from '@holochain-open-dev/core-types';
import { CellClient } from '@holochain-open-dev/cell-client';
import { writable, Writable, derived, Readable, get } from 'svelte/store';

import { WhoService, } from './who.service';
import {
  Dictionary,
} from './types';
import {
  ProfilesStore,
} from "@holochain-open-dev/profiles";

const areEqual = (first: Uint8Array, second: Uint8Array) =>
      first.length === second.length && first.every((value, index) => value === second[index]);

export class WhoStore {
  /** Private */
  private service : WhoService
  private profiles: ProfilesStore

  /** Static info */
  myAgentPubKey: AgentPubKeyB64;

  /** Readable stores */
  //public spaces: Readable<Dictionary<Space>> = derived(this.spacesStore, i => i)

  constructor(
    protected cellClient: CellClient,
    profilesStore: ProfilesStore,
    zomeName = 'hc_zome_who'
  ) {
    this.myAgentPubKey = serializeHash(cellClient.cellId[1]);
    this.profiles = profilesStore;
    this.service = new WhoService(cellClient, zomeName);

    cellClient.addSignalHandler( signal => {
      if (! areEqual(cellClient.cellId[0],signal.data.cellId[0]) || !areEqual(cellClient.cellId[1], signal.data.cellId[1])) {
        return
      }
      console.log("SIGNAL",signal)
      const payload = signal.data.payload
      switch(payload.message.type) {
      case "Placeholder":
        break;
      }
    })

  }

  private others(): Array<AgentPubKeyB64> {
    return Object.keys(get(this.profiles.knownProfiles)).filter((key)=> key != this.myAgentPubKey)
  }

}
