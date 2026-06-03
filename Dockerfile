FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM node:20-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npm run build

FROM python:3.11-slim AS ai
WORKDIR /app/ai-engine
COPY ai-engine/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ai-engine/ .

FROM node:20-alpine
WORKDIR /app
COPY --from=frontend /app/frontend/.next ./.next
COPY --from=frontend /app/frontend/public ./public
COPY --from=frontend /app/frontend/package.json ./package.json
COPY --from=frontend /app/frontend/node_modules ./node_modules

COPY --from=backend /app/backend/dist ./backend/dist
COPY --from=backend /app/backend/package.json ./backend/package.json
COPY --from=backend /app/backend/node_modules ./backend/node_modules

EXPOSE 3000 4000 8000

CMD ["sh", "-c", "node backend/dist/index.js & cd /app && npm start"]
