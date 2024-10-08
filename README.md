# Projet CEF Knowledge-Learning

Ce projet est une application full stack développée dans le cadre d'une formation au CEF (Centre Européen de Formation). L'application vise à faciliter l'apprentissage et le partage de connaissances.

## Description du projet

Knowledge-Learning est une plateforme interactive conçue pour permettre aux utilisateurs de créer, partager et acquérir des connaissances dans divers domaines. L'application offre une interface pour la gestion de cours.

## Fonctionnalités principales

- Création et gestion de cours
- Espace utilisateur personnalisé
- Interface d'administration pour la gestion du contenu
- Suivi de statics clés

## Technologies utilisées

### Frontend
- Angular

### Backend
- Node.js avec Express.js
- MariaDB pour la base de données
- JWT pour l'authentification

### Outils de développement
- Docker pour la conteneurisation
- Git pour le contrôle de version
- ESLint pour le linting du code

## Prérequis

- Docker et Docker Compose installés sur votre machine
- Git pour cloner le repository

## Installation et lancement

1. Clonez le repository :

````
git clone https://github.com/HugoMelin/Projet_CEF_Knowledge-Learning.git
````

2. Naviguez dans le dossier du projet :

````
cd Projet_CEF_Knowledge-Learning
````

3. Lancez l'application avec Docker Compose :

````
docker-compose up -d
````


Cette commande va construire les images Docker nécessaires et démarrer les conteneurs pour le frontend, le backend, la base de données MariaDB, PhpMyAdmin et MailHog.

4. L'application sera accessible à l'adresse suivante :
- Frontend : http://localhost:4200
- Backend API : http://localhost:3000
- Gestion de la base de donnée : http://localhost:8080
- Capture des mails : http://localhost:8025

Pour arrêter l'application, utilisez la commande :

````
docker-compose down
````

## Structure du projet

Le projet est organisé en trois parties principales :

- `/frontend` : Contient le code source de l'interface utilisateur Angular
- `/backend` : Contient le code source du serveur Node.js et l'API
- `/docker-entrypoint-initdb` : Contient les scripts d'initialisation de la base de données MariaDB

## Accès à l'application

- Database:
````
- Identifiant: hmelin
- Password: hmelin
````

- Utilisateur administrateur: 
````
- Email: admin@mail.fr
- Password: Adminpass123
````

- Utilisatteur classique:
````
- Email: user@mail.fr
- Password: Userpass123
````

## Peupler la base de données

La base de données devrait être peuplée au build du container Docker. 

Le cas échéant, vous trouverez les fichiers .sql pour initialiser la bdd dans le dossier : `./backend/database`

## Carte de payement factice

- Payement accepté : 
````
4242 4242 4242 4242
````

- Payement refusé :
````
4000 0000 0000 0002
````

## Accès à la documentation de l'API

Vous trouverez la documentation de l'API au chemin suivant : `http://localhost:3000/docs/`

## Contribution

Ce projet a été développé par Hugo Melin dans le cadre d'une formation au CEF. Les contributions externes ne sont pas acceptées pour le moment.

## Licence

Ce projet est à usage éducatif et n'est pas sous licence open source. Tous droits réservés.