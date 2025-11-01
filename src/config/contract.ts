// Entry Registry contract ABI
export const entryRegistryABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_abbreviation",
        type: "string"
      },
      {
        internalType: "string",
        name: "_title",
        type: "string"
      },
      {
        internalType: "string",
        name: "_description",
        type: "string"
      }
    ],
    name: "addEntry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getAllAbbreviations",
    outputs: [
      {
        internalType: "string[]",
        name: "",
        type: "string[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_abbreviation",
        type: "string"
      }
    ],
    name: "getEntry",
    outputs: [
      {
        internalType: "string",
        name: "title",
        type: "string"
      },
      {
        internalType: "string",
        name: "description",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_abbreviation",
        type: "string"
      }
    ],
    name: "entryExists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

// Contract address
export const CONTRACT_ADDRESS = "0x3DCd0E5c92b928587AdfA2a7117389CBa722FCDa";

// Paseo Asset Hub network configuration
export const PASEO_ASSET_HUB = {
  chainId: "0x190f1b46", // 420420422 in hex
  chainName: "Paseo Asset Hub",
  nativeCurrency: {
    name: "PAS",
    symbol: "PAS",
    decimals: 18,
  },
  rpcUrls: ["https://testnet-passet-hub-eth-rpc.polkadot.io"],
  blockExplorerUrls: [
    "https://blockscout-passet-hub.parity-testnet.parity.io/",
  ],
};
