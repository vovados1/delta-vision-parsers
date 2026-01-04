# syntax=docker/dockerfile:1

# ============================================
# Stage 1: Install dependencies
# ============================================
FROM node:22-alpine AS deps

# Enable corepack for pnpm (matches packageManager in package.json)
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

WORKDIR /app

# Copy only dependency files first (better layer caching)
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# ============================================
# Stage 2: Production runtime
# ============================================
FROM node:22-alpine AS runner

# Install pnpm in runtime stage (needed for pnpm start)
RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 app
USER app

# Copy dependencies from deps stage
COPY --from=deps --chown=app:nodejs /app/node_modules ./node_modules

# Copy application source
COPY --chown=app:nodejs package.json ./
COPY --chown=app:nodejs src ./src

# Environment variables for exchange and pairs (set in docker-compose)
ENV EXCHANGE=""
ENV PAIRS=""

# InfluxDB connection (override in docker-compose)
ENV INFLUXDB_URL=""
ENV INFLUXDB_TOKEN=""
ENV INFLUXDB_ORG_NAME=""
ENV INFLUXDB_BUCKET_NAME=""

# Start the parser with exchange and pairs from environment
CMD pnpm start --exchange=${EXCHANGE} --pairs=${PAIRS}

