import React, { useEffect, useState } from "react";
import {getContextResults, getContextsByCreator} from "../contracts/contract";

const DisplayCreatedContexts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContext, setSelectedContext] = useState(null);
    const [results, setResults] = useState(null);
    const [contexts, setContexts] = useState([[], []]);

    const copyToClipboard = (id) => {
        navigator.clipboard.writeText(id)
            .then(() => {
                alert("Copied to clipboard!");
            })
            .catch((error) => {
                console.error("Failed to copy text to clipboard:", error);
            });
    };

    useEffect(() => {
        const fetchContexts = async () => {
            const response = await getContextsByCreator();
            setContexts(response);
        };
        fetchContexts();
    }, []);

    const openModal = async (contextId, title) => {
        const actualResults = await getContextResults(contextId);
        setResults(actualResults);
        setSelectedContext(title);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedContext(null);
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={styles.mainTitle}>Résultats des contextes créés</h2>
                <p style={styles.subtitle}>
                    Ici, vous pouvez voir les résultats des contextes que vous avez créés.
                </p>
            </header>

            <div style={styles.contextGrid}>
                {contexts[0].map((contextId, index) => (
                    <div
                        key={contextId}
                        style={styles.contextSquare}
                        onDoubleClick={() => openModal(contextId, contexts[1][index])}
                    >
                        <h3 style={styles.contextTitle}>{contexts[1][index]}</h3>
                        <p style={styles.contextId}>
                            <span onClick={()=>copyToClipboard(contextId)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-clipboard" viewBox="0 0 16 16">
                                      <path
                                          d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                                      <path
                                          d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                                </svg>
                            </span>
                            <span>{contextId}</span>
                        </p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div style={styles.modalBackdrop}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>{selectedContext} - Results</h3>
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th style={styles.tableHeader}>User</th>
                                <th style={styles.tableHeader}>Subject</th>
                            </tr>
                            </thead>
                            <tbody>
                            {results[0] &&
                                results[0].map((user, index) => (
                                    <tr key={index} style={styles.tableRow}>
                                        <td style={styles.tableCell}>{user}</td>
                                        <td style={styles.tableCell}>
                                            {results[1][index]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={closeModal} style={styles.closeButton}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "30px auto",
        padding: "20px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
    },
    header: {
        textAlign: "center",
        marginBottom: "30px",
    },
    mainTitle: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#333",
    },
    subtitle: {
        fontSize: "16px",
        color: "#555",
        marginTop: "5px",
    },
    contextGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
        justifyContent: "center",
        marginTop: "20px",
    },
    contextSquare: {
        padding: "20px",
        backgroundColor: "#007BFF",
        borderRadius: "8px",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        transition: "transform 0.3s",
    },
    contextId: {
        backgroundColor: "#FFFFFF",
        padding: "15px",
        color: "#007BFF",
        borderRadius: "25px",
        display: "flex",
        gap: "5%"
    },
    contextTitle: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    modalBackdrop: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
        width: "500px",
    },
    modalTitle: {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
    },
    closeButton: {
        padding: "10px 20px",
        backgroundColor: "#f44336",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "20px",
        display: "block",
        width: "100%",
        transition: "all 0.3s",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
    },
    tableHeader: {
        backgroundColor: "#007BFF",
        color: "#fff",
        fontWeight: "bold",
        textAlign: "left",
        padding: "12px",
    },
    tableRow: {
        borderBottom: "1px solid #ddd",
    },
    tableCell: {
        padding: "12px",
        fontSize: "16px",
        color: "#555",
    },
};

export default DisplayCreatedContexts;
