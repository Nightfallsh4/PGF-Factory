const { assert, expect } = require("chai")
const { network, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FactoryContract Unit Tests", () => {
          let factoryContract, deployer, funder
          let totalFunding, groupFunding

          beforeEach(async () => {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              funder = accounts[1]
              await deployments.fixture()
              factoryContract = await ethers.getContract("FundingContract")
              totalFunding = await factoryContract.getTotalAmount()
          })

          describe("constructor", () => {
              it("Intializes the contract correctly", async () => {
                  const withdrawalFee = await factoryContract.getWithdrawalFee()
                  const groupWithdrawal =
                      await factoryContract.getIsGroupWithdrawal()
                  const tokenUri = await factoryContract.tokenURI(1)
                  const startTimeStamp =
                      await factoryContract.getStartTimestamp()
                  const vestingPeriodInSeconds =
                      await factoryContract.getVestingPeriod()

                  assert.equal(
                      totalFunding.toString(),
                      ethers.utils.parseEther("1")
                  )
                  assert.equal(
                      withdrawalFee.toString(),
                      ethers.utils.parseEther("0.05")
                  )
                  assert(groupWithdrawal == true || groupWithdrawal == false)
                  if (groupWithdrawal == true) {
                      groupFunding = true
                  } else {
                      groupFunding = false
                  }
                  assert.equal(tokenUri, "https://funding-contract.com")
                  assert.equal(startTimeStamp, Math.floor(Date.now() / 1000))
                  assert.equal(vestingPeriodInSeconds.toString(), "7890000")
              })
          })

          describe("depositFunds", () => {
              it("reverts if funding is lower than minimum amount", async () => {
                  await expect(
                      factoryContract.depositFunds({
                          value: ethers.utils.parseEther("0.04"),
                      })
                  ).to.be.revertedWithCustomError(
                      factoryContract,
                      "FundingContract__NotEnoughETH"
                  )
              })
              it("deposits money if its greater than minimum amount", async () => {
                  await expect(
                      factoryContract.depositFunds({
                          value: ethers.utils.parseEther("0.5"),
                      })
                  ).to.emit(factoryContract, "FundsDeposited")
              })

              it("Records the amount deposited and mints an NFT", async () => {
                  const tx = await factoryContract.depositFunds({
                      value: ethers.utils.parseEther("0.5"),
                  })
                  await tx.wait()
                  const amountFundedByDeployer =
                      await factoryContract.getAmountFundedByAddress(
                          deployer.address
                      )

                  const funder = await factoryContract.getFunder(0)
                  const tokenCounter = await factoryContract.getTokenCounter()

                  assert.equal(
                      amountFundedByDeployer.toString(),
                      ethers.utils.parseEther("0.5")
                  )
                  assert.equal(funder, deployer.address)
                  assert.equal(tokenCounter.toString(), "1")
              })
          })

          describe("claim", () => {
              beforeEach(async () => {
                  const tx = await factoryContract.depositFunds({
                      value: ethers.utils.parseEther("0.5"),
                  })
                  await tx.wait()
                  await factoryContract.grantRole(
                      ethers.utils.keccak256(
                          ethers.utils.toUtf8Bytes("CONTRACTOR_ROLE")
                      ),
                      deployer.address
                  )
              })
              it("verifies that only contractors can access it", async () => {
                  const isContractor = await factoryContract.hasRole(
                      ethers.utils.keccak256(
                          ethers.utils.toUtf8Bytes("CONTRACTOR_ROLE")
                      ),
                      deployer.address
                  )
                  assert.equal(isContractor, true)
              })

              it("releases ethers", async () => {
                  await expect(factoryContract.claim()).to.emit(
                      factoryContract,
                      "ContractorClaimedFunds"
                  )
              })

              it("updates the contractor's balance", async () => {
                  /*To be implemented*/
                  const deployerInitialBalance = await deployer.getBalance()
                  const claimTx = await factoryContract.claim()
                  const reciept = await claimTx.wait()
                  const { gasUsed, effectiveGasPrice } = reciept
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const deployerEndingBalance = await deployer.getBalance()
                  //   assert.equal(
                  //       deployerEndingBalance - deployerInitialBalance - gasCost,
                  //       ethers.utils.parseEther("0.5")
                  //   )

                  //   console.log(
                  //       "Initial Balance: ",
                  //       deployerInitialBalance.toString()
                  //   )
                  //   console.log("Gas Cost: ", gasCost.toString())
                  //   console.log(
                  //       "Ending Balance: ",
                  //       deployerEndingBalance.toString()
                  //   )
              })
          })

          describe("requestForWithdrawal", async () => {
              it("only allowed for group funding", async () => {
                  if (!groupFunding) {
                      await expect(
                          factoryContract.requestForWithdrawal(1)
                      ).to.be.revertedWithCustomError(
                          factoryContract,
                          "FundingContract__NotGroupFunding"
                      )
                  }
              })

              it("increments the withdrawer counter and emits an event", async () => {
                  const tx = await factoryContract.requestForWithdrawal(1)
                  await tx.wait()
                  const withdrawerCounter =
                      await factoryContract.getWithdrawerCounter()
                  assert.equal(withdrawerCounter.toString(), "1")

                  await expect(factoryContract.requestForWithdrawal(1)).to.emit(
                      factoryContract,
                      "WithdrawalRequest"
                  )
              })
          })

          describe("withdrawalCheck", () => {
              it("checks if withdrawal condition is met", async () => {
                  for (let i = 0; i < 8; i++) {
                      const accounts = await ethers.getSigners()
                      const funder = accounts[i]
                      const tx = await factoryContract
                          .connect(funder)
                          .depositFunds({
                              value: ethers.utils.parseEther("0.5"),
                          })
                      await tx.wait()
                  }

                  for (let i = 0; i < 5; i++) {
                      const accounts = await ethers.getSigners()
                      const withdrawer = accounts[i]
                      const tx = await factoryContract
                          .connect(withdrawer)
                          .requestForWithdrawal(i + 1)
                      await tx.wait()
                  }

                  const checkTx = await factoryContract.withdrawalCheck()
                  assert.equal(checkTx, true)
              })
          })

          describe("withdrawFunds", () => {
              beforeEach(async () => {
                  tx = await factoryContract.depositFunds({
                      value: ethers.utils.parseEther("0.5"),
                  })
                  await tx.wait()
                  await factoryContract.grantRole(
                      ethers.utils.keccak256(
                          ethers.utils.toUtf8Bytes("FUNDER_ROLE")
                      ),
                      deployer.address
                  )
              })

              it("only allows funders to withdraw", async () => {
                  const isFunder = await factoryContract.hasRole(
                      ethers.utils.keccak256(
                          ethers.utils.toUtf8Bytes("FUNDER_ROLE")
                      ),
                      deployer.address
                  )
                  assert.equal(isFunder, true)
              })

              it("withdraws vested funds and transfers it to the funder", async () => {
                  /*To be implemented*/
              })

              it("emits withdrawal event", async () => {
                  await expect(factoryContract.withdrawFunds()).to.emit(
                      factoryContract,
                      "FundsWithdrawed"
                  )
              })
          })

          describe("verifyMerkleTree", () => {
              it("verifies the Merkle proof", async () => {
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

                  const leaves = addresses.map((address) => keccak256(address))

                  const merkleTree = new MerkleTree(leaves, keccak256, {
                      sortPairs: true,
                  })

                  const rootHash = merkleTree.getHexRoot()
                  const address = addresses[0]
                  const hashedAddress = keccak256(address)
                  const proof = merkleTree.getHexProof(hashedAddress)
                  const verifyTx = await factoryContract.verifyMerkleTree(
                      proof,
                      rootHash
                  )
                  assert.equal(verifyTx, true)
              })
          })
      })
