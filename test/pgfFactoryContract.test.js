const { assert, expect } = require("chai")
const { network, ethers, deployments, upgrades } = require("hardhat")
const { developmentChains, makeRoot } = require("../helper-hardhat-config")
// const { time } = require("@nomicfoundation/hardhat-network-helpers")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("PGFFactoryContract Unit Tests", () => {
          let pgfFactory
          let deployer, creator, root

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
              //   console.log("Contract starts here.........")
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
                  const role = ethers.utils.hexZeroPad(
                      ethers.utils.hexlify(0),
                      32
                  )
                  const isRole = await pgfFactory.hasRole(
                      role,
                      deployer.address
                  )
                  assert.equal(isRole, true)
              })
          })

          describe("createFunding tests", () => {
              beforeEach(async () => {
                  const [
                      funder0,
                      funder1,
                      funder2,
                      funder3,
                      funder4,
                      funder5,
                      funder6,
                  ] = await ethers.getSigners()

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
                  root = merkleTree.root
              })
              it("reverts if ether sent less than creationFee", async () => {
                  const totalFunding = ethers.utils.parseEther("1")
                  const withdrawalFee = 1000
                  const isGroupWithdrawal = false
                  const tokenUri = "https://github.com/nightfallsh4"
                  const startTimestamp = Date.now() + 10000
                  const vestingPeriodInSeconds = 60 * 60 * 2
                  await expect(
                      pgfFactory.createFunding(
                          totalFunding,
                          withdrawalFee,
                          isGroupWithdrawal,
                          tokenUri,
                          startTimestamp,
                          vestingPeriodInSeconds,
                          root
                      )
                  ).to.be.rejectedWith(
                      "Ether sent should be equal or more than creation fees"
                  )
              })

              it("funding Id to address is set correctly", async () => {
                  const creationFee = ethers.utils.parseEther("0.0001")
                  const totalFunding = ethers.utils.parseEther("1")
                  const withdrawalFee = 1000
                  const isGroupWithdrawal = false
                  const tokenUri = "https://github.com/nightfallsh4"
                  const startTimestamp = Date.now() + 10000
                  const vestingPeriodInSeconds = 60 * 60 * 2
                  const initialFundingId = await pgfFactory.s_fundingId()
                  await pgfFactory.createFunding(
                      totalFunding,
                      withdrawalFee,
                      isGroupWithdrawal,
                      tokenUri,
                      startTimestamp,
                      vestingPeriodInSeconds,
                      root,
                      { value: creationFee }
                  )
                  const contractAddress = await pgfFactory.getAddress(
                      initialFundingId
                  )
                  assert.exists(contractAddress)
                  //   console.log(contractAddress);
              })

              it("funding Id is incremented", async () => {
                  const creationFee = ethers.utils.parseEther("0.0001")
                  const totalFunding = ethers.utils.parseEther("1")
                  const withdrawalFee = 1000
                  const isGroupWithdrawal = false
                  const tokenUri = "https://github.com/nightfallsh4"
                  const startTimestamp = Date.now() + 10000
                  const vestingPeriodInSeconds = 60 * 60 * 2
                  const initialFundingId = await pgfFactory.s_fundingId()
                  await pgfFactory.createFunding(
                      totalFunding,
                      withdrawalFee,
                      isGroupWithdrawal,
                      tokenUri,
                      startTimestamp,
                      vestingPeriodInSeconds,
                      root,
                      { value: creationFee }
                  )
                  const finalFundingId = await pgfFactory.s_fundingId()
                  assert.equal(finalFundingId.toString(),initialFundingId.add("1").toString())
              })

              it("contractBalance is updated", async () => {
                const creationFee = ethers.utils.parseEther("0.0001")
                  const totalFunding = ethers.utils.parseEther("1")
                  const withdrawalFee = 1000
                  const isGroupWithdrawal = false
                  const tokenUri = "https://github.com/nightfallsh4"
                  const startTimestamp = Date.now() + 10000
                  const vestingPeriodInSeconds = 60 * 60 * 2
                  const initialContractBalance = await pgfFactory.s_contractBalance()
                  const tx = await pgfFactory.createFunding(
                      totalFunding,
                      withdrawalFee,
                      isGroupWithdrawal,
                      tokenUri,
                      startTimestamp,
                      vestingPeriodInSeconds,
                      root,
                      { value: creationFee }
                  )
                  const finalContractBalance = await pgfFactory.s_contractBalance()
                  assert.equal(finalContractBalance.toString(), initialContractBalance.add(creationFee).toString())
              })

              it("event is emitted", async () => {
                const creationFee = ethers.utils.parseEther("0.0001")
                  const totalFunding = ethers.utils.parseEther("1")
                  const withdrawalFee = 1000
                  const isGroupWithdrawal = false
                  const tokenUri = "https://github.com/nightfallsh4"
                  const startTimestamp = Date.now() + 10000
                  const vestingPeriodInSeconds = 60 * 60 * 2
                  const initialFundingId = await pgfFactory.s_fundingId()
                  expect(await pgfFactory.createFunding(
                    totalFunding,
                    withdrawalFee,
                    isGroupWithdrawal,
                    tokenUri,
                    startTimestamp,
                    vestingPeriodInSeconds,
                    root,
                    { value: creationFee }
                )).emit("FundingCreated")
              })
          })
      })
