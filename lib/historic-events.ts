export type HistoricEvent = {
  id: string;
  hazard: string;
  name: string;
  date: string;
  dateLabel: string;
  place: string;
  lat: number;
  lon: number;
  start: string;
  end: string;
  point: string;
  metric: string;
  metricLabel: string;
  summary: string;
  lesson: string;
  source: string;
  url: string;
  areas: string[];
};
export const HISTORIC_EVENTS: HistoricEvent[] = [
  {
    id: "fani-2019",
    hazard: "cyclone",
    name: "Cyclone Fani",
    date: "2019-05-03",
    dateLabel: "3 May 2019",
    place: "Puri coast, Odisha",
    lat: 19.8135,
    lon: 85.8312,
    start: "2019-04-26",
    end: "2019-05-07",
    point: "Puri",
    metric: "175–185 km/h",
    metricLabel: "IMD landfall sustained wind",
    summary:
      "Fani crossed the Odisha coast near Puri as an extremely severe cyclonic storm. Coastal wind, rain and disruption to essential services made early preparation crucial.",
    lesson:
      "Decide on shelter and transport before wind makes travel unsafe. Plan for interruptions to electricity and communication.",
    source: "IMD Annual Report 2019",
    url: "https://metnet.imd.gov.in/docs/imdnews/ANNUAL_REPORT2019English.pdf",
    areas: ["bhubaneswar"],
  },
  {
    id: "amphan-2020",
    hazard: "cyclone",
    name: "Cyclone Amphan",
    date: "2020-05-20",
    dateLabel: "20 May 2020",
    place: "Sundarbans, West Bengal–Bangladesh",
    lat: 22.5726,
    lon: 88.3639,
    start: "2020-05-13",
    end: "2020-05-24",
    point: "Kolkata",
    metric: "155–165 km/h",
    metricLabel: "IMD landfall sustained wind",
    summary:
      "Amphan reached the Sundarbans on 20 May after intensifying over the Bay of Bengal. The official report distinguishes peak intensity at sea from the lower wind speed at landfall.",
    lesson:
      "A storm can weaken and remain dangerous. Follow district evacuation instructions and plan around the whole storm, including water hazards.",
    source: "IMD report via PIB · 14 June 2020",
    url: "https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1631493",
    areas: ["kolkata", "siliguri"],
  },
  {
    id: "yaas-2021",
    hazard: "cyclone",
    name: "Cyclone Yaas",
    date: "2021-05-26",
    dateLabel: "26 May 2021",
    place: "North Odisha coast",
    lat: 21.4934,
    lon: 86.9135,
    start: "2021-05-20",
    end: "2021-05-30",
    point: "Balasore",
    metric: "130–140 km/h",
    metricLabel: "Landfall wind forecast in 26 May advisory",
    summary:
      "The 26 May IMD advisory reported that the landfall process had begun, with crossing expected south of Balasore. The value here is the advisory forecast, not a local station observation.",
    lesson:
      "Read bulletin timestamps and distinguish forecasts from observations. Confirm your shelter before the landfall period.",
    source: "IMD RSMC advisory · 26 May 2021, 0300 UTC",
    url: "https://rsmcnewdelhi.imd.gov.in/uploads/archive/2/2_ab2787_18.%20RSMC%20TC%20ADVISORY-18%20BASED%20ON%200300%20UTC%20OF%2026.05.2021.pdf",
    areas: ["bhubaneswar", "kolkata"],
  },
  {
    id: "kerala-2018",
    hazard: "flood",
    name: "Kerala floods",
    date: "2018-08-16",
    dateLabel: "August 2018",
    place: "Kerala · statewide event",
    lat: 9.9312,
    lon: 76.2673,
    start: "2018-08-01",
    end: "2018-08-31",
    point: "Kochi",
    metric: "758.6 mm",
    metricLabel: "State rainfall · 1–19 August (CWC)",
    summary:
      "CWC documented 758.6 mm of rainfall across Kerala in 1–19 August, with approximately 414 mm in 15–17 August. These statewide figures are different from the Kochi grid series shown below.",
    lesson:
      "Several wet days can compound the impact of intense rainfall. A city forecast alone cannot describe upstream flow or local flooding.",
    source: "CWC · Kerala Floods, August 2018",
    url: "https://sdma.kerala.gov.in/wp-content/uploads/2020/08/CWC-Report-on-Kerala-Floods.pdf",
    areas: ["kochi"],
  },
  {
    id: "chennai-2015",
    hazard: "flood",
    name: "Chennai floods",
    date: "2015-12-01",
    dateLabel: "November–December 2015",
    place: "Chennai, Tamil Nadu",
    lat: 13.0827,
    lon: 80.2707,
    start: "2015-11-01",
    end: "2015-12-10",
    point: "Chennai",
    metric: "3 rain episodes",
    metricLabel: "Heavy-rain phases described by IMD",
    summary:
      "IMD describes three phases of heavy rain during November and early December 2015 that resulted in severe flooding in Chennai. Explore the local daily reanalysis across that period.",
    lesson:
      "Repeated rainfall can leave a city vulnerable before the final storm. Know alternate routes and keep supplies accessible upstairs.",
    source: "IMD · Northeast Monsoon of South Asia",
    url: "https://mausam.imd.gov.in/imd_latest/contents/met_monograph.pdf",
    areas: ["chennai"],
  },
  {
    id: "bhuj-2001",
    hazard: "earthquake",
    name: "Gujarat (Bhuj) earthquake",
    date: "2001-01-26",
    dateLabel: "26 January 2001",
    place: "Kachchh, Gujarat",
    lat: 23.419,
    lon: 70.232,
    start: "2001-01-26",
    end: "2001-02-09",
    point: "Mainshock epicentre",
    metric: "M 7.7",
    metricLabel: "USGS catalogue magnitude",
    summary:
      "USGS records a magnitude 7.7 earthquake near Bhachau on 26 January 2001. The sequence below queries recorded M2.5+ events within 150 km of the mainshock epicentre.",
    lesson:
      "Preparation depends on safer buildings and practised protective actions. Historical earthquake sequences do not predict the next earthquake.",
    source: "USGS · usp000a8ds",
    url: "https://earthquake.usgs.gov/earthquakes/eventpage/usp000a8ds/executive",
    areas: [],
  },
  {
    id: "nepal-2015",
    hazard: "earthquake",
    name: "Gorkha earthquake",
    date: "2015-04-25",
    dateLabel: "25 April 2015",
    place: "Gorkha, Nepal · regional context",
    lat: 28.231,
    lon: 84.731,
    start: "2015-04-25",
    end: "2015-05-15",
    point: "Mainshock epicentre",
    metric: "M 7.8",
    metricLabel: "USGS catalogue magnitude",
    summary:
      "The Gorkha earthquake occurred on 25 April 2015. This regional learning case includes the following weeks of recorded seismic activity, using a defined radius and magnitude cutoff.",
    lesson:
      "Plan for aftershocks and damaged routes. Wait for building-safety guidance before returning to a damaged structure.",
    source: "USGS · us20002926",
    url: "https://earthquake.usgs.gov/earthquakes/eventpage/us20002926/executive",
    areas: ["siliguri"],
  },
  {
    id: "monsoon-2015",
    hazard: "drought",
    name: "Deficient southwest monsoon",
    date: "2015-06-01",
    dateLabel: "June–September 2015",
    place: "India · national seasonal context",
    lat: 18.4088,
    lon: 76.5604,
    start: "2015-06-01",
    end: "2015-09-30",
    point: "Latur (illustrative local context)",
    metric: "86% of LPA",
    metricLabel: "All-India seasonal rain · IMD 2015 report",
    summary:
      "IMD’s 2015 annual report lists southwest monsoon rainfall at 86% of its long-period average. This national seasonal measure is not a local drought declaration; the Latur series offers a separate local view.",
    lesson:
      "A seasonal deficit needs comparison with normal rainfall, water storage and demand. Keep water-use plans aligned with local advisories.",
    source: "IMD Annual Report 2015",
    url: "https://metnet.imd.gov.in/docs/imdnews/ANNUAL_REPORT2015English.pdf",
    areas: [],
  },
];
