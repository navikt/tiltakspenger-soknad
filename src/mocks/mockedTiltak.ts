export const mocketTiltak = [
    {
        aktivitetId: '123',
        type: 'JOBBK',
        typeNavn: 'Jobbklubb',
        arenaRegistrertPeriode: {},
        arrangør: 'Testarrangør',
        gjennomforingId: '123456',
        visningsnavn: 'Jobbklubb hos Testarrangør',
    },
    {
        aktivitetId: '12asdad3',
        type: 'INDOPPFAG',
        typeNavn: 'Oppfølging',
        arenaRegistrertPeriode: {},
        arrangør: 'Testarrangør B',
        gjennomforingId: '98765',
        visningsnavn: 'Oppfølging hos Testarrangør B',
    },
    {
        aktivitetId: '12sdf3',
        type: 'ARBTREN',
        typeNavn: 'Arbeidstrening',
        arenaRegistrertPeriode: { fra: '2025-04-01', til: '2026-03-01' },
        arrangør: 'Testarrangør C',
        gjennomforingId: '456788',
        visningsnavn: 'Arbeidstrening hos Testarrangør C',
    },
] as const;
