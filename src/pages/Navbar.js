import React from "react"
import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"
function Navbar() {
    return (
        <div style={{ padding: "30px" }}>
            <nav
                className="flex items-center justify-between"
                aria-label="Global"
            >
                <div className="flex lg:flex-1"></div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                    <Link
                        href="/"
                        className="text-xl font-semibold leading-6 text-gray-900"
                    >
                        Home
                    </Link>
                    <Link
                        href="/listed-contracts"
                        className="text-xl font-semibold leading-6 text-gray-900"
                    >
                        Listed Contracts
                    </Link>

                    <Link
                        href="/create"
                        className="text-xl font-semibold leading-6 text-gray-900"
                    >
                        <button type="button">Create Contract</button>
                    </Link>

                    <Link
                        href="/myFundingContract"
                        className="text-xl font-semibold leading-6 text-gray-900"
                    >
                        My Contracts
                    </Link>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <ConnectButton />
                </div>
            </nav>
        </div>
    )
}

export default Navbar
