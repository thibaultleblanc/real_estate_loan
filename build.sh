#! /bin/bash

docker build --target build -t real_estate_loan:build -f real_estate_loan.dockerfile .
docker build --target production -t real_estate_loan:production -f real_estate_loan.dockerfile .
