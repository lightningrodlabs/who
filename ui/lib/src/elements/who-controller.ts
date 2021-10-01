import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";

import { contextProvided } from "@lit-labs/context";
import { StoreSubscriber } from "lit-svelte-stores";
import { Unsubscriber } from "svelte/store";

import { sharedStyles } from "../sharedStyles";
import { whoContext, Dictionary, Signal } from "../types";
import { WhoStore } from "../who.store";
import { lightTheme, SlAvatar } from '@scoped-elements/shoelace';
import { ScopedElementsMixin } from "@open-wc/scoped-elements";
import {
  IconButton,
  Button,
} from "@scoped-elements/material-web";
import {
  profilesStoreContext,
  ProfilesStore,
  Profile,
} from "@holochain-open-dev/profiles";

/**
 * @element who-controller
 */
export class WhoController extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
  }

  /** Public attributes */

  /** Dependencies */

  @contextProvided({ context: whoContext })
  _store!: WhoStore;

  @contextProvided({ context: profilesStoreContext })
  _profiles!: ProfilesStore;

  _myProfile = new StoreSubscriber(this, () => this._profiles.myProfile);
  _knownProfiles = new StoreSubscriber(this, () => this._profiles.knownProfiles);

  /** Private properties */

  @state() _myAvatar = "https://i.imgur.com/oIrcAO8.jpg";

  private initialized = false;
  private initializing = false;

  get myNickName(): string {
    return this._myProfile.value.nickname;
  }
  get myAvatar(): string {
    return this._myProfile.value.fields.avatar;
  }
  firstUpdated() {
    let unsubscribe: Unsubscriber;
    unsubscribe = this._profiles.myProfile.subscribe((profile) => {
      if (profile) {
        this._myAvatar = `https://robohash.org/${profile.nickname}`
        this.checkInit().then(() => {});
      }
      // unsubscribe()
    });
  }

  async checkInit() {
    if (!this.initialized && !this.initializing) {
      this.initializing = true  // because checkInit gets call whenever profiles changes...
      this.initializing = false
    }
    this.initialized = true;
  }

  async refresh() {
    await this._profiles.fetchAllProfiles()
  }


  render() {

    /** Build agent list */
    const folks = Object.entries(this._knownProfiles.value).map(([key, profile])=>{
      return html`
        <li class="folk">
            <sl-avatar .image=${profile.fields.avatar}></sl-avatar>
            <div>${profile.nickname}</div>
        </li>`
    })

    return html`
<div style="width: 100%;margin-bottom: 5px">
  <mwc-button icon="refresh" @click=${() => this.refresh()}>Refresh</mwc-button>

  <div class="folks">
  ${folks}
  </div>
</div>
`;
  }

  static get scopedElements() {
    return {
      "mwc-icon-button": IconButton,
      "mwc-button": Button,
      'sl-avatar': SlAvatar,
    };
  }

  static get styles() {
    return [
      lightTheme,
      sharedStyles,
      css`
        :host {
          margin: 10px;
        }


        .folks {
          float:right;
        }
        .folk {
          list-style: none;
          display: inline-block;
          margin: 2px;
          text-align: center;
          font-size: 70%;
        }
        .folk > img {
         width: 50px;
         border-radius: 10000px;
        }

        @media (min-width: 640px) {
          main {
            max-width: none;
          }
        }
      `,
    ];
  }
}
