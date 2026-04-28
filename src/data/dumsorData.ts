/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TimeSlot {
  start: string; // HH:mm
  end: string;   // HH:mm
  label: string;
}

export const TIME_SLOTS: TimeSlot[] = [
  { start: "00:00", end: "06:00", label: "NIGHT" },
  { start: "06:00", end: "12:00", label: "DAY" },
  { start: "12:00", end: "18:00", label: "DAY" },
  { start: "18:00", end: "00:00", label: "NIGHT" },
];

export type Group = "A" | "B" | "C";

// Schedule mapping: Date (YYYY-MM-DD) -> Timeslot Index -> Group
export const DUMSOR_SCHEDULE: Record<string, Group[]> = {
  "2026-04-25": ["A", "A", "B", "C"], // 0-6, 6-12, 12-18, 18-24
  "2026-04-26": ["B", "B", "C", "A"],
  "2026-04-27": ["C", "C", "A", "B"],
  "2026-04-28": ["A", "A", "B", "C"],
  "2026-04-29": ["B", "B", "C", "A"],
  "2026-04-30": ["C", "C", "A", "B"],
  "2026-05-01": ["A", "A", "B", "C"],
};

export interface RegionData {
  region: string;
  groups: Record<Group, string[]>;
}

export const REGIONS_DATA: RegionData[] = [
  {
    region: "Accra",
    groups: {
      A: [
        "South Odorkor", "Taifa", "Agingo", "Dome New Market", "West Africa Decor",
        "Madina Market", "Atomic Junction", "North Legon", "Israel", "Amasaman",
        "Oxford Street", "Kalamazoo", "Lapaz", "Tesano", "Osu Anglican", "Photo Club"
      ],
      B: [
        "Kaneshie Orange Market", "Mamprobi", "Akatsi Abor", "Special Ice", "Ayi Mensah",
        "Lord Care", "Morning Star", "UG Business School", "Nsawam Prisons", "Adisadel",
        "Weija Dam Site", "GS Plaza", "Agbogbloshie", "Sikkens", "Ghana High School"
      ],
      C: [
        "Asylum Down", "West Ridge", "Atomic Commission", "Mallam Abease", "Achimota",
        "Chorkor", "Korle Gonno", "Dansoman Beach Road", "Honda Place", "Timber Market",
        "Nsawam Hospital", "Prisons", "Police Hospital", "Ga-Odumase", "Dodowa Hospital"
      ]
    }
  },
  {
    region: "Volta",
    groups: {
      A: ["Adidome", "Kpando Township", "Ve", "Fume", "Dzolokpuita", "Amedzofe", "Aflao Township"],
      B: ["Oklahoma", "Lolobi Towns", "Akpafu", "Sogakope", "Akatsi Township", "Keta", "Ho Township"],
      C: ["Tokor", "Dzodze", "Ave towns", "Kpetoe", "Angloga", "Worawora", "Kpando Todzi"]
    }
  },
  {
    region: "Ashanti",
    groups: {
      A: ["Ejisu", "Asamang", "Donyina", "Manso-Nkwanta", "Stadium", "Oforikrom", "Juaben"],
      B: ["Bekwai", "Tafo New Road", "Agric Amanfrom", "Santasi", "Obuasi", "Konango"],
      C: ["Tanoso", "Adum", "Bompata", "TUC", "Atonsu", "Kumawu", "Agona"]
    }
  },
  {
    region: "Eastern",
    groups: {
      A: ["Kowf Hotel", "ECG District Office", "Amanase", "Kade", "Capital View Hotel", "Koforidua"],
      B: ["Asamankese", "Bunso", "Adukrom", "Kibi", "Nkawkaw", "Begoro"],
      C: ["Oda Quarters", "Akim Swedru", "Suhum", "Akwatia", "Mangoase"]
    }
  },
  {
    region: "Central",
    groups: {
      A: ["Ajumako", "Anomabo", "Saltpond", "Mankessim", "Cape Coast", "Assin Fosu"],
      B: ["ECG Main Office (CC)", "Brofoyedur", "Industrial Estate", "Elmina", "Kissi"],
      C: ["Akosua Village", "Kasoa", "Budunburam", "Tipper Junction", "Otta City"]
    }
  },
  {
    region: "Western",
    groups: {
      A: ["Diabene", "Nkroful", "Inchaban", "Shama", "Aboadze", "Dixcove", "Prestea"],
      B: ["Amreaboi", "Tarkwa", "Wiawso", "Bogoso", "Wassa Akropong", "Ghana Gas"],
      C: ["BU Junction", "Takoradi Beach Road", "Apremdo", "Whindo", "Kweikuma"]
    }
  },
  {
    region: "Tema",
    groups: {
      A: ["Leisure Hotel", "Coco Beach", "Afienya", "Valco Flats", "Naval Base", "Tema New Town"],
      B: ["TIS Basic", "Michell Camp", "Sege", "Ada Foah", "Big Ada", "Prampram"],
      C: ["Lashibi", "Klagon", "Dawhenya", "Ashaiman New Town", "Appollonia", "Jerusalem"]
    }
  }
];
