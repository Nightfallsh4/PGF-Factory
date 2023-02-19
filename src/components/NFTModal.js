import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Button,
    Text,
    Image,
    Stack,
    Avatar,
    Flex,
} from "@chakra-ui/react"
import { useContractWrite, usePrepareContractWrite, useSigner } from "wagmi"
import { ethers } from "ethers"
import fundingAbi from "../../deployments/fundingContract.json"

import { useAccount } from "wagmi"
import { makeRoot } from "../pages/utils/merkleTree"
import keccak256 from "keccak256"

export default function NFTModal({
    isOpen,
    onClose,
    nftImage,
    nftTitle,
    funding,
    duration,
    nftDetails,
    isListed,
}) {
    const { tree, root } = makeRoot([
        "0xB721347D2938a5594a12DF5Cc36D598b839Cb98f",
        "0xcB399226a65DF8964482daA5B1CB98478493CC4d",
    ])
    const { data: signData, signer } = useSigner()

    const { address } = useAccount()
    const proof = tree.getHexProof(keccak256(address))
    const { data, isLoading, isSuccess, write, error, isError } =
        useContractWrite({
            address: "0x30062bbb14cc9f8ff615f579dc48af692e928570",
            abi: fundingAbi.abi,
            functionName: "depositFunds",
            args: [proof],
            overrides: {
                value: ethers.utils.parseEther("0.001"),
            },
            chainId: 80001,
            onSuccess(data) {
                console.log(data.hash)
                setHash(data.hash)
            },
        })
    const withDrawBtnHandler = async () => {
        /** TODO */
    }
    const fundBtnHandler = async () => {
        /**TODO */
        console.log(proof)
        console.log(root);
        write?.()
    }
    return (
      <div >
            <Modal  isOpen={isOpen} onClose={onClose} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{nftTitle}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody >
                        <Image
                            src={nftImage}
                            alt="Green double couch with wooden legs"
                            borderRadius="lg"
                        />
                        <Stack mt="6" spacing="3">
                            <Text fontWeight={"bold"}>About</Text>
                            <Text>{nftDetails}</Text>
                            <Flex
                                align={"center"}
                                justifyContent={"space-between"}
                            >
                                <Flex align={"center"} justify={"left"}>
                                    <Text marginEnd={3} fontWeight={"semibold"}>
                                        NFT Creator:
                                    </Text>
                                    <Text
                                        color={"green.500"}
                                        fontWeight={"bold"}
                                    >
                                        {address.slice(0, 6) +
                                            "..." +
                                            address.slice(38, 42)}
                                    </Text>
                                </Flex>

                                <Avatar
                                    name="nftCreator"
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png"
                                />
                            </Flex>
                            <Flex
                                align={"center"}
                                justifyContent={"space-between"}
                            >
                                <Flex align={"center"} justify={"left"}>
                                    <Text marginEnd={3}>Total Amount:</Text>
                                    <Text fontWeight={"semibold"}>
                                        {funding}
                                    </Text>
                                </Flex>
                                {isListed ? (
                                    <Flex align={"center"} justify={"left"}>
                                        <Text marginEnd={3}>Duration:</Text>
                                        <Text fontWeight={"semibold"}>
                                            {duration} Months
                                        </Text>
                                    </Flex>
                                ) : (
                                    <Flex align={"center"} justify={"left"}>
                                        <Text marginEnd={3}>Days Left:</Text>
                                        <Text fontWeight={"semibold"}>
                                            {duration}
                                        </Text>
                                    </Flex>
                                )}
                            </Flex>
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        {isListed ? (
                            <Button
                                colorScheme="green"
                                mr={3}
                                onClick={async () => {
                                    await fundBtnHandler()
                                    onClose
                                }}
                            >
                                Fund
                            </Button>
                        ) : (
                            <Button
                                colorScheme="red"
                                mr={3}
                                onClick={async () => {
                                    await withDrawBtnHandler()
                                    onClose
                                }}
                            >
                                Withdraw
                            </Button>
                        )}

                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}
