"use client"; // this is a client component
// import dynamic from 'next/dynamic'
// const BiconomyContextProvider = dynamic(
// 	() => import("../contexts/BiconomyContext"),
// 	{
// 		ssr: false,
// 	},
// )
import Link from 'next/link';
import { useContext, useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinata";
// import factory conrtact json
import { useLocation } from "react-router-dom";
      import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import  {BiconomyContext} from '../contexts/BiconomyContext'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function createnft() {
  // const {account, provider, smartAccount, socialLoginSDK, connectWeb3,disconnectWeb3} = useContext(BiconomyContext)
    const [formParams, updateFormParams] = useState({
      name: '',
      price: '',
      setwithdrwalfee: '',
      description: '',
     contractperiod: ''
    });
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const location = useLocation();

    //This function uploads the NFT image to IPFS
    async function OnChangeFile(e) {
        var file = e.target.files[0];
        //check for file extension
        try {
            //upload the file to IPFS
            const response = await uploadFileToIPFS(file);
            if(response.success === true) {
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
            }
        }
        catch(e) {
            console.log("Error during file upload", e);
        }
  }
  const navigation = [

  { name: 'Fund Public Contracts', href:'/' , current: false },
  { name: 'Create your own Contract',href:'/CreateCampaign' , current: false },
    { name: 'My Funded Contracts',href:'/myNfts' , current: false },
    { name: 'Social Login', href:'/', current: true }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


    //This function uploads the metadata to IPFSmap
    async function uploadMetadataToIPFS() {
        const {name, description, price,setwithdrwalfee,contractperiod} = formParams;
        //Make sure that none of the fields are empty
        if(!name||
      !price||
      !setwithdrwalfee||
      !description||
     !contractperiod|| !fileURL)
            return;

        const nftJSON = {
            name, description, price,setwithdrwalfee,contractperiod, image: fileURL
        }

        try {
            //upload the metadata JSON to IPFS
			const metadataBlob = new Blob([JSON.stringify(nftJSON)])
            const response = await uploadJSONToIPFS(nftJSON);
            if(response.success === true){
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function listNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
  
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            updateMessage("Please wait.. uploading (upto 5 mins)")

        
            let contract = new ethers.Contract(//factory.address, 
                //factory.abi,
                signer)

      
            const price = ethers.utils.parseUnits(formParams.price, 'ether')
            let listingPrice = await contract.getListPrice()
            listingPrice = listingPrice.toString()

         
            let transaction = await contract.createToken(metadataURL, price, { value: listingPrice })
            await transaction.wait()

            alert("Successfully listed your NFT!");
            updateMessage("");
            updateFormParams({
              name: '',
              price: '',
              setwithdrwalfee: '',
              description: '',
              contractperiod: ''
            });
            window.location.replace("/")
        }
        catch(e) {
            alert( "Upload error"+e )
        }
    }

    console.log("Working", process.env);
return (
      <nav className="navbar navbar-light" style={{backgroundColor: "#e3f2fd"}}>
 <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
    <a className="navbar-brand" href="#">Hidden brand</a>
    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
      <li className="nav-item active">
        <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="#">Link</a>
      </li>
      <li className="nav-item">
        <a className="nav-link disabled" href="#">Disabled</a>
      </li>
    </ul>
    <form className="form-inline my-2 my-lg-0">
      <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
      <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>
    
  )
}

