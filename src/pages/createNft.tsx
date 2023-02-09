// import Navbar from "./Navbar";
"use client"; // this is a client component

import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinata";
// import factory conrtact json
import { useLocation } from "react-router-dom";

export default function CreateNFT () {
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

    //This function uploads the metadata to IPFS
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
      <div className="a">
        {/* <Navbar></Navbar> */}
        <div
          className="flex flex-col place-items-center mt-10"
          id="nftForm">
          <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
            <h3 className="text-center font-bold text-purple-500 mb-8">
              Create Public Goods Funding Contract.
            </h3>
            <div className="flex-inline mb-4">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="name">
                Contract Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Sector 75 construction..."
                onChange={(e) =>
                  updateFormParams({ ...formParams, name: e.target.value })
                }
                value={formParams.name}></input>
              <div className="mb-6">
                <label
                  className="block text-purple-500 text-sm font-bold mb-2"
                  htmlFor="price">
                  Contract Price (in ETH)
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  placeholder="Min 0.01 ETH"
                  step="0.01"
                  value={formParams.price}
                  onChange={(e) =>
                    updateFormParams({ ...formParams, price: e.target.value })
                  }></input>
              </div>

              <div className="flex-inline mb-4">
                <label
                  className="block text-purple-500 text-sm font-bold mb-2"
                  htmlFor="setwithdrwalfee">
                  Contract withdrawal fees
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="setwithdrwalfee"
                  type="text"
                  placeholder="10%..."
                  onChange={(e) =>
                    updateFormParams({
                      ...formParams,
                      setwithdrwalfee: e.target.value,
                    })
                  }
                  value={formParams.setwithdrwalfee}></input>
              </div>
            </div>
            <div className="mb-6">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="description">
                Contract Details
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                cols="40"
                rows="5"
                id="description"
                
                placeholder="Construction starting from 4th March 2023...."
                value={formParams.description}
                onChange={(e) =>
                  updateFormParams({
                    ...formParams,
                    description: e.target.value,
                  })
                }></textarea>
            </div>

            <div className="mb-4">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="contractperiod">
                Contract Period
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="contractperiod"
                type="integer"
                placeholder="Vesting Time in Months"
                onChange={(e) =>
                  updateFormParams({
                    ...formParams,
                    contractperiod: e.target.value,
                  })
                }
                value={formParams.contractperiod}></input>
            </div>
            <div>
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="image">
                Upload Contract Legal Documents
              </label>
              <input
                type={'file'}
                onChange={OnChangeFile}></input>
            </div>
            <br></br>
            <div className="text-green text-center">{message}</div>
            <button
              onClick={listNFT}
              className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg">
              Create NFT
            </button>
          </form>
        </div>
      </div>
    );
}