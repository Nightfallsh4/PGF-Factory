const { assert, expect } = require("chai")
const { network, ethers, deployments, upgrades } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
// const { time } = require("@nomicfoundation/hardhat-network-helpers")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("PGFFactoryContract Unit Tests", () => {
          let pgfFactory
          let deployer, creator

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              //   console.log(deployer)
              creator = accounts[1]
              const creationFee = ethers.utils.parseEther("0.0001")
              const payoutAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

              const args = [creationFee, payoutAddress]

              const implementContract = await ethers.getContractFactory(
                  "PGFFactory"
              )

              pgfFactory = await upgrades.deployProxy(implementContract, args, {
                  kind: "uups",
              })
              await pgfFactory.deployed()
              console.log("Contract starts here.........")
              //   console.log(pgfFactory)
          })

          describe("initialised correctly", () => {
              it("creation fee set correctly", async () => {
                  const creationFee = await pgfFactory.s_creationFee()
                  assert.equal(
                      creationFee.toString(),
                      ethers.utils.parseEther("0.0001").toString()
                  )
              })
              it("payoutAddress set correctly", async () => {
                  const payoutAddress = await pgfFactory.s_payoutAddress()
                  assert.equal(
                      payoutAddress,
                      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                  )
              })
              it("Funding ID set correctly", async () => {
                  const fundingId = await pgfFactory.s_fundingId()
                  assert.equal(fundingId.toString(), "0")
              })
              it("Default Admin Role granted correctly", async () => {
                  const role = ethers.utils.hexZeroPad( ethers.utils.hexlify(0),32)
                  const isRole = await pgfFactory.hasRole(role, deployer.address)
                  assert.equal(isRole, true)
              })
          })

          describe("createFunding tests", () => {
            beforeEach(async () => {
                const totalFunding = ethers.utils.parseEther("1")
                const withdrawalFee = 10
                const isGroupWithdrawal = false
                const tokenUri = "https://github.com/nightfallsh4"
                const startTimestamp = Date.now() + 10000
                const vestingPeriodInSeconds = 60 * 60 * 2
            })
            it("reverts if ether sent less than creationFee",  async () => {
                
                await expect(pgfFactory.createFunding())
            })
          })
      })
