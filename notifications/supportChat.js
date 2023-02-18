import { Chat } from "@pushprotocol/uiweb"

export default function pushSupportChat({ userAddress }) {
    return (
        <Chat
            account={userAddress} //user address
            supportAddress="0xd9c1CCAcD4B8a745e191b62BA3fcaD87229CB26d" //support address
            apiKey="jVPMCRom1B.iDRMswdehJG7NpHDiECIHwYMMv6k2KzkPJscFIDyW8TtSnk4blYnGa8DIkfuacU0"
            env="staging"
        />
    )
}
