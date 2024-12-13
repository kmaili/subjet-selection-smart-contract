import React, { useState } from "react";
import "./userMenu.css";
import CreateContext from "./menus/CreateContext";
import VoteToAVote from "./menus/SubmitToSubject";
import DisplayCreatedContexts from "./menus/DisplayCreatedContexts";
import DisplayActionsHistory from "./menus/DisplayActionsHistory";

const UserMenu = () => {
    const [activeMenu, setActiveMenu] = useState("main");

    const renderMenu = () => {
        switch (activeMenu) {
            case "createVote":
                return <CreateContext />;
            case "voteToAVote":
                return <VoteToAVote />;
            case "seeCreatedVotes":
                return <DisplayCreatedContexts />;
            case "seeVotesResults":
                return <DisplayActionsHistory />;
            default:
                return (
                    <div className="menu-list">
                        <button onClick={() => setActiveMenu("createVote")} className="menu-item">
                            Créer un contexte
                        </button>
                        <button onClick={() => setActiveMenu("voteToAVote")} className="menu-item">
                            Choisir un sujet
                        </button>
                        <button onClick={() => setActiveMenu("seeCreatedVotes")} className="menu-item">
                            Voir mes contextes
                        </button>
                        <button onClick={() => setActiveMenu("seeVotesResults")} className="menu-item">
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
