#! /bin/bash

docker build --target build -t real_estate_loan:build -f real_estate_loan.dockerfile .
docker run -it --rm --name real_estate_loan_app -p 5173:5173 -v $(pwd)/real_estate_loan_app:/app -w /app real_estate_loan:build npm run dev -- --host
