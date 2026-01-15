FROM node:24-alpine

WORKDIR /usr/app

COPY package.json .
COPY next.config.js .
COPY .next/standalone ./
COPY .next/static ./.next/static

ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV NODE_ENV=production
ENV TZ=Europe/Oslo

EXPOSE 3000

CMD ["node", "server.js"]
