import { Web3Storage } from "web3.storage";

async function uploadToIpfs(zipBlob: Blob, fileName:string) {
    const token = process.env.NEXT_PUBLIC_WEB3_STORAGE || undefined
    const web3Client = new Web3Storage({ token: token  })

    console.log("Putting files on ipfs.....")
    const cid = await web3Client.put([new File([zipBlob], fileName)])

    console.log("Uploaded to IPFS successfully. CID is :- ")
    console.log(cid)
    
    return cid
}