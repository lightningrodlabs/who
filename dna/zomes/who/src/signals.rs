use hdk::prelude::*;

use holo_hash::{EntryHashB64, AgentPubKeyB64};

#[derive(Serialize, Deserialize, SerializedBytes, Debug)]
    #[serde(tag = "type", content = "content")]
pub enum Message {
    Placeholder
}

#[derive(Serialize, Deserialize, Debug)]
    #[serde(rename_all = "camelCase")]
pub struct SignalPayload {
    space_hash: EntryHashB64,
    message: Message,
}

impl SignalPayload {
   pub fn new(space_hash: EntryHashB64, message: Message) -> Self {
        SignalPayload {
            space_hash,
            message,
        }
    }
}

#[hdk_extern]
fn recv_remote_signal(signal: ExternIO) -> ExternResult<()> {
    let sig: SignalPayload = signal.decode()?;
    debug!("Received signal {:?}", sig);
    Ok(emit_signal(&sig)?)
}

/// Input to the notify call
#[derive(Serialize, Deserialize, SerializedBytes, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NotifyInput {
    pub folks: Vec<AgentPubKeyB64>,
    pub signal: SignalPayload,
}


#[hdk_extern]
fn notify(input: NotifyInput) -> ExternResult<()> {
    let mut folks : Vec<AgentPubKey> = vec![];
    for a in input.folks.clone() {
        folks.push(a.into())
    }
    debug!("Sending signal {:?} to {:?}", input.signal, input.folks);
    remote_signal(ExternIO::encode(input.signal)?,folks)?;
    Ok(())
}
