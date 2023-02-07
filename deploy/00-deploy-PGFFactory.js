console.log("Starting deploy...")

const { upgrades, ethers } = require("hardhat")
// const ethers = require("ethers")
module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deployer } = await getNamedAccounts()
	const { deploy, log } = deployments
	console.log("Staring argument")
	const creationFee = ethers.utils.parseEther("0.0001")
	const payoutAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

	const args = [creationFee, payoutAddress]
	console.log("Getting contract")
	const implementContract = await ethers.getContractFactory("PGFFactory")
	log("-------------------------")

	const deployedProxy = await upgrades.deployProxy(implementContract, args, {
		kind: "uups",
	})
	await deployedProxy.deployed()
	log(deployedProxy.address)
	log("-------------------------")
}

module.exports.tags = ["PGFFactory", "all"]
