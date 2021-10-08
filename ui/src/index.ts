import { render, html, LitElement } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements";
import { property } from "lit/decorators.js";
import { ContextProvider } from "@lit-labs/context";
import { HolochainClient } from "@holochain-open-dev/cell-client";
import {
  ProfilesStore,
  profilesStoreContext,
  ListProfiles,
  ProfilePrompt,
} from "@holochain-open-dev/profiles";
import { AppWebsocket, InstalledCell } from "@holochain/conductor-api";

export default function (appWebsocket: AppWebsocket, cellData: InstalledCell) {
  const client = new HolochainClient(appWebsocket, cellData);
  const store = new ProfilesStore(client);

  return {
    full(element: HTMLElement, registry: CustomElementRegistry) {
      registry.define("who-app", Who);
      render(html`<who-app .store=${store}></who-app>`, element);
    },
    blocks: [],
  };
}

class Who extends ScopedElementsMixin(LitElement) {
  @property()
  store!: ProfilesStore;

  firstUpdated() {
    new ContextProvider(this, profilesStoreContext, this.store);
  }

  render() {
    return html`
      <profile-prompt>
        <list-profiles> </list-profiles>
      </profile-prompt>
    `;
  }

  static get scopedElements() {
    return {
      "list-profiles": ListProfiles,
      "profile-prompt": ProfilePrompt,
    };
  }
}
