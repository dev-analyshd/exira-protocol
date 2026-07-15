import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x" + "0".repeat(64);
const X_LAYER_RPC = process.env.X_LAYER_RPC || "https://testrpc.xlayer.tech";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    "xlayer-testnet": {
      url: X_LAYER_RPC,
      chainId: 195,
      accounts: [PRIVATE_KEY],
      gasPrice: "auto",
    },
    "xlayer-mainnet": {
      url: "https://rpc.xlayer.tech",
      chainId: 196,
      accounts: [PRIVATE_KEY],
      gasPrice: "auto",
    },
  },
  etherscan: {
    apiKey: {
      "xlayer-testnet": process.env.OKLINK_API_KEY || "",
      "xlayer-mainnet": process.env.OKLINK_API_KEY || "",
    },
    customChains: [
      {
        network: "xlayer-testnet",
        chainId: 195,
        urls: {
          apiURL: "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER_TEST",
          browserURL: "https://www.oklink.com/xlayer-test",
        },
      },
      {
        network: "xlayer-mainnet",
        chainId: 196,
        urls: {
          apiURL: "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER",
          browserURL: "https://www.oklink.com/xlayer",
        },
      },
    ],
  },
  paths: {
    sources: "./",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
