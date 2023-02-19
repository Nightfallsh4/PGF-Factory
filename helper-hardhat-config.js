const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

const developmentChains = ["hardhat", "localhost"]

const networkConfig = {
    31337: {
        name: "hardhat",
    },
}

function makeRoot(allowList) {
    const _leaves = allowList.map((x) => keccak256(x))
    // Safe this tree along with other metadata in IPFS
    const tree = new MerkleTree(_leaves, keccak256, { sortPairs: true })
    const _root = tree.getHexRoot()
    // console.log(_root)
    const returnValue = { tree: tree, root: _root }
    return returnValue
}

module.exports = {
    networkConfig,
    developmentChains,
    makeRoot,
}
