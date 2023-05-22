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
Dette oppsettet antar at man har [tiltakspenger-soknad-api](https://github.com/navikt/tiltakspenger-soknad-api)
liggende på `../` relativt til tiltakspenger-soknad.

For at det skal kunne kjøres opp lokalt må man også sette opp noen miljøvariabler for selve NextJS-appen, i tillegg til en
miljøvariabel for [Wonderwall](https://github.com/nais/wonderwall) som er mocket ut i docker-compose oppsettet.

1. Opprett en `.env.local` fil på rot av repoet, og legg inn følgende miljøvariabler:
    ```
    TILTAKSPENGER_SOKNAD_API_URL=http://localhost:8080
    TOKEN_X_CLIENT_ID=localhost:tpts:tiltakspenger-soknad
    TOKEN_X_PRIVATE_JWK='<generert JWK>'
    TOKEN_X_TOKEN_ENDPOINT=http://host.docker.internal:6969/tokendings/token
    NAIS_CLUSTER_NAME=localhost
    ```
2. Og opprett en fil på `./docker-compose/.env` med følgende innhold:
    ```
    WONDERWALL_OPENID_CLIENT_JWK=<generert JWK>
    TOKEN_X_PRIVATE_JWK=<generert JWK>
    PDL_ENDPOINT_URL=<en eller annen baseurl>
    ```
3. Sørg for at tiltakspenger-soknad-api ligger på `../` relativt til tiltakspenger-soknad repoet.
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
