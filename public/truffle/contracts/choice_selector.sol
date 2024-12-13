// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SubjectSelector {
    // Structure pour un contexte (anciennement context)
    struct Context {
        string contextId;
        string title;
        string[] subjects; // Liste des sujets (anciennement choix)
        address[] userList; // Liste des utilisateurs ayant choisi un sujet
        mapping(string => bool) subjectExists; // Vérification de l'existence d'un sujet
        mapping(address => string) userSubjects; // Choix de l'utilisateur
        mapping(string => bool) subjectTaken; // Vérification si un sujet a déjà été choisi
        bool active; // Indicateur pour savoir si le contexte est actif
        address creatorId; // Adresse du créateur du contexte
    }

    Context[] private contexts; // Liste des contextes

    // Événement pour la création d'un contexte
    event ContextCreated(string contextId, string title, address creatorId, string[] subjects);
    // Événement lorsque qu'un utilisateur fait un choix
    event SubjectMade(string contextId, address indexed user, string subject);

    // Fonction pour créer un contexte
    function createContext(
        string memory _title,
        string[] memory _subjects
    ) public {
        require(_subjects.length > 0, "At least one subject required");

        string memory contextId = _generateRandomId();
        Context storage newContext = contexts.push();
        newContext.contextId = contextId;
        newContext.title = _title;
        newContext.active = true;
        newContext.creatorId = msg.sender;

        for (uint i = 0; i < _subjects.length; i++) {
            newContext.subjects.push(_subjects[i]);
            newContext.subjectExists[_subjects[i]] = true;
        }

        emit ContextCreated(contextId, _title, msg.sender, _subjects);
    }

    // Fonction pour que l'utilisateur sélectionne un sujet
    function selectSubject(string memory _contextId, string memory _subject) public {
        (Context storage context, bool found) = _findContextById(_contextId);

        require(found, "context_not_found");
        require(context.active, "context_not_active");
        require(context.subjectExists[_subject], "invalid_subject");
        require(bytes(context.userSubjects[msg.sender]).length == 0, "already_contextd");
        require(!context.subjectTaken[_subject], "subject_already_taken");

        context.userSubjects[msg.sender] = _subject;
        context.subjectTaken[_subject] = true;
        context.userList.push(msg.sender); // Ajouter l'utilisateur à la liste des utilisateurs

        emit SubjectMade(_contextId, msg.sender, _subject);
    }

    // Nouvelle fonction pour obtenir les résultats d'un contexte
    function getContextResults(string memory _contextId) public view returns (
        address[] memory users,
        string[] memory selectedSubjects
    ) {
        (Context storage context, bool found) = _findContextById(_contextId);
        require(found, "context_not_found");

        // Obtenir tous les utilisateurs et leurs sujets
        users = context.userList;
        selectedSubjects = new string[](users.length);

        // Obtenir le sujet sélectionné par chaque utilisateur
        for (uint256 i = 0; i < users.length; i++) {
            selectedSubjects[i] = context.userSubjects[users[i]];
        }

        return (users, selectedSubjects);
    }

    // Fonction pour obtenir la liste des sujets d'un contexte
    function getSubjects(string memory _contextId) public view returns (string[] memory) {
        (Context storage context, bool found) = _findContextById(_contextId);
        require(found, "context_not_found");
        return context.subjects;
    }

    // Nouvelle méthode pour retourner tous les contextes créés par l'expéditeur
    function getContextsByCreator() public view returns
        (string[] memory, string[] memory) {
            uint256 count = 0;

            // Compter les contextes créés par l'expéditeur
            for (uint256 i = 0; i < contexts.length; i++) {
                if (contexts[i].creatorId == msg.sender) {
                    count++;
                }
            }

            // Créer des tableaux pour stocker les IDs et titres des contextes
            string[] memory ids = new string[](count);
            string[] memory titles = new string[](count);

            uint256 index = 0;

            // Remplir les tableaux avec les données des contextes créés par l'expéditeur
            for (uint256 i = 0; i < contexts.length; i++) {
                if (contexts[i].creatorId == msg.sender) {
                    ids[index] = contexts[i].contextId;
                    titles[index] = contexts[i].title;
                    index++;
                }
            }

            return (ids, titles);
        }

    // Fonction pour obtenir tous les contextes auxquels un utilisateur a participé
    function getContextsByUser() public view returns (string[] memory, string[] memory) {
        uint256 count = 0;

        // Compter les contextes auxquels l'utilisateur a participé
        for (uint256 i = 0; i < contexts.length; i++) {
            if (bytes(contexts[i].userSubjects[msg.sender]).length > 0) {
                count++;
            }
        }

        // Créer des tableaux pour stocker les IDs des contextes et les choix de l'utilisateur
        string[] memory ids = new string[](count);
        string[] memory titles = new string[](count);

        uint256 index = 0;

        // Remplir les tableaux avec les données des contextes auxquels l'utilisateur a participé
        for (uint256 i = 0; i < contexts.length; i++) {
            if (bytes(contexts[i].userSubjects[msg.sender]).length > 0) {
                ids[index] = contexts[i].contextId;
                titles[index] = contexts[i].title;
                index++;
            }
        }

        return (ids, titles);
    }

    // Fonction pour obtenir le choix d'un utilisateur dans un contexte spécifique
    function getUserSubject(string memory _contextId, address _user) public view returns (string memory) {
        (Context storage context, bool found) = _findContextById(_contextId);
        require(found, "context_not_found");
        return context.userSubjects[_user];
    }

    // Fonction pour obtenir un contexte par son ID
    function getContextById(
        string memory contextId
    ) public view returns (
        string memory returnedContextId,
        string memory title,
        address creatorId,
        string[] memory subjects,
        bool active
    ) {
        (Context storage context, bool found) = _findContextById(contextId);
        require(found, "context_not_found");
        return (
            context.contextId,
            context.title,
            context.creatorId,
            context.subjects,
            context.active
        );
    }

    // Fonction interne pour trouver un contexte par son ID
    function _findContextById(string memory contextId) internal view returns (Context storage, bool) {
        for (uint i = 0; i < contexts.length; i++) {
            if (keccak256(abi.encodePacked(contexts[i].contextId)) == keccak256(abi.encodePacked(contextId))) {
                return (contexts[i], true);
            }
        }
        return (contexts[0], false); // Retourner un contexte invalide si non trouvé
    }

    // Fonction interne pour générer un ID aléatoire
    function _generateRandomId() internal view returns (string memory) {
        bytes memory charset = "abcdefghijklmnopqrstuvwxyz0123456789";
        bytes memory randomId = new bytes(10);
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender)));

        for (uint i = 0; i < 10; i++) {
            randomId[i] = charset[random % charset.length];
            random /= charset.length;
        }
        return string(randomId);
    }
}
