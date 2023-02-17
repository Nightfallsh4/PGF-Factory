const { network, ethers } = require("hardhat")
const { developmentChains, makeRoot } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments

    const totalFunding = ethers.utils.parseEther("1")
    const withdrawalFee = 1000
    const groupWithdrawal = true
    const tokenUri = "https://funding-contract.com"
    const startTimeStamp = Math.floor(Date.now() / 1000)
    const [funder0, funder1, funder2, funder3, funder4, funder5, funder6] =
        await ethers.getSigners()

    const addresses = [
        funder0.address,
        funder1.address,
        funder2.address,
        funder3.address,
        funder4.address,
        funder5.address,
        funder6.address,
    ]
    const merkleTree = makeRoot(addresses)

    const vestingPeriodInSeconds = 7890000 //3 Months
    const args = [
        totalFunding,
        withdrawalFee,
        groupWithdrawal,
        tokenUri,
        startTimeStamp,
        vestingPeriodInSeconds,
        merkleTree.root,
    ]

    log("-------------------------")

    const fundingContract = await deploy("FundingContract", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("Funding Contract Deployed At: ", fundingContract.address)

    log("-----------------------------")
}

module.exports.tags = ["FundingContract", "all"]
