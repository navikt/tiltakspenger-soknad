# Distroless har ingen semver-tagger — versjonen ligger i repo-navnet (nodejs24-debian13) — så taggen er `latest`.
# Digesten er det som faktisk kjører; taggen er det Dependabot følger, og gir PR når `latest` flyttes.
FROM gcr.io/distroless/nodejs24-debian13:latest@sha256:b1fc33242cc74151f50c62b4a03d48afd759dccf81279b5f8e401db4546479c1

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

# Entrypointet i distroless er node, så CMD er bare skriptet.
CMD ["server.js"]
