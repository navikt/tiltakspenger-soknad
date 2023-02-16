# Søknad om tiltakspenger

Frontend-kode for søknad om tiltakspenger

# Komme i gang

For å kjøre opp appen i dev:

```
npm install
npm run dev
```

### Kjøre opp docker-compose lokalt

Autentisering og TokenX er mocket ut med docker-compose i `./docker-compose` på rot av repoet. 
Dette oppsettet antar at man har [tiltakspengesoknad-api](https://github.com/navikt/tiltakspengesoknad-api)
liggende på `../` relativt til tiltakspengesoknad.

For at det skal kunne kjøres opp lokalt må man også sette opp noen miljøvariabler for selve NextJS-appen, i tillegg til en
miljøvariabel for [Wonderwall](https://github.com/nais/wonderwall) som er mocket ut i docker-compose oppsettet.

1. Opprett en `.env.local` fil på rot av repoet, og legg inn følgende miljøvariabler:
    ```
    TILTAKSPENGESOKNAD_API_URL=http://localhost:8080
    TOKEN_X_CLIENT_ID=localhost:tpts:tiltakspengesoknad
    TOKEN_X_PRIVATE_JWK='<generert JWK>'
    TOKEN_X_TOKEN_ENDPOINT=http://host.docker.internal:6969/idporten/token
    NAIS_CLUSTER_NAME=localhost
    ```
2. Og opprett en fil på `./docker-compose/.env` med følgende innhold:
    ```
    WONDERWALL_OPENID_CLIENT_JWK=<generert JWK>
    ```
3. Sørg for at tiltakspengesoknad-api ligger på `../` relativt til tiltakspengesoknad repoet.
4. Spinn opp containere med 
    ```
    cd ./docker-compose
    docker-compose up -d --build
    ```
5. Kjør opp frontend på vanlig måte med `npm run dev` på rot av repoet 
6. :rocket: Gå på localhost:2222 (dette gjør at man treffer Wonderwall)

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen #tpts-tech.
