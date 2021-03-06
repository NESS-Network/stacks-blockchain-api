import { Transaction } from '../p2p/tx';
import { ClarityAbi } from './contract-abi';

export enum CoreNodeEventType {
  ContractEvent = 'contract_event',
  StxTransferEvent = 'stx_transfer_event',
  StxMintEvent = 'stx_mint_event',
  StxBurnEvent = 'stx_burn_event',
  StxLockEvent = 'stx_lock_event',
  NftTransferEvent = 'nft_transfer_event',
  NftMintEvent = 'nft_mint_event',
  FtTransferEvent = 'ft_transfer_event',
  FtMintEvent = 'ft_mint_event',
}

// TODO: core-node should use a better encoding for this structure;
export type NonStandardClarityValue = unknown;

export interface CoreNodeEventBase {
  /** 0x-prefix transaction hash. */
  txid: string;
  event_index: number;
}

export interface SmartContractEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.ContractEvent;
  contract_event: {
    /** Fully qualified contract ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.kv-store" */
    contract_identifier: string;
    topic: string;
    value: NonStandardClarityValue;
    /** Hex encoded Clarity value. */
    raw_value: string;
  };
}

export interface StxTransferEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.StxTransferEvent;
  stx_transfer_event: {
    recipient: string;
    sender: string;
    amount: string;
  };
}

export interface StxMintEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.StxMintEvent;
  stx_mint_event: {
    recipient: string;
    amount: string;
  };
}

export interface StxBurnEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.StxBurnEvent;
  stx_burn_event: {
    sender: string;
    amount: string;
  };
}

export interface StxLockEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.StxLockEvent;
  /** TODO: what dis? */
  committed: boolean;
  stx_lock_event: {
    /** String quoted base10 integer. */
    locked_amount: string;
    /** String quoted base10 integer. */
    unlock_height: string;
    /** STX principal associated with the locked tokens. */
    locked_address: string;
  };
}

export interface NftTransferEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.NftTransferEvent;
  nft_transfer_event: {
    /** Fully qualified asset ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.contract-name.asset-name" */
    asset_identifier: string;
    recipient: string;
    sender: string;
    value: NonStandardClarityValue;
    /** Hex encoded Clarity value. */
    raw_value: string;
  };
}

export interface NftMintEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.NftMintEvent;
  nft_mint_event: {
    /** Fully qualified asset ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.contract-name.asset-name" */
    asset_identifier: string;
    recipient: string;
    value: NonStandardClarityValue;
    /** Hex encoded Clarity value. */
    raw_value: string;
  };
}

export interface FtTransferEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.FtTransferEvent;
  ft_transfer_event: {
    /** Fully qualified asset ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.contract-name.asset-name" */
    asset_identifier: string;
    recipient: string;
    sender: string;
    amount: string;
  };
}

export interface FtMintEvent extends CoreNodeEventBase {
  type: CoreNodeEventType.FtMintEvent;
  ft_mint_event: {
    /** Fully qualified asset ID, e.g. "ST2ZRX0K27GW0SP3GJCEMHD95TQGJMKB7G9Y0X1MH.contract-name.asset-name" */
    asset_identifier: string;
    recipient: string;
    amount: string;
  };
}

export type CoreNodeEvent =
  | SmartContractEvent
  | StxTransferEvent
  | StxMintEvent
  | StxBurnEvent
  | StxLockEvent
  | FtTransferEvent
  | FtMintEvent
  | NftTransferEvent
  | NftMintEvent;

export type CoreNodeTxStatus = 'success' | 'abort_by_response' | 'abort_by_post_condition';

export interface CoreNodeTxMessage {
  raw_tx: string;
  result: NonStandardClarityValue;
  status: CoreNodeTxStatus;
  raw_result: string;
  txid: string;
  tx_index: number;
  contract_abi: ClarityAbi | null;
}

export interface CoreNodeBlockMessage {
  block_hash: string;
  block_height: number;
  burn_block_time: number;
  burn_block_hash: string;
  burn_block_height: number;
  miner_txid: string;
  index_block_hash: string;
  parent_index_block_hash: string;
  parent_block_hash: string;
  parent_microblock: string;
  events: CoreNodeEvent[];
  transactions: CoreNodeTxMessage[];
  matured_miner_rewards: {
    from_index_consensus_hash: string;
    from_stacks_block_hash: string;
    /** STX principal */
    recipient: string;
    /** String quoted micro-STX amount. */
    coinbase_amount: string;
    /** String quoted micro-STX amount. */
    tx_fees_anchored: string;
    /** String quoted micro-STX amount. */
    tx_fees_streamed_confirmed: string;
    /** String quoted micro-STX amount. */
    tx_fees_streamed_produced: string;
  }[];
}

export interface CoreNodeMessageParsed extends CoreNodeBlockMessage {
  parsed_transactions: CoreNodeParsedTxMessage[];
}

export interface CoreNodeParsedTxMessage {
  core_tx: CoreNodeTxMessage;
  parsed_tx: Transaction;
  raw_tx: Buffer;
  nonce: number;
  sender_address: string;
  sponsor_address?: string;
  block_hash: string;
  index_block_hash: string;
  block_height: number;
  burn_block_time: number;
}

export interface CoreNodeBurnBlockMessage {
  burn_block_hash: string;
  burn_block_height: number;
  /** Amount in BTC satoshis. */
  burn_amount: number;
  reward_recipients: [
    {
      /** Bitcoin address (b58 encoded). */
      recipient: string;
      /** Amount in BTC satoshis. */
      amt: number;
    }
  ];
}

export type CoreNodeDropMempoolTxReasonType =
  | 'ReplaceByFee'
  | 'ReplaceAcrossFork'
  | 'TooExpensive'
  | 'StaleGarbageCollect';

export interface CoreNodeDropMempoolTxMessage {
  dropped_txids: string[];
  reason: CoreNodeDropMempoolTxReasonType;
}
