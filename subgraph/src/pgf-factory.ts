import { FundingCreated as FundingCreatedEvent } from "../generated/PGFFactory/PGFFactory"
import { Transfer as TransferEvent, FundingContract, FundsDeposited as FundsDepositedEvent, Transfer } from "../generated/PGFFactory/FundingContract";
import { Token, Funding, User } from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts";
import { FundingContract as FundingContractDataSource } from "../generated/templates";

export function handleFundingCreated(event: FundingCreatedEvent): void {
    let entity = new Funding(event.params.contractAddress.toHexString())
    entity.address = event.params.contractAddress
    entity.creator = event.transaction.from
    entity.admin = event.transaction.from
    entity.createdAt = event.block.timestamp
    entity.totalAmountRequested = event.params.totalFunding
    // entity.totalAmountFunded = 
    entity.withdrawalFee = event.params.withdrawalFee
    entity.vestingPeriod = event.params.vestingPeriod
    const contract = FundingContract.bind(event.params.contractAddress)
    entity.isGroupWihtdrawal = contract.getIsGroupWithdrawal()
    entity.uri = contract.tokenURI(BigInt.fromString("1"))
    entity.root = contract.getMerkleRoot().toHexString()
    entity.contractorAddress = contract.getPayoutAddress()
    entity.save()
    FundingContractDataSource.create(event.params.contractAddress)
}

export function handleDeposit(event: FundsDepositedEvent): void {
    let entity = Funding.load(event.address.toHexString())
    if (entity) {
      const contract = FundingContract.bind(event.address)
      entity.totalAmountFunded = contract.s_totalFundedAmount()
      entity.save()
    }
    let entity2 = Token.load(event.address.toHexString() + "-" + event.params.tokenId.toHexString())
    if (!entity2) {
      entity2 = new Token(event.address.toHexString() + "-" + event.params.tokenId.toHexString())
      entity2.address = event.address
      entity2.collection = event.address.toHexString()
      entity2.tokenId = event.params.tokenId
      entity2.amount = event.params.amount
      entity2.owner = event.params.funder.toHexString()
      entity2.save()
    }
    let entity3 = User.load(event.params.funder.toHexString())
    if (!entity3) {
      entity3 = new User(event.params.funder.toHexString())
      entity3.save()
    }
}

// export function handleUpgraded(event: Transfer): void {
//     let entity = new Upgraded(
//         event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//     )
//     entity.implementation = event.params.implementation
//     entity.save()
// }
