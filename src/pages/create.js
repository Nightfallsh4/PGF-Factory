import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"

// import { useStateContext } from '../context';
// import { money } from '../assets';
import { CustomButton, FormField, Loader } from "../components"
import { checkIfImage } from "./utils/util"

function CreateCampaign() {
    const [isLoading, setIsLoading] = useState(false)
      const [isOn, setIsOn] = useState(false)

      const handleCchange = () => {
          setIsOn(!isOn)
      }
    const switchStyles = {
     float:"right",
      position: "relative",
      display: "inline-block",
      width: "60px",
      height: "34px",
  }

  const inputStyles = {
      opacity: 0,
      width: 0,
      height: 0,
  }

  const sliderStyles = {
      position: "absolute",
      cursor: "pointer",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#ccc",
      transition: "0.4s",
  }

  const roundStyles = {
      position: "absolute",
      content: '""',
      height: "26px",
      width: "26px",
      left: "4px",
      bottom: "4px",
      backgroundColor: "white",
      transition: "0.4s",
  }

  if (isOn) {
      sliderStyles.backgroundColor = "#2196F3"
      roundStyles.transform = "translateX(26px)"
  }


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
    const inputArr = [
       
    ]

    const [arr, setArr] = useState(inputArr)
    const [clicked, setClicked] = useState(false);

    const addInput = () => {
        setClicked(true)
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

    return (
        <div
            className="bg-gradient-to-r from-red-400 to-blue-500 flex justify-center items-center flex-col rounded-[25px] sm:p-10 p-4 "
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
                    fontSize: "50px",
                }}
                className="text-bold-100 font-semibold"
            >
                Create A Funding Contract
            </h1>

            <form
                onSubmit={handleSubmit}
                className=" mt-[15px] flex flex-col gap-[10px]"
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
                        <div
                            class="flex text-sm text-white-600"
                            style={{ borderColor: "black" }}
                        >
                            <label
                                for="file-upload"
                                class="relative cursor-pointer rounded-md py-1 px-2 bg-black font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
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
                <div className="w-full flex justify-start items-center p-4 bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 h-[120px] rounded-[10px]">
                    {/* <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/> */}
                    <h4 className="font-epilogue text-2xl text-white ml-[20px]">
                        Each Contract Funder can fund 10% of the Contract Amount
                    </h4>
                </div>

                <div>
                    <button
                        type="button"
                        class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={addInput}
                    >
                        Add Whitelisted addressess here
                    </button>
                    {clicked &&
                        arr.map((item, i) => {
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
                <div>Enable Group Withdrawal?</div>
                <label style={switchStyles}>
                    <input
                        type="checkbox"
                        checked={isOn}
                        onChange={handleCchange}
                        style={inputStyles}
                    />
                    <span style={sliderStyles}>
                        <span style={roundStyles}> </span>
                    </span>
                </label>

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
