# Stage 1: Build the backend
FROM node:12 AS backend-builder
WORKDIR /usr/src/backend
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Build MySQL setup and backend
FROM mysql:latest AS final
ENV DB_HOST="localhost"
ENV DB_USER="root"
ENV DB_PASSWORD=""
ENV PORT_NO="3082"
ENV JWT_KEY="HELLO"
ENV ADMIN_KEY="HELLO"
EXPOSE 3306
COPY --from=backend-builder /usr/src/backend ./
# Additional MySQL setup instructions if needed

# Entry point for the backend container
CMD service mysql start && node index.js