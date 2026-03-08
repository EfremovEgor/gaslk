FROM node:24-alpine AS base
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile --silent

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN yarn prisma generate

RUN yarn build

FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
RUN yarn prisma migrate deploy

COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/public ./public
COPY package.json yarn.lock* ./

EXPOSE 3000
CMD ["yarn", "start"]
