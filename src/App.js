import React, { useState, useEffect } from 'react';
import UserMenu from "./UserMenu";
import { Toaster } from "react-hot-toast";
import { ethers } from "ethers";
import { Buffer } from 'buffer';
import { BrowserRouter } from 'react-router-dom';
import { setCurrentSigner } from "./contracts/contract";

window.Buffer = Buffer;

function App() {
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const connectMetaMask = async () => {
            if (!window.ethereum) {
                alert("MetaMask not detected. Please install MetaMask.");
                return;
            }

            try {
                const browserProvider = new ethers.BrowserProvider(window.ethereum);

                const accounts = await browserProvider.send("eth_requestAccounts", []);
                const userAccount = accounts[0];
                setAccount(userAccount);
                const signer = await browserProvider.getSigner();
                await setCurrentSigner(signer);
            } catch (error) {
                if (error.code === 4001) {
                    console.warn("MetaMask connection request was rejected.");
                } else {
                    console.error("MetaMask connection failed:", error);
                }
            }
        };

        connectMetaMask();
    }, []);

    useEffect(() => {
        if (window.ethereum) {
            const handleAccountChange = (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    // Reload the page when the account changes
                    window.location.reload();
                } else {
                    setAccount(null); // Handle disconnect
                }
            };

            window.ethereum.on("accountsChanged", handleAccountChange);

            return () => {
                window.ethereum.removeListener("accountsChanged", handleAccountChange);
            };
        }
    }, []);

    return (
        <BrowserRouter> {}
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px",
                    backgroundColor: "black",
                    color: "#ffffff",
                }}
            >
                <div style={{ fontSize: "18px" }}>
                    {account ? (
                        <>
                            <span>
                                ID utilisateur:{" "}
                                <strong
                                    style={{
                                        backgroundColor: "#61dafb",
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        color: "#000000",
                                    }}
                                >
                                    {account.slice(0, 6)}...{account.slice(-4)}
                                </strong>
                            </span>
                        </>
                    ) : (
                        <span style={{ color: "red" }}>Not Connected</span>
                    )}
                </div>
            </header>
            <UserMenu />
            <div>
                <Toaster />
            </div>
        </BrowserRouter>
    );
}

export default App;
