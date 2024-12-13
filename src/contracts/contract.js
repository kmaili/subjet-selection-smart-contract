const ethers = require('ethers');

let signer;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

let contractABI = null;
let contract = null;

export async function setCurrentSigner(sig) {
    signer = sig;
}

async function initializeContract() {
    if (!contractABI) {
        try {
            const response = await fetch('/truffle/build/contracts/SubjectSelector.json');
            if (!response.ok) {
                throw new Error('Failed to load ABI');
            }
            const abiData = await response.json();

            if (!Array.isArray(abiData.abi)) {
                throw new Error('ABI is not an array');
            }
            if (!signer) {
                throw new Error("signer not initialized. Please connect using MetaMask.");
            }
            contractABI = abiData.abi;
            contract = new ethers.Contract(contractAddress, contractABI, signer);
        } catch (error) {
            console.error("Error initializing contract:", error);
            throw error;
        }
    }
    return contract;
}
// Fonction pour créer un contexte (anciennement vote)
export async function createContext(title, subjects) {
    const contractInstance = await initializeContract();
    const tx = await contractInstance.createContext(title, subjects);
    await tx.wait();
}

// Fonction pour obtenir un contexte par son ID
export async function getContextById(id) {
    const contractInstance = await initializeContract();
    return await contractInstance.getContextById(id);
}

// Fonction pour que l'utilisateur sélectionne un sujet
export async function selectSubject(contextId, subject) {
    try {
        const contractInstance = await initializeContract();
        const tx = await contractInstance.selectSubject(contextId, subject);
        await tx.wait();
        return "Sujet sélectionné";  // Message de confirmation
    } catch (error) {
        let revertReason = error.info.error.data.data.reason
        switch (revertReason) {
            case "context_not_found":
                return  "Le contexte spécifié n'a pas été trouvé.";
            case "context_not_active":
                return  "Ce contexte n'est plus actif.";
            case "invalid_subject":
                return  "Le sujet sélectionné n'est pas valide pour ce contexte.";
            case "already_voted":
                return  "Vous avez déjà fait un choix pour ce contexte.";
            case "subject_already_taken":
                return  "Ce sujet a déjà été sélectionné par un autre utilisateur.";
            default:
                return "Une erreur inconnue est survenue, veuillez réessayer.";
        }
    }
}

// Fonction pour obtenir les résultats d'un contexte (anciennement vote)
export async function getContextResults(contextId) {
    try {
        const contractInstance = await initializeContract();
        return await contractInstance.getContextResults(contextId);
    } catch (error) {
        console.error("Erreur dans la récupération des résultats :", error);
        throw error;
    }
}

// Fonction pour obtenir les contextes créés par l'utilisateur
export async function getContextsByCreator() {
    try {
        const contractInstance = await initializeContract();
        return await contractInstance.getContextsByCreator();
    } catch (error) {
        console.error("Erreur dans la récupération de mes contextes :", error);
        throw error;
    }
}

// Fonction pour obtenir les contextes auxquels l'utilisateur a participé
export async function getContextsByUser() {
    try {
        const contractInstance = await initializeContract();
        return await contractInstance.getContextsByUser();
    } catch (error) {
        console.error("Erreur dans la récupération des contextes de l'utilisateur :", error);
        throw error;
    }
}
