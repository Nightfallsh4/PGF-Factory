const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts()
  const { deploy, log } = deployments

  const totalFunding = ethers.utils.parseEther("1")
  const withdrawalFee = ethers.utils.parseEther("0.05")
  const groupWithdrawal = true
  const tokenUri = "https://funding-contract.com"
  const startTimeStamp = Math.floor(Date.now() / 1000)
  const vestingPeriodInSeconds = 7890000 //3 Months
  const args = [
    totalFunding,
    withdrawalFee,
    groupWithdrawal,
    tokenUri,
    startTimeStamp,
    vestingPeriodInSeconds,
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
