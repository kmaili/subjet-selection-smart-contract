import React, { useState } from "react";
import {createContext} from "../contracts/contract";
import toast from "react-hot-toast";

const CreateContext = () => {
    const [title, setTitle] = useState("");
    const [subjects, setSubjects] = useState([""]);
    const handleTitleChange = (e) => setTitle(e.target.value);

    const handleSubjectChange = (index, value) => {
        const updatedSubjects = [...subjects];
        updatedSubjects[index] = value;
        setSubjects(updatedSubjects);
    };

    const addSubject = () => setSubjects([...subjects, ""]);

    const deleteSubject = (index) => {
        const updatedSubjects = subjects.filter((_, i) => i !== index);
        setSubjects(updatedSubjects);
    };

    const handleSubmit = async () => {
        if (!title || subjects.some((subject) => !subject.trim())) {
            toast("Veuillez remplir le titre et toutes les options.", {
                icon: "⚠️",
            });
            return;
        }
        await createContext(title, subjects);
        toast.success('Contexte créé avec succès !');
    };

    return (
        <div style={styles.container}>
            <h2 style={{color: "black"}}>Créer un contexte</h2>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Entrer le titre"
                    style={styles.titleInput}
                />
            </div>
            <div>
                <br/>
                {subjects.map((subject, index) => (
                    <div key={index} style={styles.subjectContainer}>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => handleSubjectChange(index, e.target.value)}
                            placeholder={`Choix ${index + 1}`}
                            style={styles.subjectInput}
                        />
                        <button
                            style={styles.deleteButton}
                            onClick={() => deleteSubject(index)}
                            disabled={subjects.length === 1}
                        >
                            Supprimer
                        </button>
                    </div>
                ))}
                <button style={styles.addButton} onClick={addSubject}>
                    Ajouter
                </button>
            </div>
            <button style={styles.submitButton} onClick={handleSubmit}>
                Valider
            </button>
        </div>
    );
};

export default CreateContext;

const styles = {
    container: {
        maxWidth: "600px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    inputContainer: {
        marginBottom: "20px",
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
    },
    titleInput: {
        width: "95%",
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "4px",
    },
    subjectContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
    },
    subjectInput: {
        flex: 1,
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginRight: "10px",
    },
    deleteButton: {
        backgroundColor: "#e74c3c",
        color: "white",
        border: "none",
        padding: "8px 12px",
        fontSize: "14px",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    deleteButtonDisabled: {
        opacity: 0.6,
        cursor: "not-allowed",
    },
    addButton: {
        display: "block",
        marginTop: "10px",
        padding: "10px 15px",
        fontSize: "16px",
        backgroundColor: "#3498db",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    submitButton: {
        display: "block",
        marginTop: "20px",
        width: "100%",
        padding: "12px",
        fontSize: "18px",
        backgroundColor: "#2ecc71",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
};
