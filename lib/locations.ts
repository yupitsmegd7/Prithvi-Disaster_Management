export const AREAS = [
  {
    id: "bhubaneswar",
    name: "Bhubaneswar",
    state: "Odisha",
    lat: 20.2961,
    lon: 85.8245,
  },
  {
    id: "siliguri",
    name: "Siliguri",
    state: "West Bengal",
    lat: 26.7271,
    lon: 88.3953,
  },
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    lat: 22.5726,
    lon: 88.3639,
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    lat: 19.076,
    lon: 72.8777,
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0827,
    lon: 80.2707,
  },
  { id: "delhi", name: "New Delhi", state: "Delhi", lat: 28.6139, lon: 77.209 },
  {
    id: "guwahati",
    name: "Guwahati",
    state: "Assam",
    lat: 26.1445,
    lon: 91.7362,
  },
  { id: "kochi", name: "Kochi", state: "Kerala", lat: 9.9312, lon: 76.2673 },
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    lat: 26.9124,
    lon: 75.7873,
  },
  {
    id: "visakhapatnam",
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    lat: 17.6868,
    lon: 83.2185,
  },
];
export type Area = (typeof AREAS)[number];
export const getArea = (id: string) => AREAS.find((a) => a.id === id);
export const SOURCES = [
  {
    name: "Open-Meteo",
    url: "https://open-meteo.com/en/docs",
    description: "Numerical weather-model forecasts; not an official warning.",
  },
  {
    name: "GloFAS via Open-Meteo",
    url: "https://open-meteo.com/en/docs/flood-api",
    description: "Modelled river discharge; not a street-level inundation map.",
  },
  {
    name: "CAMS via Open-Meteo",
    url: "https://open-meteo.com/en/docs/air-quality-api",
    description: "Modelled air pollutants; no rainwater pH measurement.",
  },
  {
    name: "USGS",
    url: "https://earthquake.usgs.gov/fdsnws/event/1/",
    description: "Reported earthquakes; no short-term earthquake prediction.",
  },
  {
    name: "GDACS",
    url: "https://www.gdacs.org/",
    description:
      "Global event feed; local instructions come from Indian authorities.",
  },
  {
    name: "IMD / RSMC",
    url: "https://rsmcnewdelhi.imd.gov.in/",
    description: "Official cyclone bulletins and historical reports.",
  },
  {
    name: "NDMA Sachet",
    url: "https://sachet.ndma.gov.in/",
    description: "Official disaster warnings for India.",
  },
];
