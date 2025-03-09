import { Translation } from "./definition"

export default {
  propertyDefaults: {
    title: "Uten navn",
    description: "Ingen beskrivelse angitt",
  },
  components: {
    callout: {
      note: "Notis",
      abstract: "Abstrakt",
      info: "Info",
      todo: "Husk på",
      tip: "Tips",
      success: "Suksess",
      question: "Spørsmål",
      warning: "Advarsel",
      failure: "Feil",
      danger: "Farlig",
      bug: "Bug",
      example: "Eksempel",
      quote: "Sitat",
    },
    backlinks: {
      title: "Tilbakekoblinger",
      noBacklinksFound: "Ingen tilbakekoblinger funnet",
    },
    themeToggle: {
      lightMode: "Lys modus",
      darkMode: "Mørk modus",
    },
    explorer: {
      title: "Utforsker",
    },
    footer: {
      createdWith: "Laget med",
    },
    graph: {
      title: "Graf-visning",
    },
    recentNotes: {
      title: "Nylige notater",
      seeRemainingMore: ({ remaining }) => `Se ${remaining} til →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `Transkludering of ${targetSlug}`,
      linkToOriginal: "Lenke til original",
    },
    search: {
      title: "Søk",
      searchBarPlaceholder: "Søk etter noe",
    },
    tableOfContents: {
      title: "Oversikt",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `${minutes} min lesning`,
    },
  },
  pages: {
    rss: {
      recentNotes: "Nylige notat",
      lastFewNotes: ({ count }) => `Siste ${count} notat`,
    },
    error: {
      title: "Ikke funnet",
      notFound: "Enten er denne siden privat eller så finnes den ikke.",
      home: "Returner til hovedsiden",
    },
    folderContent: {
      folder: "Mappe",
      itemsUnderFolder: ({ count }) =>
        count === 1 ? "1 gjenstand i denne mappen." : `${count} gjenstander i denne mappen.`,
    },
    tagContent: {
      tag: "Tagg",
      tagIndex: "Tagg Indeks",
      itemsUnderTag: ({ count }) =>
        count === 1 ? "1 gjenstand med denne taggen." : `${count} gjenstander med denne taggen.`,
      showingFirst: ({ count }) => `Viser første ${count} tagger.`,
      totalTags: ({ count }) => `Fant totalt ${count} tagger.`,
    },
  },
} as const satisfies Translation
