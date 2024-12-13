import React, { useState } from "react";
import "./userMenu.css";
import CreateContext from "./menus/CreateContext";
import DisplayCreatedContexts from "./menus/DisplayCreatedContexts";
import DisplayActionsHistory from "./menus/DisplayActionsHistory";
import SubmitToSubject from "./menus/SubmitToSubject";

const UserMenu = () => {
    const [activeMenu, setActiveMenu] = useState("main");

    const renderMenu = () => {
        switch (activeMenu) {
            case "createContext":
                return <CreateContext />;
            case "submitToSubject":
                return <SubmitToSubject />;
            case "displayCreatedContexts":
                return <DisplayCreatedContexts />;
            case "displayActionsHistory":
                return <DisplayActionsHistory />;
            default:
                return (
                    <div className="menu-list">
                        <button onClick={() => setActiveMenu("createContext")} className="menu-item">
                            Créer un contexte
                        </button>
                        <button onClick={() => setActiveMenu("submitToSubject")} className="menu-item">
                            Choisir un sujet
                        </button>
                        <button onClick={() => setActiveMenu("displayCreatedContexts")} className="menu-item">
                            Voir mes contextes
                        </button>
                        <button onClick={() => setActiveMenu("displayActionsHistory")} className="menu-item">
                            Historique des choix
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="user-menu">
            <header className="user-menu-header">
                <h1>Tableau de bord utilisateur</h1>
                {activeMenu !== "main" && (
                    <button className="back-button" onClick={() => setActiveMenu("main")}>
                        Retour
                    </button>
                )}
            </header>
            {renderMenu()}
        </div>
    );
};

export default UserMenu;
