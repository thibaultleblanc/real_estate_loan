# Real Estate Loan

Application React + Vite pour simuler un scenario immobilier en 3 etapes.

## Fonctionnalites

- Etape 1 - Salaire: estimation du salaire net retenu pour la banque (brut, statut cadre/non-cadre, primes, impots, PEE/PERCO).
- Etape 2 - Emprunt: estimation du montant empruntable et de la capacite d'achat nette.
  - Parametres: revenu net bancaire, duree (10-25 ans), taux annuel, taux assurance emprunteur, apport, type de logement (neuf/ancien).
  - Resultats: mensualite max, montant empruntable, cout total (interets + assurance separes), frais de notaire, capacite d'achat nette.
  - Graphique camembert interactif avec label central (total rembourse) et legende custom (montant emprunte, interets, assurance).
- Etape 3 - Rentabilite: placeholder pour la future simulation de rentabilite locative.
- Navigation double: onglets cliquables + boutons Precedent / Suivant.
- Persistance automatique locale: le scenario est restaure au rechargement.
- Export / import JSON: sauvegarder et rejouer un scenario.

## Demarrage

Mode dev:

```bash
docker compose up --build web
```

URL: http://localhost:5174

Apercu:

```bash
docker compose up --build preview
```

URL: http://localhost:5174

## Utilisation rapide

1. Completer les champs de Salaire (brut annuel, statut cadre, primes…).
2. Passer a Emprunt: saisir duree, taux credit, taux assurance emprunteur, apport et type de logement.
3. Lire mensualite max, assurance mensuelle, frais de notaire et capacite d'achat nette.
4. Utiliser Exporter JSON pour sauvegarder le scenario.
5. Utiliser Importer JSON pour recharger un scenario.

## Depannage

- Si l'import echoue, verifier que le fichier est un JSON valide.
- Le bouton Reinitialiser recharge les valeurs par defaut du scenario courant.

## Build Docker

```bash
docker compose up --build preview
```

## Tests automatiques

Les tests sont bases sur Vitest + React Testing Library.

Execution dans le conteneur `preview` (pas en local):

```bash
docker compose up -d preview
docker compose exec -e HOME=/tmp -e NPM_CONFIG_CACHE=/tmp/.npm preview npm run test
docker compose exec -e HOME=/tmp -e NPM_CONFIG_CACHE=/tmp/.npm preview npm run test:watch
docker compose exec -e HOME=/tmp -e NPM_CONFIG_CACHE=/tmp/.npm preview npm run test:coverage
```

Build applicatif dans le conteneur:

```bash
docker compose exec -e HOME=/tmp -e NPM_CONFIG_CACHE=/tmp/.npm preview npm run build
```

Le build est bloquant: `npm run build` execute d'abord `lint` puis `test`, puis lance `vite build`.
Le build Docker suit la meme logique: le stage `test` execute lint + tests avant la construction finale.

## Deploiement GitHub Pages

Le depot contient un workflow GitHub Actions dans [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Fonctionnement:

0. Run les tests
1. Un push sur `master` declenche le workflow.
2. Le job installe les dependances dans `real_estate_loan_app`.
3. `npm run deploy` lance d'abord `npm run build` via `predeploy`.
4. Le contenu de `real_estate_loan_app/dist` est publie sur la branche `gh-pages`.

Configuration GitHub a faire une seule fois:

1. Aller dans `Settings > Pages` du depot.
2. Dans `Build and deployment`, choisir `Deploy from a branch`.
3. Selectionner la branche `gh-pages` et le dossier `/ (root)`.

La base Vite est calculee automatiquement pour GitHub Pages:

- repo projet classique: publication sous `/nom-du-repo/`
- repo `username.github.io`: publication a la racine `/`
