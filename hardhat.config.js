require("@nomicfoundation/hardhat-toolbox")
require("hardhat-deploy")
// require("solidity-coverage");
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-gas-reporter")
require("dotenv").config()
require("@openzeppelin/hardhat-upgrades")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.17",
                settings: { optimizer: { enabled: true, runs: 75 } },
            },
        ],
    },
    namedAccounts: {
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
        },
        player: {
            default: 1,
        },
    },
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        localhost: {
            chainId: 31337,
        },
        "mantle-testnet": {
            url: "https://rpc.testnet.mantle.xyz/",
            accounts: [process.env.PRIVATE_KEY], // Uses the private key from the .env file
        },
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
    },
    mocha: {
        timeout: 500000, //500s
    },

    // etherscan: {
    //   apiKey: {
    //     goerli: ETHERSCAN_API_KEY,
    //   },
    // },
}
