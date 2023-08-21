# Søknad om tiltakspenger

Frontend-kode for søknad om tiltakspenger

# Komme i gang

For å installere dependencies:

```
npm install
```

For å få tilgang til alle dependencies må man generere en personal access-token som legges til i `.npmrc` på ~. Denne genereres via Github, trenger tilgangen `read:packages`, og må autentiseres via NAV. Se dokumentasjon [her](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

### Hvordan kjøre opp lokalt utviklingsmiljø

Dette oppsettet antar at man har [tiltakspenger-soknad-api](https://github.com/navikt/tiltakspenger-soknad-api)
liggende på `../` relativt til tiltakspenger-soknad. Eventuelt: kjør opp tiltakspenger-soknad-api fra f.eks. IntelliJ
på localhost:8080 (må matche `TILTAKSPENGER_SOKNAD_API_URL` i `.env.local`). Tiltakspenger-soknad-api må bygges med `./gradlew clean build --info installDist --stacktrace` før man går til neste steg.

Autentisering og TokenX er mocket ut med docker-compose i `./docker-compose` på rot av repoet. Dette kan kjøres opp med `docker-compose up -d --build` fra /docker-compose-mappa på rot av repository.

For at ting skal funke som forventet lokalt, må man også sette opp noen miljøvariabler for selve NextJS-appen,
i tillegg til en miljøvariabel for [Wonderwall](https://github.com/nais/wonderwall) som er mocket ut i
docker-compose oppsettet.

1. Opprett en `.env.local` fil på rot av repoet, og legg inn følgende miljøvariabler:
    ```
    TILTAKSPENGER_SOKNAD_API_URL=http://localhost:8080
    TOKEN_X_CLIENT_ID=localhost:tpts:tiltakspenger-soknad
    TOKEN_X_PRIVATE_JWK='<generert JWK>'
    TOKEN_X_TOKEN_ENDPOINT=http://host.docker.internal:6969/tokendings/token
    IDPORTEN_WELL_KNOWN_URL=http://host.docker.internal:6969/idporten/.well-known/openid-configuration
    IDPORTEN_CLIENT_ID=321
    NAIS_CLUSTER_NAME=localhost
    ```
2. Opprett en fil på `./docker-compose/.env` med følgende innhold:
    ```
    WONDERWALL_OPENID_CLIENT_JWK=<generert JWK>
    TOKEN_X_PRIVATE_JWK=<generert JWK>
    PDL_ENDPOINT_URL=<en eller annen baseurl>
    ```
3. Legg til følgende innhold i hosts-filen på `/etc/hosts` (Om man bruker mac):
    ```
    127.0.0.1 host.docker.internal
    ```
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

Interne henvendelser kan sendes via Slack i kanalen #tiltakspenger-utvikling.
