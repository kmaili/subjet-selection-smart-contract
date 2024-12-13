import React, { useState } from "react";
import {getContextById, getContextResults, selectSubject} from "../contracts/contract";

const SubmitToSubject = () => {
    const [contextId, setContextId] = useState("");
    const [contextData, setContextData] = useState(null);
    const [userSubject, setUserSubject] = useState("");
    const [error, setError] = useState("");
    const [results, setResults] = useState(null);

    const handleContextIdChange = (e) => {
        setContextId(e.target.value);
    };

    const fetchContextData = async () => {
        try {
            const response = await getContextById(contextId);
            setContextData(response);
            const res = await getContextResults(contextId);
            setResults(res);
        } catch (err) {
            setError("Context not found or there was an error fetching the data.");
            setContextData(null);
        }
    };

    const handleSubjectChange = (e) => {
        setUserSubject(e.target.value);
    };

    const submitSubject = async () => {
        if (!userSubject) {
            setError("Please select a subject.");
            return;
        }

        try {
            const response = await selectSubject(contextId, userSubject);
            setError(response);
        } catch (err) {
            setError("Unknown error occurred, please try again.");
            console.log(err);
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.mainTitle}>
                    📊 <span>Choisir votre sujet</span>
                </h1>
                <p style={styles.subtitle}>
                    Trouvez un context par son ID et participez à la prise de décision !
                </p>
            </header>

            <div style={styles.inputContainer}>
                <label htmlFor="contextId" style={styles.label}>Entrer L'ID du contexte</label>
                <div style={styles.inputGroup}>
                    <input
                        type="text"
                        id="contextId"
                        value={contextId}
                        onChange={handleContextIdChange}
                        placeholder="ex: 1c01ae8f3"
                        style={styles.input}
                    />
                    <button onClick={fetchContextData} style={styles.button}>
                        Entrer
                    </button>
                </div>
            </div>

            {error && (
                <p
                    style={
                        error === "Sujet sélectionné"
                            ? styles.successMessage
                            : styles.errorMessage
                    }
                >
                    {error}
                </p>
            )}

            {contextData && (
                <div style={styles.contextDataContainer}>
                    <div style={styles.contextHeader}>
                        <h2 style={styles.contextTitle}>{contextData[1]}</h2>
                        <p style={styles.contextId}>🆔 Context ID: {contextData[0]}</p>
                    </div>
                    <p style={styles.creatorInfo}>👤 Created by: {contextData[2]}</p>

                    <div style={styles.subjectsContainer}>
                        {contextData[3] && contextData[3].map((subject) => (
                            <div key={subject} style={styles.subjectItem}>
                                <input
                                    type="radio"
                                    id={subject}
                                    name="userSubject"
                                    value={subject}
                                    onChange={handleSubjectChange}
                                    style={styles.radioButton}
                                />
                                <label htmlFor={subject} style={styles.subjectLabel}>{subject}</label>
                            </div>
                        ))}
                    </div>

                    <button onClick={submitSubject} style={styles.submitButton}>
                        ✅ Submit Your Context
                    </button>

                    {results && (
                        <div style={styles.resultsContainer}>
                            <h4 style={styles.resultsTitle}>Results</h4>
                            <table style={styles.table}>
                                <thead>
                                <tr>
                                    <th style={styles.tableHeader}>User</th>
                                    <th style={styles.tableHeader}>Subject</th>
                                </tr>
                                </thead>
                                <tbody>
                                {results[0] && results[0].map((user, index) => (
                                    <tr key={index} style={styles.tableRow}>
                                        <td style={styles.tableCell}>{user}</td>
                                        <td style={styles.tableCell}>{results[1][index]}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '700px',
        margin: '30px auto',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    mainTitle: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    },
    subtitle: {
        fontSize: '16px',
        color: '#555',
        marginTop: '5px',
    },
    inputContainer: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '16px',
        color: '#333',
        fontWeight: '500',
    },
    inputGroup: {
        display: 'flex',
        gap: '10px',
    },
    input: {
        flex: 1,
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '16px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
    },
    errorMessage: {
        color: '#d9534f',
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '10px',
    },
    successMessage: {
        color: '#3ef801',
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '10px',
    },
    contextDataContainer: {
        marginTop: '20px',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        backgroundColor: '#f9f9f9',
    },
    contextHeader: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    contextTitle: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#333',
    },
    contextId: {
        fontSize: '16px',
        color: '#777',
    },
    creatorInfo: {
        fontSize: '16px',
        color: '#555',
        textAlign: 'center',
        marginBottom: '20px',
    },
    subjectsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    subjectItem: {
        display: 'flex',
        alignItems: 'center',
    },
    radioButton: {
        marginRight: '10px',
        width: '20px',
        height: '20px',
        border: '2px solid #007BFF',
        borderRadius: '50%',
        outline: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s',
        backgroundColor: '#fff',
    },
    radioButtonChecked: {
        backgroundColor: '#007BFF',
        border: '2px solid #007BFF',
    },
    subjectLabel: {
        fontSize: '16px',
        color: '#333',
        cursor: 'pointer',
        userSelect: 'none',
    },
    submitButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s',
        marginTop: '20px',
    },
    resultsContainer: {
        marginTop: '40px',
    },
    resultsTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        backgroundColor: '#007BFF',
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'left',
        padding: '12px',
    },
    tableRow: {
        borderBottom: '1px solid #ddd',
    },
    tableCell: {
        padding: '12px',
        fontSize: '16px',
        color: '#555',
    },
};

export default SubmitToSubject;
