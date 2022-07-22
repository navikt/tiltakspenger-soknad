This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Søknad tiltakspenger

Omskriving av tidligere [frontend for tiltakspenger-soknad](https://github.com/navikt/soknadtiltakspenger), må forløpig holdes kompatibel med [backend](https://github.com/navikt/sendsoknad-boot) inntil ny backend er på plass.

Teknologier
- React
- Typescript
- NextJS
- TailwindCSS
- [react-hook-forms](https://react-hook-form.com/) til håndtering av form-state

Funksjonalitet som skal implementeres
- [X] Introduksjons-page
  - [ ] Opprette søknad backend
- [ ] Veiledning Inst - 3 alt-question
- [X] Skjema - Tiltak  
  - [ ] Tiltak finnes i Arena
  - [X] Tiltak ikke finnes i Arena
  - [ ] Ikke spør om addresse, arrangørnavn og postkode hvis bruker har diskresjonskode
- [X] Skjema - Utebetalinger
- [X] Skjema - Barnetillegg
  - [X] Legg til/endre udokumentert til barn
  - [ ] Barn i felles state
- [X] Skjema - Personalia
- [X] Skjema - Fritekst
- [ ] Skjema - Felles
  - [ ] Bruke riktige error-keys
  - [ ] Help-text på mange spørsmål
  - [ ] Tilpasse bredde på tekst-felt
  - [ ] Holde state på alle sub-skjema
  - [X] Sticky bottom-actions, fortsett senere / slett
- [ ] Last opp vedlegg (ligger idag i backend)
- [ ] Send inn
- [ ] Annet
  - [ ] Slette søknad 
  - [ ] Fjerne ubrukt kode
  - [ ] Sette opp pipelines
  - [ ] Tilgang til backend (sendsoknad-boot) i test (og prod)

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
