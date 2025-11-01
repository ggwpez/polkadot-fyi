# Polkadot FYI

 Short form wiki to explain abbreviations used in the Polkadot ecosystem.

## Storage

The wiki articles are stored in a smart contract on the Paseo Asset Hub testnet. It is deployed at address [`0x3DCd..`](https://blockscout-passet-hub.parity-testnet.parity.io/address/0x3DCd0E5c92b928587AdfA2a7117389CBa722FCDa?tab=contract). This is barely a front-end; the data storage itself is permissionless and resilient.

You can find the solidity code in [contract.sol](contract.sol).

 ## Development

 ```bash
 just && just dev
 ```

 Then open [http://localhost:4000](http://localhost:4000) in your browser.
