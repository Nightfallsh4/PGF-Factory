import MerkleTree from "merkletreejs"

export interface MerkleTreeReturn {
    tree: MerkleTree
    root: string
}

export interface CreateFundingInterface {
    totalFunding: number
    withdrawalFee: number
    isGroupWithdrawal: boolean
    tokenUri: string
    startTimestamp: number
    vestingPeriodInSeconds: number
    merkleRoot: string
}

export interface CustomFundingButtonInterface extends CreateFundingInterface {
    title:string,
    styles:string,
    whitlelisted:string[],
}
