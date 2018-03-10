export default {
    // OmniPro
    Trans: {
        beginning: 'Début',
        cost: 'Coût',
        date: 'Date',
        day: 'jour',
        days: 'jours',
        description: 'Description',
        delete: 'Supprimer',
        'delete.confirm': 'Êtes vous sur de supprimer?',
        download: 'Télécharger',
        end: 'Fin',
        save: 'Enregistrer',
        cancel: 'Annuler',
        total: 'Total',
        notFound: 'Aucun',

        mister: 'Monsieur',
        miss: 'Madame',

        facebook: 'Facebook',
        linkedin: 'Linkedin',
        twitter: 'Twitter',

        matin: 'Matin',
        apresmidi: 'Après-midi',
        refused: 'Refusée',
        approved: 'Acceptée',
        requested: 'En attente',
        accepted: 'Acceptée',

        monday: 'Lundi',
        tuesday: 'Mardi',
        wednesday: 'Mercredi',
        thursday: 'Jeudi',
        friday: 'Vendredi',
        saturday: 'Samedi',
        sunday: 'Dimanche',

        dayNumbersOfMonth: {
            1: 'Premier',
            2: 'Deuxième',
            3: 'Troisième',
            '-1': 'Dernier'
        },

        welcome: 'Bonjour __USER__',

        license: 'PickingAPP-Web - Créé par CORRAL Jonathan et GARAYT Thomas',

        address: 'Adresse',
        'address.street': 'Rue',
        'address.country': 'Pays',
        'address.city': 'Ville',
        'address.postalCode': 'Code Postal',

        error: {
            required: 'Merci de renseigner ce champ',
            'email.invalid': 'E-Mail invalide',
            'phone.invalid': 'Numéro de téléphone invalide',
            'amountquote.invalid': 'Montant de commande invalide',
            'socialSecurityNumber.invalid': 'Numéro de sécurité social invalide',
        },

        advancedSearch: {
            show: 'Filtres Avancés',
            hide: 'Masquer les Filtres',
        },

        window: {
            users: 'Utilisateurs',
            'user.create': 'Créer un Utilisateur',
            'user.edit': 'Modifier un Utilisateur',

            'user.clocking': 'Pointages',
            'user.fee': 'Frais de __USER__ pour __MONTH__ __YEAR__',

            'user.mileageallowance': 'Frais kilométriques',

            roles: 'Roles',
            'role.create': 'Créer un Role',
            'role.edit': 'Modifier un Role',

            contacts: 'Annuaire',
            'contact.create': 'Créer un Contact',
            'contact.edit': 'Modifier un Contact',

            companies: 'Sociétés',
            'company.create': 'Créer une Société',
            'company.edit': 'Modifier une Société',

            minutes: 'Comptes Rendus',
            'minute.create': 'Créer un Compte Rendu',
            'minute.edit': 'Modifier un Compte Rendu',

            reminders: 'Rappels',
            'reminder.create': 'Créer un Rappel',
            'reminder.edit': 'Modifier un Rappel',

            businesses: 'Affaire',
            'business.create': 'Créer une Affaire',
            'business.createInternal': 'Créer une Affaire de Fonctionnement',
            'business.edit': 'Modifier une Affaire',
            'business.createPaymentTerm': 'Créer une Facture',
            'business.editPaymentTerm': 'Modifier une Facture',
            'business.createProviderBill': 'Créer une Facture Fournisseur',
            'business.editProviderBill': 'Modifier une Facture Fournisseur',
            'business.billingRevue': 'Synthèse Facturation',
            'business.providerBillingRevue': 'Facturation Fournisseur',

            workload: 'Plan de Charge',

            adminpanel: 'Admin Panel',
            createbank: 'Créer une banque',
            editbank: 'Modifier une banque',

            absence: 'Gestion des Absences',
            'absence.management': "Compteurs d'absences de __USER__",
        },

        login: {
            username: "Nom d'Utilisateur",
            password: 'Mot de Passe',
            rememberMe: 'Se souvenir de moi',

            'logIn.button': 'Connexion',
            'logOut.button': 'Déconnexion',
            'username.error.required': "Veuillez reseigner votre identifiant",
            'password.error.required': "Veuillez taper votre mot de passe"
        },

        userfee: {
            businessfee: {
                success: {
                    create: {
                        title: 'Ajout Note de frais',
                        content: 'La note de frais a bien été ajouté',
                    },
                    delete: {
                        title: 'Suppression note de frais',
                        content: 'La note de frais de __USER__ a bien été supprimé',
                    },
                },
                error: {
                    create: "Erreur lors de l'ajout",
                    delete: 'Erreur lors de la suppression ',
                },
            },
            mileageallowance: {
                success: {
                    create: {
                        title: 'Ajout Indemnités Kilométrique',
                        content: "L'IK a bien été ajouté",
                    },
                    delete: {
                        title: 'Suppression Indemnités Kilométrique',
                        content: "L'IK de __USER__ a bien été supprimé",
                    },
                },
                error: {
                    create: "Erreur lors de l'ajout",
                    delete: 'Erreur lors de la suppression ',
                },
            },
            foodallowance: {
                success: {
                    create: {
                        title: 'Ajout Panier Repas Déplacement',
                        content: 'Le panier repas a bien été ajouté',
                    },
                    delete: {
                        title: 'Suppression Panier Repas Déplacement',
                        content: 'Le panier repas de __USER__ a bien été supprimé',
                    },
                },
                error: {
                    create: "Erreur lors de l'ajout",
                    delete: 'Erreur lors de la suppression ',
                },
            },
        },

        absence: {
            'icon.title': 'Absences',

            user: 'Utilisateur',

            button: {
                openmanagement: 'Modifier les Compteurs',
                newdayabsence: "Demande d'absence",
                newhourabsence: "Demande d'absence en heures",
                save: 'Envoyer la demande',
            },

            legend: {
                requested: "Demande d'absence en attente de validation",
                validated: 'Absence validée',
            },

            menu: {
                planning: 'Planning',
                counter: 'Solde de Congés',
            },

            success: {
                create: {
                    title: "Demande d'absence envoyée",
                    content: "Votre demande d'absence a bien été envoyé",
                },
                delete: {
                    title: "Demande d'absence supprimée",
                    content: "Votre demande d'absence a bien été supprimée",
                },
                error: {
                    approved: "Erreur lors de la validation de l'absence",
                    refused: "Erreur lors du refus de l'absence",
                },
                approved: {
                    title: "Demande d'absence acceptée",
                    content: "La demande d'absence a bien été acceptée",
                },
                refused: {
                    title: "Demande d'absence refusée",
                    content: "La demande d'absence a été refusée",
                },
            },
        },

        user: {
            'icon.title': 'Utilisateurs',

            identifier: 'Matricule',
            gender: 'Genre',
            contact: 'Contact',
            firstname: 'Prénom',
            lastname: 'Nom',
            birthname: 'Nom de Jeune Fille',
            socialSecurityNumber: 'N° Sécurité Sociale',
            birthDate: 'Date de Naissance',
            placeOfBirth: 'Lieu de Naissance',
            nationality: 'Nationalité',
            username: "Nom d'Utilisateur",
            phoneNumber: 'Téléphone Portable',
            email: 'E-Mail',
            roles: 'Roles',
            'roles.placeholder': 'Sélectionnez des Roles',
            password: 'Mot de Passe',
            oldPassword: 'Ancien Mot de Passe',
            newPassword: 'Mot de Passe',
            repeatNewPassword: 'Confirmer le Mot de Passe',

            dateOfArrival: "Date d'Entrée",
            contractType: 'Type de Contrat',
            dateOfDeparture: 'Date de Fin de Contrat',
            contractDuration: 'Durée du Contrat',
            noticeDuration: 'Durée du Préavis',
            noticeExtension: 'Renouvellement du Préavis',
            manager: 'Responsable Hiérarchique',
            professionalCategory: 'Catégorie Professionnelle',
            professionalFunction: 'Fonction',
            businessPoles: 'Pôles',
            isExposedToRadiation: 'Personnel Exposé',
            carnaxNumber: 'N° CARNAX',
            medicalCardNumber: 'N° Carte Médicale',

            personalPhoneNumber: 'Téléphone Domicile',
            personalEmailAddress: 'Adresse Email Personelle',
            familySituation: 'Situation Familiale',
            countDependantChildren: 'Enfants à Charge',
            drivingLicenseDate: 'Date du Permis de Conduire',
            iban: 'IBAN',
            lastDiploma: 'Dernier Diplôme',
            emergencyContact: "Contact d'Urgence",
            emergencyContactPhoneNumber: "Téléphone du Contact d'Urgence",

            familySituations: {
                married: 'Marié(e)',
                single: 'Célibataire',
            },

            'create.button': 'Créer un Utilisateur',
            'manageRoles.button': 'Gérer les Roles',

            menu: {
                general: 'Général',
                contract: 'Contrat',
                perso: 'Personnel',
                parameters: 'Paramètres',
            },

            success: {
                'create.title': 'Utilisateur Créé',
                'create.content': "L'utilisateur __USER__ a bien été créé",
                'edit.title': 'Utilisateur Modifié',
                'edit.content': "L'utilisateur __USER__ a bien été modifié",
                'delete.title': 'Utilisateur Supprimé',
                'delete.content': "L'utilisateur __USER__ a bien été supprimé",
                'editPassword.title': 'Mot de Passe Modifié',
                'editPassword.content': 'Le mot de passe a bien été modifié',
            },
            error: {
                create: 'Erreur Création Utilisateur',
                edit: 'Erreur Modification Utilisateur',
                delete: 'Erreur Suppression Utilisateur',
                passwordMatch: 'Les mots de passes ne sont pas identiques',
            },
        },
        'user.clocking': {
            'icon.title': 'Pointages',
            business: 'Affaire',
            workingHours: 'Heures Travaillées',
            addBusiness: 'Ajouter une Affaire',

            validate: 'Valider',
            approve: 'Approuver',
            refuse: 'Refuser',

            'refuse.title': 'Refuser les Pointages ?',
            'refuse.placeholder': 'Expliquez les raisons de ce refus...',

            pendingApproval: 'En attente de validation par le responsable',
            approved: 'Pointages validés',

            production: 'Opérationnel',
            internal: 'Absences',

            fees: 'Frais',
            businessFees: 'Frais Réels',
            'fee.add': 'Ajouter un Frais',

            'fee.commuting': 'DDT',
            'fee.commuting.tooltip': 'Déplacement Domicile Travail',
            'fee.foodAllowance': 'Panier Repas',
            showBusinessFeeDetails: 'Détails des frais',
            businessfeemanagement: 'Modifier les frais',
        },
        'user.hours': {
            startDate: 'Du',
            endDate: 'Au',

            addNewHours: 'Ajouter un Horaire',

            help: {
                workingDayTypes: {
                    title: 'Types de Journées de Travail',
                    from: 'de',
                    to: 'à',
                },
            },
        },
        'user.foodAllowance': {
            startDate: 'Du',
            endDate: 'Au',

            foodAllowance: 'Panier Repas',

            addNew: 'Ajouter un Panier Repas',
        },
        'user.commuting': {
            startDate: 'Du',
            endDate: 'Au',

            distance: 'Distance',
            cost: 'Coût Journalier',

            addNew: 'Ajouter un Déplacement Domicile / Travail',
        },
        'user.mileageAllowance': {
            business: 'Affaire',
            cost: 'Montant TTC',
            quantity: 'Quantité',
            unitprice: 'Prix unitaire',
            comment: 'Commentaire',
            departure: 'Départ',
            arrival: 'Arrivé',
            totalKilometers: 'Total km',
            date: 'Date',
            addNewAllowance: 'Ajouter un déplacement',
        },
        'user.fee': {
            mileageallowance: 'Indemnités kilométriques',
            businessfee: 'Note de frais',
            foodAllowance: 'Paniers Repas',
            foodallowancetravel: 'Panier Repas Déplacement',
        },
        'user.absencecounter': {
            user: 'Utilisateur',
            type: 'Type',
            total: 'Total Prévisionnel',
            totalApproved: 'Total Validées',
            totalPending: 'Total En Attente',
            totalRemaining: 'Total Restant',
            periode: 'Période',
            startDate: 'Du',
            endDate: 'Au',
            addNewAbsenceCounter: 'Ajouter un nouveau prévisionnel',
            success: {
                create: {
                    title: 'Prévisionnel Créé',
                    content: 'Le prévisonnel de __USER__ a bien été créé',
                },
                delete: {
                    title: 'Prévisionnel Supprimé',
                    content: 'Le prévisonnel de __USER__ a bien été supprimé',
                },
            },
            error: {
                delete: 'Erreur Suppression Prévisionnel',
                create: 'Erreur Création Prévisionnel',
            },
        },
        'user.businessfee': {
            date: 'Date',
            cost: 'Montant TTC',
            quantity: 'Quantité',
            unitprice: 'Prix Unitaire',
            business: 'Affaire',
            comment: 'Type de Dépense',
            addNewBusinessFee: 'Ajouter une note de frais',
        },
        'user.foodallowance': {
            date: 'Date',
            cost: 'Montant TTC',
            quantity: 'Quantité',
            unitprice: 'Prix Unitaire',
            business: 'Affaire',
            comment: 'Commentaire',
            addNewBusinessFee: 'Ajouter une note de frais',
        },
        'user.absence': {
            userabsence: 'Synthèse des absences',
            newabsence: 'Nouvelle demande de congés',
            startdate: 'Début',
            enddate: 'Fin',
            starthour: 'Heure de début',
            endhour: 'Heure de fin',
            state: 'Status',
            type: "Type d'absence",
        },
        businessClocking: {
            success: {
                'edit.title': 'Pointage Modifié',
                'edit.content': 'Les pointages de __USER__ ont bien été modifiés',
            },
        },
        userFee: {
            success: {
                'edit.title': 'Frais Modifié',
                'edit.content': 'Les frais de __USER__ ont bien été modifiés',
            },
        },
        role: {
            'icon.title': 'Roles',

            title: 'Intitulé',

            'create.button': 'Ajouter un Role',
            success: {
                'create.title': 'Role Créé',
                'create.content': 'Le role __ROLE__ a bien été créé',
                'edit.title': 'Role Modifié',
                'edit.content': 'Le role __ROLE__ a bien été modifié',
                'delete.title': 'Role Supprimé',
                'delete.content': 'Le role __ROLE__ a bien été supprimé',
            },
            error: {
                create: 'Erreur Création Role',
                edit: 'Erreur Modification Role',
                delete: 'Erreur Suppression Role',
            },
            access: {
                read: 'Lire',
                edit: 'Modifier',
                create: 'Ajouter',
                delete: 'Supprimer',
                manage: 'Gérer',
            },

            resource: {
                administration: 'Administration',
                business: 'Affaire',
                businessclocking: 'Pointages',
                company: 'Société',
                contact: 'Contact',
                minute: 'Compte Rendu',
                reminder: 'Rappel',
                role: 'Role',
                user: 'Utilisateur',
                'user-fee': 'Frais',
            },
        },
        company: {
            'icon.title': 'Sociétés',

            name: 'Nom',
            siret: 'N° SIRET',
            siren: 'N° SIREN',
            isClient: 'Client',
            isSupplier: 'Fournisseur',
            address: 'Adresse',
            phone: 'Téléphone',
            fax: 'Fax',
            apeCode: 'Code APE',
            apeLabel: 'Libellé APE',
            website: 'Site web',
            socialnetwork: 'Réseaux sociaux',
            'socialnetwork.url': 'Lien du réseau',
            'address.name': 'Nom',
            'address.siret': 'Siret',
            'address.street': 'Rue',
            'address.city': 'Ville',
            'address.postalCode': 'Code Postal',
            'address.country': 'Pays',
            'address.isHeadquarters': 'Siège',
            'address.isBilling': 'Facturation',
            groups: 'Groupes',

            'groups.placeholder': 'Sélectionnez des groupes...',

            'create.button': 'Créer une Société',
            'addAddress.button': 'Ajouter une Adresse',
            'addSocialnetwork.button': 'Ajouter un réseau social',

            success: {
                'create.title': 'Société Créée',
                'create.content': 'La société __COMPANY__ a bien été créée',
                'edit.title': 'Société Modifiée',
                'edit.content': 'La société __COMPANY__ a bien été modifiée',
                'delete.title': 'Société Supprimée',
                'delete.content': 'La société __COMPANY__ a bien été supprimée',
            },
            error: {
                create: 'Erreur Création Société',
                edit: 'Erreur Modification Société',
                delete: 'Erreur Suppression Société',

                addGroup: 'Erreur Ajout Groupe Société',
                removeGroup: 'Erreur Suppression Groupe Société',

                createAddress: 'Erreur Création Adresse Société',
                editAddress: 'Erreur Modification Adresse Société',
                deleteAddress: 'Erreur Suppression Adresse Société',
            },
        },

        business: {
            'icon.title': 'Affaire',
            'billingRevue.icon.title': 'Synthèse Facturation',
            'providerBillingRevue.icon.title': 'Facturation Fournisseur',

            type: 'Type',
            reference: 'N° Affaire',
            title: 'Désignation',
            amountQuote: 'Montant Commande',
            referenceQuote: 'N° Commande',
            amountBudget: 'Montant Budget',
            state: 'Etat',
            result: 'Résultat',
            pole: 'Pôle',
            client: 'Client',
            finalClient: 'Client Final',
            representative: 'Interlocuteur',
            tenderingProcess: "Appel d'Offre",
            tenderingProcessDate: 'Echéance',
            tenderingProcessReceptionDate: 'Date de Réception',
            tenderingProcessReference: 'Référence',
            isClockable: 'Autoriser le pointage',
            remainingBill: 'Reste à Facturer',

            'create.button': 'Créer une Affaire',
            'createInternal.button': 'Créer une Affaire de Fonctionnement',

            'info.title': 'Généralités',
            'paymentTerm.title': 'Facturation',
            'providerBill.title': 'Facturation Fournisseur',
            'minute.title': 'Suivis',

            types: {
                all: 'Tous',
                internal: 'Fonctionnement',
                production: 'Opérationnel',
            },

            states: {
                waiting: 'En Attente',
                costing: 'Chiffrage',
                progress: 'En Cours',
                closed: 'Clôturée',
                archived: 'Archivée',
            },

            results: {
                win: 'Gagnée',
                loose: 'Perdue',
            },

            success: {
                'create.title': 'Affaire Créée',
                'create.content': "L'affaire __BUSINESS__ a bien été créée",
                'edit.title': 'Affaire Modifiée',
                'edit.content': "L'affaire __BUSINESS__ a bien été modifiée",
                'delete.title': 'Affaire Supprimée',
                'delete.content': "L'affaire __BUSINESS__ a bien été supprimée",
            },
            error: {
                create: 'Erreur Création Affaire',
                edit: 'Erreur Modification Affaire',
                delete: 'Erreur Suppression Affaire',
            },
        },

        'business.paymentTerm': {
            reference: 'Référence',
            description: 'Libellé',
            percentage: '% facturation',
            etprice: 'Montant HT',
            atiprice: 'Montant TTC',
            forecastDate: 'Date Facturation',
            collectionDate: 'Date Encaissement',
            bankToCredit: 'Banque à Créditer',

            forecastBillingDate: 'Date de facturation',
            forecastCollectionDate: "Date d'encaissement",

            'create.button': 'Créer une Facturation',

            success: {
                'create.title': 'Facture Créée',
                'create.content': 'La facture a bien été créée',

                'edit.title': 'Facture Modifiée',
                'edit.content': 'La facture a bien été modifiée',

                'delete.title': 'Facture Supprimée',
                'delete.content': 'La facture a bien été supprimée',
            },
            error: {
                create: 'Erreur Création Facture',
                edit: 'Erreur Modification Facture',
                delete: 'Erreur Suppression Facture',
                receiptDateBeforeFC:
                    "La date de reception doit être plus grande que la date d'emission",
            },
        },

        'business.providerBill': {
            business: 'Affaire',
            reference: 'Référence',
            internalReference: 'Référence Interne',
            description: 'Libellé',
            percentage: '% facturation',
            amount: 'Montant',
            amountByOccurence: 'Montant par période',
            etprice: 'Montant HT',
            atiprice: 'Montant TTC',
            billDate: 'Date Facturation',
            disbursementDate: 'Date Décaissement',
            receiptDate: 'Date Réception',
            paymentDate: 'Date Règlement',
            bankToDebit: 'Banque à Débiter',
            provider: 'Fournisseur',
            providerBillNumber: 'N° Factu. Fournisseur',
            internalBillNumber: 'N° Factu. Interne',
            paymentType: 'Mode de Paiement',
            paymentTypes: {
                payment_card: 'CB',
                levy: 'Prélèvement',
                cheque: 'Chèque',
                trasnfer: 'Virement'
            },
            periodicities: {
                monthly: 'Mensuel',
                quaterly: 'Trimestriel',
                bi_annual: 'Semestriel',
            },
            chequeNumber: 'N° Chèque',
            periodicity: 'Périodicité',
            endPeriodDate: "Jusqu'au",

            forecastBillingDate: 'Date de facturation',
            forecastCollectionDate: "Date d'encaissement",

            'create.button': 'Créer une Facturation Fournisseur',

            success: {
                'create.title': 'Facture Créée',
                'create.content': 'La facture a bien été créée',

                'edit.title': 'Facture Modifiée',
                'edit.content': 'La facture a bien été modifiée',

                'delete.title': 'Facture Supprimée',
                'delete.content': 'La facture a bien été supprimée',
            },
            error: {
                create: 'Erreur Création Facture',
                edit: 'Erreur Modification Facture',
                delete: 'Erreur Suppression Facture',
                receiptDateBeforeBill:
                    "La date de décaissement doit être plus grande que la date de réception",
            },
        },

        contact: {
            'icon.title': 'Annuaire',

            firstname: 'Prénom',
            lastname: 'Nom',
            groups: 'Groupes',
            communityGroups: 'Groupes Associatifs',
            phone: 'Téléphone',
            'phone.value': 'N° de téléphone',
            'phone.type': 'Catégorie',
            email: 'E-Mail',
            'email.value': 'Adresse E-Mail',
            'email.type': 'Catégorie',
            comment: 'Commentaire',

            'company.placeholder': 'Sélectionnez une société',
            'companyAddress.placeholder': 'Sélectionnez l\'établissement',
            'groups.placeholder': 'Sélectionnez des groupes',

            'create.button': 'Créer un Contact',
            'manageCompanies.button': 'Sociétés',
            'addPhone.button': 'Ajouter un Téléphone',
            'addEmail.button': 'Ajouter une Adresse E-Mail',

            'showMinutes.button.tooltip': 'Voir les Comptes Rendus',
            'backToContact.button.tooltip': 'Retourner au Contact',

            phoneType: {
                portable: 'Portable',
                office: 'Bureau',
                perso: 'Perso',
                pro: 'Pro',
            },
            emailType: {
                office: 'Bureau',
                perso: 'Perso',
                pro: 'Pro',
            },

            success: {
                'create.title': 'Contact Créé',
                'create.content': 'Le contact __CONTACT__ a bien été créé',

                'edit.title': 'Contact Modifié',
                'edit.content': 'Le contact __CONTACT__ a bien été modifié',

                'delete.title': 'Contact Supprimé',
                'delete.content': 'Le contact __CONTACT__ a bien été supprimé',
            },
            error: {
                create: 'Erreur Création Contact',
                edit: 'Erreur Modification Contact',
                delete: 'Erreur Suppression Contact',

                createEmail: 'Erreur Création E-Mail Contact',
                editEmail: 'Erreur Modification E-Mail Contact',
                deleteEmail: 'Erreur Suppression E-Mail Contact',

                createPhone: 'Erreur Création Téléphone Contact',
                editPhone: 'Erreur Modification Téléphone Contact',
                deletePhone: 'Erreur Suppression Téléphone Contact',

                addGroup: 'Erreur Ajout Groupe Contact',
                removeGroup: 'Erreur Suppression Groupe Contact',
            },
        },
        minute: {
            'icon.title': 'Compte Rendus',

            date: 'Date',
            title: 'Intitulé',
            contacts: 'Contacts',
            users: 'Utilisateurs',
            content: 'Corps',
            topic: 'Objet',
            category: 'Catégorie',
            business: 'Affaire',

            'create.button': 'Créer un Compte Rendu',

            'category.placeholder': 'Sélectionnez une catégorie',
            'topic.placeholder': 'Sélectionnez un objet',
            'contacts.placeholder': 'Sélectionnez des contacts',
            'users.placeholder': 'Sélectionnez des utilisateurs',
            'business.placeholder': 'Sélectionnez une affaire',

            'createReminder.button.tooltip': 'Ajouter un Rappel',

            categories: {
                meeting: 'Réunion',
                interview: 'Entretien',
                phone: 'Téléphone',
                email: 'E-Mail',
                visit: 'Visite',
            },
            topics: {
                business: 'Commercial',
                project: 'Avancement Projet',
            },
            success: {
                'create.title': 'Compte Rendu Créé',
                'create.content': 'Le compte rendu __MINUTE__ a bien été créé',
                'edit.title': 'Compte Rendu Modifié',
                'edit.content': 'Le compte rendu __MINUTE__ a bien été modifié',
                'delete.title': 'Compte Rendu Supprimé',
                'delete.content': 'Le compte rendu__MINUTE__ a bien été supprimé',
            },
            error: {
                create: 'Erreur Création Compte Rendu',
                edit: 'Erreur Modification Compte Rendu',
                delete: 'Erreur Suppression Compte Rendu',

                addContact: 'Erreur Ajout Contact Compte Rendu',
                removeContact: 'Erreur Suppression Contact Compte Rendu',

                addUser: 'Erreur Ajout Utilisateur Compte Rendu',
                removeUser: 'Erreur Suppression Utilisateur Compte Rendu',
            },
        },
        reminder: {
            'icon.title': 'Rappels',

            date: 'Date',
            relaunch: 'Nombre de jours avant rappel',
            title: 'Intitulé',
            creator: 'Créateur',
            content: 'Corps',
            'create.button': 'Créer un Rappel',

            minute: 'Compte Rendu',
            'showMinutes.button.tooltip': 'Voir le compte rendu',

            success: {
                'create.title': 'Rappel Créé',
                'create.content': 'Le rappel __REMINDER__ a bien été créé',
                'edit.title': 'Rappel Modifié',
                'edit.content': 'Le rapel __REMINDER__ a bien été modifié',
                'delete.title': 'Rappel Supprimé',
                'delete.content': 'Le rappel __REMINDER__ a bien été supprimé',
            },
            error: {
                create: 'Erreur Création Rappel',
                edit: 'Erreur Modification Rappel',
                delete: 'Erreur Suppression Rappel',
            },
        },
        workload: {
            'icon.title': 'Plan de Charge',
        },
        bank: {
            'name': 'Nom',
            'iban': 'IBAN',
            'bic': 'BIC',
            'isDefaultCreditBank': 'Banque à créditer par défaut',
            'establishmentCode': 'Code d\'établissement',
            'sortCode': 'Code Sort',
            'street': 'Rue',
            'city': 'Ville',
            'accountNumber': 'Numéro de compte',
            'riceCode': 'Code Rice',
            'postalCode': 'Code postal',
            'country': 'Pays',
            'phone': 'Téléphone',
            'email': 'Email',
            'create.button': 'Ajouter une banque',
            error: {
                'create': 'Erreur Création Banque',
                'edit': 'Erreur Modification Banque',
                'delete': 'Erreur Suppression Banque',
            },
            success: {
                'create.title': 'Banque créée',
                'create.content': 'La banque __BANK__ a bien été créée',
                'edit.title': 'Banque Modifiée',
                'edit.content': 'La banque __BANK__ a bien été modifiée',
                'delete.title': 'Banque supprimée',
                'delete.content': 'La banque __BANK__ a bien été supprimée',
            },
        },
        adminpanel: {
            'icon.title': 'Admin Panel',
            'menu.financier': 'Financier',
            'menu.comptabilite': 'Comptabilité',
            'menu.facturation': 'Facturation',
        },
        reference: {
            'type': 'Type',
            'format': 'Format',
            'type.provider_bill': 'Facture fournisseur',
            'type.payment_term': 'Termes de paiments',
            'type.business': 'Affaire',
        },
    },

    // Ant Design
    Table: {
        filterTitle: 'Rechercher...',
        filterConfirm: 'OK',
        filterReset: 'Réinitialiser',
        emptyText: 'Aucune donnée',
    },
    Modal: {
        okText: 'OK',
        cancelText: 'Annuler',
        justOkText: 'OK',
    },
    Popconfirm: {
        okText: 'OK',
        cancelText: 'Annuler',
    },
    Transfer: {
        notFoundContent: 'Pas de résultat',
        searchPlaceholder: 'Recherche',
        itemUnit: 'élément',
        itemsUnit: 'éléments',
    },
    Select: {
        notFoundContent: 'Pas de résultat',
    },
    Pagination: {
        // Options.jsx
        items_per_page: '/ page',
        jump_to: 'Allez à',
        page: '',

        // Pagination.jsx
        prev_page: 'Page Précédente',
        next_page: 'Page Suivante',
        prev_5: '5 Pages Précédentes',
        next_5: '5 Pages Suivantes',
        prev_3: '3 Pages Précédentes',
        next_3: '3 Pages Suivantes',
    },
    TimePicker: {
        placeholder: '',
    },
    DatePicker: {
        lang: {
            today: "Aujourd'hui",
            now: 'Maintenant',
            backToToday: "Retour à aujourdh'hui",
            ok: 'Ok',
            clear: 'Vider',
            month: 'Mois',
            year: 'Année',
            timeSelect: "Sélectionner l'heure",
            dateSelect: 'Sélectionner une date',
            monthSelect: 'Sélectionner un mois',
            yearSelect: 'Sélectionner une année',
            decadeSelect: 'Sélectionner une décénie',
            yearFormat: 'YYYY',
            dateFormat: 'M/D/YYYY',
            dayFormat: 'D',
            dateTimeFormat: 'M/D/YYYY HH:mm:ss',
            monthFormat: 'MMMM',
            monthBeforeYear: true,
            previousMonth: 'Mois précédent (PageUp)',
            nextMonth: 'Mois suivant (PageDown)',
            previousYear: 'Année précédente (Control + left)',
            nextYear: 'Année suivante (Control + right)',
            previousDecade: 'Décennie précédente',
            nextDecade: 'Décennie suivante',
            previousCentury: 'Siècle précédent',
            nextCentury: 'Siècle suivant',

            placeholder: 'Sélectionnez une date',
            rangePlaceholder: ['Date de début', 'Date de fin'],
        },
    },
};
