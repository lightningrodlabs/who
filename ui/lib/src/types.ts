// TODO: add globally available interfaces for your elements

import { AgentPubKeyB64, HeaderHashB64, EntryHashB64 } from "@holochain-open-dev/core-types";
import { createContext, Context } from "@lit-labs/context";
import { WhoStore } from "./who.store";

export const whoContext : Context<WhoStore> = createContext('hc_zome_who/service');

export type Dictionary<T> = { [key: string]: T };



export type Signal =
  | {
    spaceHash: EntryHashB64, message: {type: "placeholder", content:  {}}
  }
