export const PREPAREDNESS = [
  {
    id: "flood",
    name: "When water starts to rise",
    intro: "The safest crossing is the one you do not attempt.",
    steps: [
      "Follow local evacuation orders and identify a route to higher ground before roads close.",
      "Keep medicines, drinking water, a torch and documents in a waterproof bag.",
      "Avoid walking or driving through floodwater. Water can hide fast currents, open drains and live wires.",
      "Check on neighbours who may need assistance, without putting yourself at risk.",
    ],
    url: "https://ndma.gov.in/Natural-Hazards/Floods",
  },
  {
    id: "cyclone",
    name: "Before a cyclone arrives",
    intro: "Prepare while the skies are still quiet.",
    steps: [
      "Read the latest IMD and district warnings; identify your nearest designated shelter.",
      "Charge phones and power banks. Keep a battery-powered radio if possible.",
      "Secure loose items outdoors when it is safe, and stay away from windows during the storm.",
      "Do not go outside during a sudden lull. Wait for authorities to announce that it is safe.",
    ],
    url: "https://rsmcnewdelhi.imd.gov.in/",
  },
  {
    id: "earthquake",
    name: "If the ground begins to shake",
    intro: "A few practised actions are easier to remember under stress.",
    steps: [
      "Drop, cover and hold on when indoors. Protect your head and neck.",
      "Stay away from glass. Do not run outside or use lifts during shaking.",
      "If already outdoors, move away from buildings, trees and power lines when safe.",
      "After shaking stops, expect aftershocks and follow local instructions about damaged structures.",
    ],
    url: "https://www.usgs.gov/faqs/what-should-i-do-during-earthquake",
  },
  {
    id: "drought",
    name: "Through a prolonged dry spell",
    intro: "Careful water use is a shared responsibility.",
    steps: [
      "Follow local water restrictions and use safe drinking-water sources.",
      "Repair leaks and prioritise drinking, cooking and essential hygiene.",
      "Farmers should consult local agricultural advisories before changing irrigation or crop plans.",
      "Track official drought and heat advisories; a few dry days alone do not define a drought.",
    ],
    url: "https://ndma.gov.in/Natural-Hazards/Droughts",
  },
  {
    id: "acid-rain",
    name: "Understand acid deposition",
    intro: "Cleaner air protects more than the view.",
    steps: [
      "Acid deposition is linked to sulfur and nitrogen emissions and atmospheric chemistry.",
      "Air-pollution concentrations do not directly measure the acidity of rainfall.",
      "Follow official air-quality guidance and avoid treating collected rainwater as drinking water without suitable treatment.",
      "Support cleaner energy and public transport; reducing precursor emissions helps address acid deposition.",
    ],
    url: "https://www.epa.gov/acidrain/what-acid-rain",
  },
];
export const CONTACTS = [
  {
    kind: "Emergency",
    name: "National emergency response",
    phone: "112",
    area: "all",
    description: "Police, fire and medical emergencies across India.",
    source:
      "https://www.mha.gov.in/en/commoncontent/emergency-response-support-system-erss",
  },
  {
    kind: "Police",
    name: "Police helpline",
    phone: "100",
    area: "all",
    description:
      "Police assistance. You can also call the unified emergency number 112.",
    source: "https://www.india.gov.in/directory/helpline",
  },
  {
    kind: "Emergency",
    name: "Fire and rescue",
    phone: "101",
    area: "all",
    description:
      "Fire emergencies; 112 is the integrated emergency alternative.",
    source: "https://www.india.gov.in/directory/helpline",
  },
  {
    kind: "Hospital",
    name: "National ambulance service",
    phone: "102",
    area: "all",
    description:
      "Ambulance service. For immediate emergency dispatch, call 112.",
    source: "https://www.india.gov.in/directory/helpline",
  },
  {
    kind: "Emergency",
    name: "Disaster relief commissioner",
    phone: "1070",
    area: "all",
    description: "State-level assistance for natural calamities.",
    source: "https://www.india.gov.in/directory/helpline",
  },
  {
    kind: "Emergency",
    name: "NDRF disaster assistance",
    phone: "01124363260",
    area: "all",
    description:
      "Disaster response contact listed by the National Portal of India.",
    source: "https://www.india.gov.in/directory/helpline",
  },
  {
    kind: "Hospital",
    name: "AIIMS Bhubaneswar · Emergency",
    phone: "06742476461",
    area: "bhubaneswar",
    description: "Trauma and emergency, Sijua, Patrapada, Bhubaneswar.",
    source: "https://aiimsbhubaneswar.nic.in/contact-us/",
  },
  {
    kind: "Hospital",
    name: "AIIMS Bhubaneswar · Blood bank",
    phone: "06742476831",
    area: "bhubaneswar",
    description:
      "Blood bank enquiries; availability must be confirmed with the hospital.",
    source: "https://aiimsbhubaneswar.nic.in/contact-us/",
  },
  {
    kind: "Police",
    name: "Bhubaneswar police control room",
    phone: "06742391903",
    area: "bhubaneswar",
    description:
      "Local control-room contact from the Odisha Police directory. Use 112 for urgent dispatch.",
    source:
      "https://services-op.odisha.gov.in/Citizen/ContentHtm/ContactUs1.htm",
  },
  {
    kind: "NGO",
    name: "Goonj · Rahat disaster relief",
    phone: "01141401216",
    area: "all",
    description:
      "Relief and rehabilitation enquiries. An NGO office contact, not an emergency dispatch line.",
    source: "https://goonj.org/donate/campaign/rahat",
  },
];
export const EVENTS = [
  {
    hazard: "Cyclones",
    date: "2019-05-03",
    place: "Odisha coast",
    title: "Cyclone Fani",
    detail: "A reminder of why coastal shelters and early evacuation matter.",
    url: "https://rsmcnewdelhi.imd.gov.in/report.php?internal_menu=Mjk%3D",
  },
  {
    hazard: "Cyclones",
    date: "2020-05-20",
    place: "West Bengal and Bangladesh",
    title: "Cyclone Amphan",
    detail: "Storm impact can extend across coastlines and national borders.",
    url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=1631493&lang=2&reg=48",
  },
  {
    hazard: "Cyclones",
    date: "2021-05-26",
    place: "Odisha and West Bengal",
    title: "Cyclone Yaas",
    detail: "A coastal event documented in IMD annual cyclone reports.",
    url: "https://rsmcnewdelhi.imd.gov.in/report.php?internal_menu=Mjk%3D",
  },
  {
    hazard: "Droughts",
    date: "2015-06-01",
    place: "Multiple Indian states",
    title: "2015–16 drought declarations",
    detail:
      "Season-level record, not a single onset date. Government reporting lists affected districts.",
    url: "https://www.pib.gov.in/newsite/PrintRelease.aspx?lang=2&reg=48&relid=145003",
  },
];
