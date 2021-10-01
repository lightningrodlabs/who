use hdk::prelude::*;
use std::convert::Infallible;
use hc_utils::UtilsError;

#[derive(thiserror::Error, Debug)]
pub enum WhoError {
    #[error(transparent)]
    Serialization(#[from] SerializedBytesError),
    #[error(transparent)]
    Infallible(#[from] Infallible),
    #[error(transparent)]
    EntryError(#[from] EntryError),
    #[error("Failed to convert an agent link tag to an agent pub key")]
    AgentTag,
    #[error(transparent)]
    Wasm(#[from] WasmError),
    #[error(transparent)]
    Timestamp(#[from] TimestampError),
    #[error(transparent)]
    UtilsError(#[from] UtilsError),
}

pub type WhoResult<T> = Result<T, WhoError>;

impl From<WhoError> for WasmError {
    fn from(c: WhoError) -> Self {
        WasmError::Guest(c.to_string())
    }
}
