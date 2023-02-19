import React from "react"
import { useContractWrite, usePrepareContractWrite, useSigner } from "wagmi"
import pgfAbi from "../../deployments/pgfFactory.json"
import { ethers } from "ethers"
import { makeRoot } from "@/pages/utils/merkleTree"
// import { CustomFundingButtonInterface } from "../pages/utils/interfaces";
import Modal from "@mui/material/Modal"
import { Box, Typography } from "@mui/material"
import { useNotification } from "@web3uikit/core"

const CustomButton = (params) => {
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const [hash, setHash] = React.useState("")

    const dispatch = useNotification()

    const handleSuccessNotification = (hash) => {
        dispatch({
            type: "success",
            message: { hash },
            title: "NFT Minted",
            position: "topR",
        })
    }

    const handleFailNotification = () => {
        dispatch({
            type: "error",
            message: "Contract creation Failed",
            title: "Minting Failed",
            position: "topR",
        })
    }

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    }

    const creationFee = ethers.utils.parseEther("0.0001")
    // const totalFunding = ethers.utils.parseEther("1")
    // const withdrawalFee = 1000
    const isGroupWithdrawal = true
    const tokenUri = "https://github.com/nightfallsh4"
    const startTimestamp = Date.now() + 1000
    const vestingPeriodInSeconds = 60 * 60 * 24 * 30 * parseInt(params.months)
    const addresses = []
    params.whitelisted.forEach((element) => {
        addresses.push(element.value)
    })
    const { tree, root } = makeRoot(addresses || ["0xcB399226a65DF8964482daA5B1CB98478493CC4d","0xB721347D2938a5594a12DF5Cc36D598b839Cb98f"])
    const { data: signData, signer } = useSigner()
    // const { config } = usePrepareContractWrite({
    //     address: "0xA062E89e79668b873004Bf60c588C899289D4166",
    //     abi: pgfAbi.abi,
    //     functionName: "createFunding",
    //     args: [
    //         params.totalFunding,
    //         params.form.withdrawalFee,
    //         params.isGroupWithdrawal,
    //         params.tokenUri,
    //         params.startTimestamp,
    //         params.form.vestingPeriodInSeconds,
    //         root,
    //     ],
    //     signer: signer,
    //     overrides: {
    //         value: ethers.utils.parseEther("0.0001"),
    //     },
    // })
    const { data, isLoading, isSuccess, write, error, isError } =
        useContractWrite({
            address: "0xA062E89e79668b873004Bf60c588C899289D4166",
            abi: pgfAbi.abi,
            functionName: "createFunding",
            args: [
                ethers.utils.parseEther(params.totalFunding || "0"),
                parseInt(params.withdrawalFee),
                isGroupWithdrawal,
                params.tokenUri,
                startTimestamp,
                vestingPeriodInSeconds,
                root,
            ],
            overrides: {
                value: ethers.utils.parseEther("0.0001"),
            },
            chainId: 80001,
            onSuccess(data) {
                console.log(data.hash)
                setHash(data.hash)
                if (isSuccess) {
                    handleSuccessNotification(hash)
                }
            },
            onError() {
                handleFailNotification()
            },
        })
    async function deploy() {
        console.log("Clicked deploy")
        console.log(write)
        console.log(startTimestamp)
        console.log(params.withdrawalFee)
        // console.log(config)
        console.log(data)
        console.log(error)
        console.log(isError)
        handleOpen()
        await write?.()
    }
    return (
        <div>
            <button
                // type={btnType}
                className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] ${params.styles}`}
                onClick={deploy}
            >
                {params.title}
            </button>
        </div>
    )
}

export default CustomButton
