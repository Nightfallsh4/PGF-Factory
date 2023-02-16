import keccak256 from "keccak256"
import MerkleTree from "merkletreejs"
import { MerkleTreeReturn } from "./interfaces"
export function makeRoot(allowList:string[]): MerkleTreeReturn {
    const _leaves = allowList.map((x) => keccak256(x))
    // Safe this tree along with other metadata in IPFS
    const tree = new MerkleTree(_leaves, keccak256, { sortPairs: true })
    const _root = tree.getHexRoot()
    console.log(_root)
    const returnValue:MerkleTreeReturn = {tree:tree, root:_root}
    return returnValue
}