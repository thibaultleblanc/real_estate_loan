# Build Stage
FROM node:24-alpine AS build
WORKDIR /app
COPY real_estate_loan_app/package*.json ./
RUN npm install
COPY real_estate_loan_app /app
RUN npm run build

# Production Stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]