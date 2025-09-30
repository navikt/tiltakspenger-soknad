# Søknad om tiltakspenger

Frontend-kode for søknad om tiltakspenger

# Komme i gang

For å installere dependencies:

```
npm install
```

For å få tilgang til alle dependencies må man generere en personal access-token som legges til i `.npmrc` på ~. Denne genereres via Github, trenger tilgangen `read:packages`, og må autentiseres via Nav. Se dokumentasjon [her](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

## Hvordan kjøre opp lokalt utviklingsmiljø

### Demo mode med mock data

Kopier `.env.demo` til `.env.local` og kjør `npm run dev`. Demo-modus er tilgjengelig på http://localhost:3000/demo

### Med hele verdikjeden

**Obs!** Mulig dette ikke fungerer akkurat nå..

1. Opprett en `.env.local` fil på rot av repoet - og kopier innholdet fra `.env-template`

2. Legg til følgende innhold i hosts-filen på `/etc/hosts` (Om man bruker mac):
    ```
    127.0.0.1 host.docker.internal
    ```
3. Opprett en fil på pathen `./docker-compose/.env` og legg inn en miljøvariabel:
    ```
    WONDERWALL_OPENID_CLIENT_JWK=<generert JWK>
    ```
4. Start docker-compose oppsettet i `./docker-compose` med f.eks. `docker compose up --build -d`
5. Kjør opp frontend med `npm run dev` på rot av repoet
6. :rocket: Gå på localhost:2222 (dette gjør at man treffer Wonderwall)

Meta-repoet til team tiltakspenger har et oppsett for å kjøre opp søknads-APIet og øvrig verdikjede som søknaden bruker,
med mockup av data og autentisering til utviklingsmiljø. Ved bruk av dette oppsettet kan man hoppe over steg (3) og (4) i
guiden over. Følg instruksjoner i [README](https://github.com/navikt/tiltakspenger) på meta-repoet.

README-fila i repoet [tiltakspenger-soknad-api](https://github.com/navikt/tiltakspenger-soknad-api) har også instruksjoner
på hvordan man kan kjøre opp søknads-APIet fra IntelliJ.

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen #tp-utvikling.
