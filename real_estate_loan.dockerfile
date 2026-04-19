# Dev Stage
FROM node:24-alpine AS dev
WORKDIR /app
COPY real_estate_loan_app/package*.json ./
RUN npm ci --no-audit --fund=false
COPY real_estate_loan_app /app

# Build Stage
FROM dev AS build
RUN npm run build

# Production Stage
FROM nginx:1.29.8-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]