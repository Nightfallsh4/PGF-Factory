"use client"; // this is a client component
// import dynamic from 'next/dynamic'
// const BiconomyContextProvider = dynamic(
// 	() => import("../contexts/BiconomyContext"),
// 	{
// 		ssr: false,
// 	},
// )

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

  { name: 'Fund Public Contracts', href: '#', current: false },
  { name: 'Create your own Contract', href: '/createNft', current: false },
    { name: 'My Funded Contracts', href: '#', current: false },
    { name: 'Social Login', href: '#', current: true }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
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

      // <div className="a">
      //   {/* <Navbar></Navbar> */}
      //   <div
      //     className="flex flex-col place-items-center mt-10"
      //     id="nftForm">
      //     <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
      //       <h3 className="text-center font-bold text-purple-500 mb-8">
      //         Create Public Goods Funding Contract.
      //       </h3>
      //       <div className="flex-inline mb-4">
      //         <label
      //           className="block text-purple-500 text-sm font-bold mb-2"
      //           htmlFor="name">
      //           Contract Name
      //         </label>
      //         <input
      //           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      //           id="name"
      //           type="text"
      //           placeholder="Sector 75 construction..."
      //           onChange={(e) =>
      //             updateFormParams({ ...formParams, name: e.target.value })
      //           }
      //           value={formParams.name}></input>
      //         <div className="mb-6">
      //           <label
      //             className="block text-purple-500 text-sm font-bold mb-2"
      //             htmlFor="price">
      //             Contract Price (in ETH)
      //           </label>
      //           <input
      //             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      //             type="number"
      //             placeholder="Min 0.01 ETH"
      //             step="0.01"
      //             value={formParams.price}
      //             onChange={(e) =>
      //               updateFormParams({ ...formParams, price: e.target.value })
      //             }></input>
      //         </div>

      //         <div className="flex-inline mb-4">
      //           <label
      //             className="block text-purple-500 text-sm font-bold mb-2"
      //             htmlFor="setwithdrwalfee">
      //             Contract withdrawal fees
      //           </label>
      //           <input
      //             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      //             id="setwithdrwalfee"
      //             type="text"
      //             placeholder="10%..."
      //             onChange={(e) =>
      //               updateFormParams({
      //                 ...formParams,
      //                 setwithdrwalfee: e.target.value,
      //               })
      //             }
      //             value={formParams.setwithdrwalfee}></input>
      //         </div>
      //       </div>
      //       <div className="mb-6">
      //         <label
      //           className="block text-purple-500 text-sm font-bold mb-2"
      //           htmlFor="description">
      //           Contract Details
      //         </label>
      //         <textarea
      //           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      //           cols="40"
      //           rows="5"
      //           id="description"
                
      //           placeholder="Construction starting from 4th March 2023...."
      //           value={formParams.description}
      //           onChange={(e) =>
      //             updateFormParams({
      //               ...formParams,
      //               description: e.target.value,
      //             })
      //           }></textarea>
      //       </div>

      //       <div className="mb-4">
      //         <label
      //           className="block text-purple-500 text-sm font-bold mb-2"
      //           htmlFor="contractperiod">
      //           Contract Period
      //         </label>
      //         <input
      //           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      //           id="contractperiod"
      //           type="integer"
      //           placeholder="Vesting Time in Months"
      //           onChange={(e) =>
      //             updateFormParams({
      //               ...formParams,
      //               contractperiod: e.target.value,
      //             })
      //           }
      //           value={formParams.contractperiod}></input>
      //       </div>
      //       <div>
      //         <label
      //           className="block text-purple-500 text-sm font-bold mb-2"
      //           htmlFor="image">
      //           Upload Contract Legal Documents
      //         </label>
      //         <input
      //           type={'file'}
      //           onChange={OnChangeFile}></input>
      //       </div>
      //       <br></br>
      //       <div className="text-green text-center">{message}</div>
      //       <button
      //         onClick={listNFT}
      //         className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg">
      //         Create NFT
      //       </button>
      //     </form>
      //   </div>
      // </div>


  return (
   
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                {/* <div className="flex flex-shrink-0 items-center">
                  <img
                    className="block h-8 w-auto lg:hidden"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                  <img
                    className="hidden h-8 w-auto lg:block"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  />
                </div> */}
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current ? 'bg-blue-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* <button
                  type="button"
                
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                {/* <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </Menu.Button>
                  </div> */}
                 
                  {/* <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu> */} 
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
    
  )
}

