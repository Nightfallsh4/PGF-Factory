import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers"

import { ToggleSwitch } from "./components"

// import { useStateContext } from '../context';
// import { money } from '../assets';
import { CustomButton, FormField, Loader } from "../components"
import { checkIfImage } from "./utils/util"
import PushSupportChat from "../../notifications/supportChat"
import { useAccount } from "wagmi"

function CreateCampaign() {
    const [isLoading, setIsLoading] = useState(false)

    const [isOn, setIsOn] = useState(false)

    const handleCchange = () => {
        setIsOn(!isOn)
    }
    const switchStyles = {
        float: "right",
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

    const { address } = useAccount()

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
    const inputArr = []

    const [arr, setArr] = useState(inputArr)
    const [clicked, setClicked] = useState(false)
const [image, setImage] = useState(null)

const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
        const selectedImage = event.target.files[0]
        setImage(URL.createObjectURL(selectedImage))
    }
}

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

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     // checkIfImage(form.image, async (exists) => {
    //     //     if (exists) {
    //     //         setIsLoading(true)
    //     //         // await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18)})
    //     //         setIsLoading(false)
    //     //         navigate("/")
    //     //     } else {
    //     //         alert("Provide valid image URL")
    //     //         setForm({ ...form, image: "" })
    //     //     }
    //     // })
    // }

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
            <div>
                <PushSupportChat userAddress={address} />
            </div>

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
                    <div>
                        <input type="file" onChange={handleImageChange} />
                        {image && (
                            <div>
                                <img src={image} alt="uploaded image" />
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <button onClick={addInput}>
                        Add WhiteListed Addressess?
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
                        totalFunding={form.target}
                        withdrawalFee={form.fees}
                        whitelisted={arr}
                        months={form.months}
                        tokenUri="github.com/nightfallsh4"
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
