import {
    Card,
    CardBody,
    CardFooter,
    Stack,
    Image,
    Divider,
    ButtonGroup,
    Button,
    Text,
    Heading,
    Flex,
    useDisclosure,
} from "@chakra-ui/react"
import NFTModal from "./NFTModal"

export default function NFTCard({
    nftImage,
    funding,
    nftTitle,
    duration,
    nftDetails,
    isListed,
}) {
    const { isOpen, onClose, onOpen } = useDisclosure()
    return (
        <>
            <NFTModal
                isOpen={isOpen}
                onClose={onClose}
                nftImage={nftImage}
                nftTitle={nftTitle}
                funding={funding}
                duration={duration}
                nftDetails={nftDetails}
                isListed={isListed}
            />
            <Card maxW="sm" size={"sm"}>
                <CardBody>
                    <Image src={nftImage} alt="Token Image" borderRadius="lg" />

                    <Stack mt="6" spacing="3">
                        <Heading size="lg" fontWeight={"bold"}>
                            {nftTitle}
                        </Heading>

                        <Flex
                            align="center"
                            justify="center"
                            justifyContent={"space-between"}
                        >
                            <Text
                                color="blue.600"
                                fontSize="lg"
                                fontWeight={"semibold"}
                            >
                                {funding} ETH
                            </Text>
                            {isListed ? (
                                <Text color={"gray.600"} fontSize="md">
                                    {duration} Months
                                </Text>
                            ) : (
                                <Text color={"gray.600"} fontSize="md">
                                    {duration} days left
                                </Text>
                            )}
                        </Flex>
                    </Stack>
                </CardBody>
                <Divider color="gray.400" />

                <CardFooter>
                    <ButtonGroup spacing="2">
                        <Button
                            variant="solid"
                            colorScheme="green"
                            onClick={onOpen}
                        >
                            More Details
                        </Button>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </>
    )
}
