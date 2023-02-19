import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"
import {ToggleSwitch} from './components'
// import { useStateContext } from '../context';
// import { money } from '../assets';
import { CustomButton, FormField, Loader } from "../components"
import { checkIfImage } from "./utils/util"

function CreateCampaign() {
    const [isLoading, setIsLoading] = useState(false)

    const [form, setForm] = useState({
        name: "",
        months: "",
        description: "",
        target: "",
        fees: "",
        image: "",
    })

    const handleFormFieldChange = (fieldName, e) => {
        setForm({ ...form, [fieldName]: e.target.value })
    }
    const inputArr = [
        {
            type: "text",
            id: 1,
            value: "",
        },
    ]

    const [arr, setArr] = useState(inputArr)

    const addInput = () => {
        setArr((s) => {
            return [
                ...s,
                {
                    type: "text",
                    value: "",
                },
            ]
        })
    }

    const handleChange = (e) => {
        e.preventDefault()

        const index = e.target.id
        setArr((s) => {
            const newArr = s.slice()
            newArr[index].value = e.target.value

            return newArr
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        checkIfImage(form.image, async (exists) => {
            if (exists) {
                setIsLoading(true)
                // await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18)})
                setIsLoading(false)
                navigate("/")
            } else {
                alert("Provide valid image URL")
                setForm({ ...form, image: "" })
            }
        })
    }

    return (
        <div
            className="bg-gradient-to-r from-blue-400 to-emerald-400 flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 "
            style={{
                marginBottom: "150px",
                marginRight: "150px",
                marginLeft: "150px",
                marginTop: "50px",
                borderColor: "#9ecaed",
                boxShadow: "0 0 100px black",
            }}
        >
            {isLoading && <Loader />}
            <h1
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "70px",
                }}
                className="text-slate-100 font-semibold"
            >
                Create A Funding Contract
            </h1>

            <form
                onSubmit={handleSubmit}
                className="w-full mt-[65px] flex flex-col gap-[30px]"
            >
                <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Public contract Name"
                        placeholder="Road Construction....."
                        inputType="text"
                        value={form.name}
                        handleChange={(e) => handleFormFieldChange("name", e)}
                    />
                    <FormField
                        labelName="Number of Months to be vested"
                        placeholder="10 months.."
                        inputType="text"
                        value={form.months}
                        handleChange={(e) => handleFormFieldChange("months", e)}
                    />
                </div>

                <FormField
                    labelName="Description*"
                    placeholder="Description of public goods"
                    inputType="text"
                    value={form.description}
                    handleChange={(e) =>
                        handleFormFieldChange("description", e)
                    }
                />

                <div className="w-full flex justify-start items-center p-4 bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 h-[120px] rounded-[10px]">
                    {/* <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/> */}
                    <h4 className="font-epilogue text-2xl text-white ml-[20px]">
                        Each Contract Funder can fund 10% of the Contract Amount
                    </h4>
                </div>

                <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        labelName="Contract Target *"
                        placeholder="100 ETH"
                        inputType="text"
                        value={form.target}
                        handleChange={(e) => handleFormFieldChange("target", e)}
                    />
                    <FormField
                        labelName="Contract Withdrawal fees"
                        placeholder="10%..."
                        inputType="text"
                        value={form.fees}
                        handleChange={(e) => handleFormFieldChange("fees", e)}
                    />
                </div>

                <div class="mt-1 flex justify-center rounded-md border-2 border-dashed border-white-300 px-6 pt-5 pb-6">
                    <div class="space-y-1 text-center">
                        <svg
                            class="mx-auto h-12 w-12 text-white-400"
                            stroke="white"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                        >
                            {/* <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            /> */}
                        </svg>
                        <div class="flex text-sm text-white-600">
                            <label
                                for="file-upload"
                                class="relative cursor-pointer rounded-md py-1 px-2 bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                                <span>Upload a file</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    class="sr-only"
                                />
                            </label>
                            <p class="pl-1">or drag and drop</p>
                        </div>
                        <p class="text-xs text-white-500">
                            PNG, JPG, GIF up to 10MB
                        </p>
                    </div>
                </div>
                 <div>
                        <ToggleSwitch label="Group Withdrwal"/>
                    </div>
                <div>
                   
                    <button class="btn btn-blue"
                     
                        onClick={addInput}>Add WhiteListed Addressess?
                    </button>
                    {arr.map((item, i) => {
                        return (
                            <div
                                style={{
                                    margin: "20px",
                                    borderRadius: "200px",
                                }}
                            >
                                <input
                                    onChange={handleChange}
                                    value={item.value}
                                    id={i}
                                    type={item.type}
                                    size="40"
                                />
                            </div>
                        )
                    })}
                </div>

                <div className="flex justify-center items-center mt-[40px]">
                    <CustomButton
                        btnType="submit"
                        title="Submit new campaign"
                        styles="bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800"
                    />
                </div>
            </form>
        </div>
    )
}

export default CreateCampaign
