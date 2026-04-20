# Real Estate Loan

Application React + Vite pour simuler un scenario immobilier en 3 etapes.

## Fonctionnalites

- Etape 1 - Salaire: estimation du salaire net retenu pour la banque.
- Etape 2 - Emprunt: estimation du montant empruntable et de la capacite d'achat.
- Etape 3 - Rentabilite: placeholder pour la future simulation de rentabilite locative.
- Navigation double: onglets cliquables + boutons Precedent / Suivant.
- Persistance automatique locale: le scenario est restaure au rechargement.
- Export / import JSON: sauvegarder et rejouer un scenario.

## Donnees scenario

- Le scenario sauvegarde les entrees metier et l'etape courante.
- Le format exporte est versionne.
- A l'import, les champs inconnus sont ignores et les champs manquants reprennent des valeurs par defaut.

## Demarrage

Mode dev:

```bash
docker compose up --build web
```

URL: http://localhost:5173

Apercu:

```bash
docker compose up --build preview
```

URL: http://localhost:5174

## Utilisation rapide

1. Completer les champs de Salaire.
2. Passer a Emprunt pour obtenir mensualite max et capacite d'achat nette.
3. Utiliser Exporter JSON pour sauvegarder le scenario.
4. Utiliser Importer JSON pour recharger un scenario.

## Depannage

- Si l'import echoue, verifier que le fichier est un JSON valide.
- Le bouton Reinitialiser recharge les valeurs par defaut du scenario courant.

## Build Docker

```bash
docker build --target build -t real_estate_loan:build -f real_estate_loan.dockerfile .
docker build --target production -t real_estate_loan:production -f real_estate_loan.dockerfile .
```

## Tests automatiques

Les tests sont bases sur Vitest + React Testing Library.

Execution dans le conteneur `web` (pas en local):

```bash
docker compose exec -e HOME=/tmp -e NPM_CONFIG_CACHE=/tmp/.npm web npm run test
docker compose exec -e HOME=/tmp -e NPM_CONFIG_CACHE=/tmp/.npm web npm run test:watch
docker compose exec -e HOME=/tmp -e NPM_CONFIG_CACHE=/tmp/.npm web npm run test:coverage
```

Build applicatif dans le conteneur:

```bash
docker compose exec -e HOME=/tmp -e NPM_CONFIG_CACHE=/tmp/.npm web npm run build
```

Le build est bloquant: `npm run build` execute d'abord `lint` puis `test`, puis lance `vite build`.
Le build Docker suit la meme logique: le stage `test` execute lint + tests avant la construction finale.
