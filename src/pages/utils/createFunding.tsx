// import { useContext } from "react"
// import pgfAbi from "../../../subgraph/abis/PGFFactory.json"
// import { ethers } from "ethers-old"
// import { FeeQuote, IWalletTransaction } from "@biconomy/core-types"
// import { CreateFundingInterface, TransactionInterface } from "./interfaces"
// import { parseBytes32String } from "ethers/lib/utils"
// import { makeRoot } from "./merkleTree"
// export default async function CreateFunding(params: CreateFundingInterface) {
//     const {
//         totalFunding: _totalFunding,
//         withdrawalFee:_withdrawalFee,
//         isGroupWithdrawal:_isGroupWithdrawal,
//         tokenUri:_tokenUri,
//         startTimestamp:_startTimestamp,
//         vestingPeriodInSeconds:_vestingPeriodInSeconds,
//         merkleRoot:_merkleRoot,
//         smartAccount,
//         account,
//         provider,
//     } = params
//     console.log(" minting")
//     console.log(params)

//     if (smartAccount) {
//         try {
//             const tree = makeRoot([
//                 "0xB721347D2938a5594a12DF5Cc36D598b839Cb98f",
//                 "0xcB399226a65DF8964482daA5B1CB98478493CC4d",
//             ])
//             console.log(tree.root);
            
//             const abi = pgfAbi
//             console.log("Setting Interface")
//             const pgfFactoryInterface = new ethers.utils.Interface(pgfAbi)
//             console.log("interface set")
//             const args = [
//                 _totalFunding,
//                 _withdrawalFee,
//                 _isGroupWithdrawal,
//                 _tokenUri,
//                 _startTimestamp,
//                 _vestingPeriodInSeconds,
//                 tree.root,
//             ]
//             console.log(args);
            
//             // const data = pgfFactoryInterface.functions.createFunding(args)
//             const data = pgfFactoryInterface.encodeFunctionData(
//                 "createFunding",
//                 args
//             )
//             console.log("Data encoded");
            
//             // const signer = provider.getSigner()
//             const contractAddress = "0xB27A68ced8700afB41d4777753fac65867deED48"
//             console.log(contractAddress);
            

//             const tx1: TransactionInterface = {
//                 to: contractAddress,
//                 data: data,
//                 value: ethers.utils.parseEther("0.0001"),
//             }
//             console.log(tx1);
            
//             const txs: TransactionInterface[] = []
//             txs.push(tx1)
//             const feeQuotes: FeeQuote[] =
//                 await smartAccount.prepareRefundTransactionBatch({
//                     transactions: txs,
//                 })
                
//             console.log(feeQuotes)
//             const transaction: IWalletTransaction =
//                 await smartAccount.createRefundTransactionBatch({
//                     transactions: txs,
//                     feeQuote: feeQuotes[0],
//                 })
//             console.log(transaction);
            
//             let gasLimit = {
//                 hex: "0x1E8480",
//                 type: "hex",
//             }

//             smartAccount.on("txHashGenerated", (res) => {
//                 console.log("Generated txHash:- ")
//                 console.log(res.hash)
//             })

//             smartAccount.on("txMined", (res) => {
//                 console.log("Tx Mined:- ")
//                 console.log(res.hash)
//                 // setTxHash(res.hash)
//                 console.log(res)
//                 const events = res.receipt.logs.map((log) => {
//                     // if (log.topics[0] === createEventTopic) {
//                     // 	address = splitInterface.decodeEventLog("CreateSplit",log.data,log.topics)
//                     // }

//                     try {
//                         const event = pgfFactoryInterface.decodeEventLog(
//                             "FundingCreated",
//                             log.data,
//                             log.topics
//                         )
//                         return event
//                     } catch (error) {
//                         return
//                     }
//                     return
//                 })
//                 console.log(events)
//                 let funding
//                 events.forEach((e) => {
//                     if (e !== undefined) {
//                         // setZoraDropCreated(true)
//                         funding = e
//                         // console.log(zoraDrop)

//                         // setZoraDropAddress(e.editionContractAddress)
//                         // setModalTitle("NFT DROP Created!")
//                         // setModalBody(
//                         // `Your NFT has been minted in the address ${e.editionContractAddress}.`,
//                         // )
//                     }
//                 })
//                 console.log(funding)
//                 // console.log(zoraDrop._tokenId)
//             })

//             const txHash = await smartAccount.sendTransaction({
//                 tx: transaction,
//                 // gasLimit,
//             })
//         } catch (error) {
//             console.log(error)
//         }
//     } else {
//         console.log("Connect wallet");
        
//     }
// }
