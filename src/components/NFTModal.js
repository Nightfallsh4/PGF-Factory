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
import { BiconomyContext } from "../contexts/BiconomyContext"
import { useContext } from "react"

export default function NFTModal({
    isOpen,
    onClose,
    nftImage,
    nftTitle,
    funding,
    duration,
    nftDetails,
}) {
    const { account } = useContext(BiconomyContext)
    const withDrawBtnHandler = async () => {
        /** TODO */
    }
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{nftTitle}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
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
                                        {account.slice(0, 6) +
                                            "..." +
                                            account.slice(38, 42)}
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

                                <Flex align={"center"} justify={"left"}>
                                    <Text marginEnd={3}>Days Left:</Text>
                                    <Text fontWeight={"semibold"}>
                                        {duration}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
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
                        <Button variant="ghost">Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
