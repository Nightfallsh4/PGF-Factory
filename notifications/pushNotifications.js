/**
 * @author: Mohd Ziyad
 */

import * as PushAPI from "@pushprotocol/restapi"
import * as ethers from "ethers"

const PK = "e49796d4f8c266020f52fbf7e43ecbc579802699a8f23a9f697345b83e7d54ec" //this is from my metamask account
const PKey = `0x${PK}`
const signer = new ethers.Wallet(PKey)
const channelAddress = "eip155:5:0x43097889162A9f2b7D85104f16aB7aB090056975" //This is a test channel I created

const sendNotification = async (
    reciepientAddress,
    title,
    body,
    payload_title,
    payload_body
) => {
    const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 3,
        identityType: 2,
        notification: {
            title: title,
            body: body,
        },
        payload: {
            title: payload_title,
            body: payload_body,
            cta: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            img: "",
        },
        recipients: reciepientAddress,
        channel: channelAddress,
        env: "staging",
    })
    console.log(apiResponse)
}

const optInToChannel = async (ethSigner, userAddress) => {
    await PushAPI.channels.subscribe({
        signer: ethSigner,
        channelAddress: channelAddress, // channel address in CAIP
        userAddress: userAddress, // user address in CAIP
        onSuccess: async () => {
            console.log("opt in success")
        },
        onError: () => {
            console.error("opt in error")
        },
        env: "staging",
    })
}
//optInToChannel must be called before calling getNotifications

const getNotifications = async (userAddress) => {
    const notifications = await PushAPI.user.getFeeds({
        user: userAddress, // user address in CAIP
        env: "staging",
    })
    console.log(notifications)
    return notifications
}
