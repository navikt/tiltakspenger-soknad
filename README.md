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

### Mot lokal backend uten authserver

Søknaden kan kjøres mot et ekte, lokalt [tiltakspenger-soknad-api](https://github.com/navikt/tiltakspenger-soknad-api)
uten at authserveren kjører. Da er postgres den eneste eksterne avhengigheten i verdikjeden.

1. Start søknads-APIet med `main()` i `LokalMain.kt` (i testkildene der) — det godtar hvilket som helst token, og
   trenger kun postgres ved siden av. Se [README-en i det repoet](https://github.com/navikt/tiltakspenger-soknad-api).
2. Kjør frontend med fake token:
    ```sh
    BRUK_LOKAL_FAKE_TOKEN=true npm run dev
    ```
3. :rocket: Gå på http://localhost:3000 (ikke via Wonderwall på 2222 — den er ikke i bruk her)

Frontenden hopper da over ID-porten-validering og TokenX-vekslingen, og sender fake-tokenet videre til søknads-APIet.
Til forskjell fra demo-modus over, som kjører helt uten backend, snakker frontenden her med et ekte API — det er kun
autentiseringen som er faket. `TILTAKSPENGER_SOKNAD_API_URL` må peke på det lokale APIet (`http://localhost:8080`).

Miljøvariabler (dokumentert i `.env-template`, samme navn og oppførsel som i `tiltakspenger-saksbehandling`):

- `BRUK_LOKAL_FAKE_TOKEN` — `true` slår på fake token. Virker kun utenfor Nais (`NAIS_CLUSTER_NAME` uspesifisert eller
  `localhost`), altså aldri i dev eller prod.
- `LOKAL_FAKE_TOKEN` — tokenet som sendes til søknads-APIet. Valgfri, default `TokenMcTokenface`.

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
