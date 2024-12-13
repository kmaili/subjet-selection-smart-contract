import React, { useEffect, useState } from "react";
import {getContextResults, getContextsByUser} from "../contracts/contract";

const DisplayActionsHistory = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVote, setSelectedVote] = useState(null);
    const [results, setResults] = useState(null);
    const [votes, setVotes] = useState([[], []]);

    useEffect(() => {
        const fetchVotes = async () => {
            const response = await getContextsByUser();
            setVotes(response);
        };
        fetchVotes();
    }, []);

    const openModal = async (voteId, title) => {
        const actualResults = await getContextResults(voteId);
        setResults(actualResults);
        setSelectedVote(title);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVote(null);
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={styles.mainTitle}>Vos choix de sujets dans les contextes</h2>
                <p style={styles.subtitle}>
                    Ici, vous trouverez vos choix de sujets dans les contextes.
                </p>
            </header>

            <div style={styles.voteGrid}>
                {votes[0].map((voteId, index) => (
                    <div
                        key={voteId}
                        style={styles.voteSquare}
                        onClick={() => openModal(voteId, votes[1][index])}
                    >
                        <h3 style={styles.voteTitle}>{votes[1][index]}</h3>
                        <p style={styles.voteId}>
                            <span><img src={"./assets/id.png"} alt={"id"}/></span>
                            <span>{voteId}</span>
                        </p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div style={styles.modalBackdrop}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>{selectedVote} - Results</h3>
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
    voteGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
        justifyContent: "center",
        marginTop: "20px",
    },
    voteSquare: {
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
    voteId: {
        backgroundColor: "#FFFFFF",
        padding: "15px",
        color: "#007BFF",
        borderRadius: "25px",
        display: "flex",
        gap: "5%"
    },
    voteTitle: {
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

export default DisplayActionsHistory;
