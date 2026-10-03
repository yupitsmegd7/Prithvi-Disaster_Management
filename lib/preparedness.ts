export type Guide = {
  id: string;
  name: string;
  intro: string;
  priority: string;
  phases: { name: string; steps: { title: string; text: string }[] }[];
  sources: { label: string; url: string }[];
};
export const GUIDES: Guide[] = [
  {
    id: "flood",
    name: "Floods: make the move before the road disappears",
    intro:
      "A familiar road can become unfamiliar under water. Prepare a way out while you can still see where you are going.",
    priority:
      "Follow evacuation instructions early. Never walk, swim or drive through floodwater.",
    phases: [
      {
        name: "Before water rises",
        steps: [
          {
            title: "Know the destination and the route",
            text: "Ask your district administration about designated shelters and routes. Write down a second route that avoids low crossings. A map in this app does not show whether a road is passable.",
          },
          {
            title: "Pack for the people travelling",
            text: "Keep medicines, documents, drinking water, ready-to-eat food, a torch and charging supplies together. Arrange transport and assistance for anyone who cannot evacuate independently, including older neighbours.",
          },
          {
            title: "Move important things early",
            text: "If conditions are safe, lift essential items above expected water exposure. Learn how utilities are shut off from a qualified person beforehand; never enter water to reach a switch or meter.",
          },
        ],
      },
      {
        name: "During flooding",
        steps: [
          {
            title: "Choose a dry route, not a shorter one",
            text: "Floodwater can conceal currents, open drains, contamination and electrical hazards. Turn back from flooded roads and follow local directions. Do not follow another vehicle into water.",
          },
          {
            title: "If you are trapped",
            text: "Move to a safer higher level if possible and call 112 with your location and number of people. Avoid an enclosed attic with no way out. Signal rescuers; do not attempt an untrained water rescue.",
          },
          {
            title: "Keep the household informed",
            text: "Tell your agreed contact where you are going. Conserve phone power and use brief messages when networks are congested. Stay away from downed power lines and keep children out of floodwater.",
          },
        ],
      },
      {
        name: "After water recedes",
        steps: [
          {
            title: "Wait for permission to return",
            text: "Water receding is not proof of a safe building. Check official advice and visible structural damage from a safe position. Have affected electrical systems assessed before restoring power.",
          },
          {
            title: "Protect water and food",
            text: "Use water that authorities say is safe. Discard food exposed to floodwater. Do not assume that clear-looking water, or boiling chemically contaminated water, makes it safe.",
          },
          {
            title: "Clean up with support",
            text: "Wear protective footwear and gloves where safe to enter. Photograph damage without entering unstable areas. Keep fuel-powered generators outdoors, well away from doors, windows and vents; never use them inside.",
          },
        ],
      },
    ],
    sources: [
      {
        label: "NWS · flood safety",
        url: "https://www.weather.gov/safety/flood",
      },
      {
        label: "CDC · floodwater",
        url: "https://www.cdc.gov/floods/safety/floodwater-after-a-disaster-or-emergency-safety.html",
      },
      {
        label: "CDC · returning home",
        url: "https://www.cdc.gov/floods/safety/reentering-your-flooded-home-safety.html",
      },
    ],
  },
  {
    id: "cyclone",
    name: "Cyclones: prepare while the skies are quiet",
    intro:
      "A cyclone is more than a wind forecast. Heavy rain, coastal water, debris and long power cuts can affect people well beyond the centre.",
    priority:
      "An evacuation instruction is the cue to act. Do not wait for the wind outside your window to match a number.",
    phases: [
      {
        name: "Before the storm",
        steps: [
          {
            title: "Read the latest official bulletin",
            text: "Check IMD and your district’s instructions, including issue time, named locations and the expected period. A screenshot shared yesterday may no longer describe today’s situation.",
          },
          {
            title: "Agree on shelter and transport",
            text: "Identify the designated shelter and how your household will reach it. Ask early about accessibility, medicines and arrangements for animals. Tell an out-of-area contact your plan.",
          },
          {
            title: "Finish outdoor tasks early",
            text: "Secure loose objects only while conditions are safe. Charge phones and batteries, prepare drinking water and keep essential supplies portable. Do not climb onto a roof as the weather worsens.",
          },
        ],
      },
      {
        name: "While the storm passes",
        steps: [
          {
            title: "Use a protected interior space",
            text: "Stay in the shelter or a suitable interior room away from windows, following local instructions. Keep shoes, a torch and your bag nearby. Never use a lift during power instability.",
          },
          {
            title: "Treat a sudden lull cautiously",
            text: "A temporary calm can occur while a cyclone is still passing. Do not leave shelter to inspect damage or visit the beach. Wait for an official all-clear.",
          },
          {
            title: "Separate power from danger",
            text: "Use torches during a power cut. Keep generators and fuel-burning appliances out of enclosed spaces. Stay away from electrical equipment that is wet or surrounded by water.",
          },
        ],
      },
      {
        name: "After the storm",
        steps: [
          {
            title: "Check the route before returning",
            text: "Roads may contain live wires, unstable trees, debris or floodwater. Follow the authorities’ reopening instructions and avoid unnecessary travel.",
          },
          {
            title: "Make a safe wellbeing check",
            text: "Contact family and neighbours, especially those living alone. If someone needs rescue, share a precise location with emergency services rather than entering an unsafe structure yourself.",
          },
          {
            title: "Record and restock",
            text: "When safe, document damage and check your medicines, water and communication supplies. Update the household plan with what was difficult during this storm.",
          },
        ],
      },
    ],
    sources: [
      {
        label: "IMD · current cyclone bulletins",
        url: "https://rsmcnewdelhi.imd.gov.in/",
      },
      {
        label: "NWS · hurricane preparation",
        url: "https://www.weather.gov/safety/hurricane-plan",
      },
      {
        label: "CDC · after a tropical storm",
        url: "https://www.cdc.gov/hurricanes/safety/how-to-safely-stay-safe-after-a-hurricane-or-other-tropical-storm.html",
      },
    ],
  },
  {
    id: "earthquake",
    name: "Earthquakes: practise a response, not a prediction",
    intro:
      "There may be no useful advance notice. A small, familiar protective action is easier to remember than an elaborate plan during shaking.",
    priority:
      "Indoors: drop, take cover and hold on. Protect your head and neck. Do not rush outside during shaking.",
    phases: [
      {
        name: "Before an earthquake",
        steps: [
          {
            title: "Make your room safer",
            text: "Secure tall furniture and heavy objects with appropriate fittings. Keep heavy items low and exits clear. Structural safety needs a qualified assessment; a tidy room cannot correct an unsafe building.",
          },
          {
            title: "Choose a protective spot",
            text: "Identify a sturdy table or desk away from glass. Practise lowering yourself and protecting your head without creating a fall risk. Adapt the drill for your mobility needs.",
          },
          {
            title: "Plan for separation",
            text: "Agree on a meeting point and an out-of-area contact. Keep sturdy footwear and a torch accessible. Discuss who will help children or anyone needing assistance.",
          },
        ],
      },
      {
        name: "During shaking",
        steps: [
          {
            title: "If you are indoors",
            text: "Stay indoors, drop low, shelter beneath a sturdy desk if available, and hold on. Protect your head and neck. Keep away from glass and furniture that could fall; do not run to stairs or lifts.",
          },
          {
            title: "If you are outside or driving",
            text: "In the open, move clear of buildings, trees and power lines if safe. Drivers should pull over carefully away from bridges and overhead hazards, then remain in the vehicle until shaking stops.",
          },
          {
            title: "If you use a wheelchair",
            text: "Lock the wheels if possible, bend forward and protect your head and neck with your arms or a cushion. Practise a version that works with your own mobility and support needs.",
          },
        ],
      },
      {
        name: "After shaking",
        steps: [
          {
            title: "Expect more shaking",
            text: "Aftershocks can follow. Be ready to protect yourself again. When movement is safe, use a clear exit and avoid visibly damaged buildings until they have been assessed.",
          },
          {
            title: "Notice secondary hazards",
            text: "Do not touch damaged wiring. If you suspect a gas leak, avoid flames and electrical switches, leave safely and report it. Near the coast, strong or long shaking is a reason to follow tsunami evacuation guidance promptly.",
          },
          {
            title: "Check people and information",
            text: "Seek help for injuries and avoid moving a seriously injured person unless there is immediate danger. Use official updates; a predicted exact time for another earthquake is not reliable information.",
          },
        ],
      },
    ],
    sources: [
      {
        label: "USGS · during an earthquake",
        url: "https://www.usgs.gov/faqs/what-should-i-do-during-earthquake",
      },
      {
        label: "Earthquake Country Alliance · seven steps",
        url: "https://www.earthquakecountry.org/sevensteps/",
      },
      {
        label: "NDMA · earthquake guidance",
        url: "https://www.ndma.gov.in/earthquakes",
      },
    ],
  },
  {
    id: "drought",
    name: "Droughts: protect essential water use together",
    intro:
      "Drought develops across seasons and water systems. A dry-spell graph is a prompt to pay attention, not a declaration that your water supply is about to fail.",
    priority:
      "Follow local water advisories. Protect safe drinking water and essential hygiene before discretionary uses.",
    phases: [
      {
        name: "Before shortages",
        steps: [
          {
            title: "Understand your supply",
            text: "Find the official contact for your piped supply, campus or local authority. Know where to check supply schedules and water-quality notices. Plan assistance for people who cannot carry water.",
          },
          {
            title: "Find everyday waste",
            text: "Check taps and toilets for leaks and report shared-pipe leaks. Track household use for a few days. Small repairs usually make a more dependable plan than an ambitious rule nobody can maintain.",
          },
          {
            title: "Store water responsibly",
            text: "Use clean, covered containers intended for drinking water and follow local storage guidance. Label drinking and non-drinking supplies clearly. Do not create unsafe loads by stacking large containers.",
          },
        ],
      },
      {
        name: "During a shortage",
        steps: [
          {
            title: "Prioritise essentials",
            text: "Follow restrictions and supply schedules. Coordinate with neighbours or roommates to reduce waste while preserving drinking, cooking and hygiene needs. Avoid bulk hoarding that leaves others without access.",
          },
          {
            title: "Verify an alternative source",
            text: "Use approved drinking-water sources. Appearance and taste do not establish safety. Follow official treatment notices rather than guessing a chemical dose or assuming any household filter removes every contaminant.",
          },
          {
            title: "Use local agricultural advice",
            text: "For crop and irrigation decisions, consult the agricultural extension service and local advisories. A city rainfall total does not measure field soil moisture or the water available in your well.",
          },
        ],
      },
      {
        name: "As conditions improve",
        steps: [
          {
            title: "Look beyond one rainy day",
            text: "A shower may wet the surface while reservoirs and groundwater remain low. Wait for supply restrictions to be formally changed and continue following water-quality notices.",
          },
          {
            title: "Keep useful habits",
            text: "Retain leak checks and an accessible supply plan. Record which uses were essential and where cooperation reduced waste without reducing hygiene.",
          },
          {
            title: "Review seasonal evidence",
            text: "Compare rainfall against an appropriate long-term seasonal baseline and follow official drought assessments. Avoid labelling a normal dry season as drought from this app alone.",
          },
        ],
      },
    ],
    sources: [
      { label: "Ready.gov · drought", url: "https://www.ready.gov/drought" },
      {
        label: "NDMA · drought information",
        url: "https://ndma.gov.in/Natural-Hazards/Droughts",
      },
      {
        label: "IMD · rainfall information",
        url: "https://mausam.imd.gov.in/responsive/rainfallinformation.php",
      },
    ],
  },
  {
    id: "acid-rain",
    name: "Acid deposition: understand the signal before acting",
    intro:
      "This is an environmental monitoring topic. Air pollutants are part of the chemistry, but they are not a measurement of the acidity of a rain shower.",
    priority:
      "Use official air-quality and water-quality advice. Do not infer an acid-rain emergency from the SO₂ or NO₂ chart.",
    phases: [
      {
        name: "Understand what is measured",
        steps: [
          {
            title: "Separate air chemistry from rain chemistry",
            text: "The graph shows modelled airborne sulphur dioxide and nitrogen dioxide. A rainwater pH measurement needs an actual sample and a suitable measurement method; the app does not have that evidence.",
          },
          {
            title: "Understand environmental effects",
            text: "Acid deposition can affect water bodies, soils, vegetation and materials over time. The presence of precursor gases alone does not identify which local ecosystem has been harmed.",
          },
          {
            title: "Avoid the corrosive-rain myth",
            text: "Acid rain is not a reason to imagine an ordinary shower burning skin. Associated air pollution can affect health; respond to air-quality guidance rather than dramatic claims about the rain.",
          },
        ],
      },
      {
        name: "Respond to relevant advisories",
        steps: [
          {
            title: "Check the pollutant advisory",
            text: "Look at the official local air-quality advice, its timestamp and the pollutants involved. Follow recommended activity changes and any personal care plan you already have.",
          },
          {
            title: "Keep water sources separate",
            text: "Do not treat collected rainwater as automatically drinkable. Follow local public-health guidance on safe water and appropriate treatment. Rainwater pH alone does not establish that it is safe.",
          },
          {
            title: "Report an unusual release",
            text: "A sudden chemical smell or visible industrial release is a different situation from this research chart. Follow local emergency instructions and move away from the affected area as directed.",
          },
        ],
      },
      {
        name: "Learn and reduce exposure",
        steps: [
          {
            title: "Read the evidence carefully",
            text: "Look for sampling dates, locations, quality checks and rainwater chemistry before sharing an acid-deposition claim. State clearly when the only evidence is a modelled precursor.",
          },
          {
            title: "Support cleaner emissions",
            text: "Cleaner energy and reduced sulphur and nitrogen emissions help address acid deposition. Discuss practical transport and energy choices with your community.",
          },
          {
            title: "Keep observations safe",
            text: "If studying rainfall chemistry, work with a teacher or laboratory on a safe sampling method. Do not add chemicals to household water or the environment in an attempt to neutralise a graph.",
          },
        ],
      },
    ],
    sources: [
      {
        label: "EPA · acid-rain science",
        url: "https://www.epa.gov/acidrain/what-acid-rain",
      },
      {
        label: "EPA · effects of acid rain",
        url: "https://www.epa.gov/acidrain/effects-acid-rain",
      },
    ],
  },
];
export type Scenario = {
  id: string;
  title: string;
  setting: string;
  steps: {
    time: string;
    prompt: string;
    options: { text: string; feedback: string }[];
    best: number;
  }[];
};
export const SCENARIOS: Scenario[] = [
  {
    id: "flood",
    title: "Rising water near your home",
    setting:
      "A fictional household is preparing for heavy rain. Practise decisions here; do not enter water or contact emergency services as part of this exercise.",
    steps: [
      {
        time: "Earlier that day",
        prompt:
          "Your district advises residents of your low-lying neighbourhood to evacuate. The street is still dry. What do you do?",
        best: 1,
        options: [
          {
            text: "Wait until water reaches the doorway",
            feedback:
              "Waiting can remove your safe travel window. A dry road now is an opportunity to follow the evacuation instruction.",
          },
          {
            text: "Take the prepared bag and leave by the advised route",
            feedback:
              "Leaving early preserves options. Tell your household contact where you are going and assist others only while it is safe.",
          },
          {
            text: "Check the app and leave only if its rainfall trigger is high",
            feedback:
              "A research trigger cannot override a district evacuation instruction or assess every upstream and drainage hazard.",
          },
        ],
      },
      {
        time: "On the route",
        prompt:
          "Water covers the usual shortcut. You cannot see the road surface.",
        best: 0,
        options: [
          {
            text: "Turn back and use a confirmed dry route",
            feedback:
              "A familiar road is not a safe road when hidden by water. Follow route updates and stay out of floodwater.",
          },
          {
            text: "Walk through because it looks shallow",
            feedback:
              "Depth, current, open drains and electrical hazards cannot be judged by appearance.",
          },
          {
            text: "Follow the car ahead",
            feedback:
              "Another vehicle’s attempt is not evidence that the crossing is safe.",
          },
        ],
      },
      {
        time: "The following day",
        prompt:
          "Water has receded around your building, but no all-clear has been issued.",
        best: 2,
        options: [
          {
            text: "Switch on the power to see whether it works",
            feedback:
              "Flood-exposed electrical equipment needs assessment. Testing it yourself may create a serious hazard.",
          },
          {
            text: "Go in quickly to collect valuables",
            feedback:
              "A short visit can still expose you to structural, electrical and contamination hazards.",
          },
          {
            text: "Wait for return instructions and arrange safety checks",
            feedback:
              "A safe return includes the building, electricity, food and water—not simply a dry-looking floor.",
          },
        ],
      },
    ],
  },
  {
    id: "cyclone",
    title: "A coastal cyclone watch",
    setting:
      "A fictional household is within a district evacuation area. The sequence tests shelter decisions, not a forecast of any actual cyclone.",
    steps: [
      {
        time: "A day before landfall",
        prompt:
          "Officials advise your neighbourhood to move to a designated shelter. Your window still shows mild weather.",
        best: 0,
        options: [
          {
            text: "Confirm the route and leave with the household",
            feedback:
              "The point of early instructions is to move while travel is still possible. Arrange mobility support now.",
          },
          {
            text: "Wait until the local wind graph peaks",
            feedback:
              "The modelled city wind is not an evacuation threshold or a measure of storm surge.",
          },
          {
            text: "Drive to the coast to inspect conditions",
            feedback:
              "A coastal inspection adds exposure and does not improve the household’s shelter plan.",
          },
        ],
      },
      {
        time: "During the storm",
        prompt: "The wind suddenly becomes quiet while you are in shelter.",
        best: 2,
        options: [
          {
            text: "Walk outside to see the sky",
            feedback:
              "A lull can be temporary. Debris and the returning wind remain hazards.",
          },
          {
            text: "Begin the journey home",
            feedback:
              "A change in wind is not an official all-clear or confirmation of a safe route.",
          },
          {
            text: "Stay sheltered and listen for official instructions",
            feedback:
              "Remain away from windows and wait for the all-clear. Conditions can worsen again.",
          },
        ],
      },
      {
        time: "Afterwards",
        prompt: "A fallen tree and a loose cable block the road home.",
        best: 1,
        options: [
          {
            text: "Move the cable with a wooden stick",
            feedback:
              "Treat fallen wires as live. Do not attempt to move them.",
          },
          {
            text: "Keep clear and report the obstruction",
            feedback:
              "Keep others away without approaching the hazard. Let the responsible crews make the route safe.",
          },
          {
            text: "Step over the cable carefully",
            feedback:
              "A visible gap does not establish safety near a damaged power line.",
          },
        ],
      },
    ],
  },
  {
    id: "earthquake",
    title: "Shaking during a study session",
    setting:
      "You are imagining a classroom with a sturdy desk. Rehearse the decision on screen; any physical drill should be supervised and adapted to mobility needs.",
    steps: [
      {
        time: "Shaking begins",
        prompt: "You are indoors beside a sturdy desk. Glass rattles nearby.",
        best: 1,
        options: [
          {
            text: "Run downstairs immediately",
            feedback:
              "Stairs, falling objects and crowds add risk during shaking. Protect yourself where you are.",
          },
          {
            text: "Drop, cover your head and neck under the desk, and hold on",
            feedback:
              "Take cover away from glass and hold on to the desk. Remain protected while shaking continues.",
          },
          {
            text: "Take the lift to the ground floor",
            feedback:
              "Do not use a lift during an earthquake; power and the lift system can fail.",
          },
        ],
      },
      {
        time: "Shaking stops",
        prompt:
          "You see damage in the corridor and hear an instruction to evacuate by a clear stairway.",
        best: 0,
        options: [
          {
            text: "Follow the clear route carefully and expect aftershocks",
            feedback:
              "Once shaking stops, follow the safe evacuation route. Be ready to protect yourself again if shaking resumes.",
          },
          {
            text: "Return for your laptop first",
            feedback:
              "Avoid delaying an evacuation or re-entering a damaged space for belongings.",
          },
          {
            text: "Push through the crowd to leave first",
            feedback:
              "Move calmly and keep the exit usable for people who need assistance.",
          },
        ],
      },
      {
        time: "At the meeting point",
        prompt:
          "A forwarded message claims another earthquake will occur at an exact time tonight.",
        best: 2,
        options: [
          {
            text: "Share it as a confirmed forecast",
            feedback:
              "Earthquake time, place and magnitude cannot be predicted reliably in this way.",
          },
          {
            text: "Assume there will be no more shaking",
            feedback:
              "Aftershocks are possible. Rejecting a false prediction does not mean there is no risk.",
          },
          {
            text: "Check official updates and keep the protective plan ready",
            feedback:
              "Use verified information and remain prepared for aftershocks. Do not return to a damaged building without clearance.",
          },
        ],
      },
    ],
  },
  {
    id: "drought",
    title: "A week of restricted water supply",
    setting:
      "A fictional shared household has received a local supply restriction. The exercise is about coordination and safe water, not diagnosing drought.",
    steps: [
      {
        time: "Supply notice",
        prompt:
          "Your water authority publishes a reduced supply schedule. What is your first household step?",
        best: 0,
        options: [
          {
            text: "Plan essential use and check for leaks",
            feedback:
              "Protect drinking, cooking and hygiene needs, then reduce avoidable waste and coordinate collection.",
          },
          {
            text: "Stop handwashing to save the most water",
            feedback:
              "Essential hygiene should remain a priority. Look for waste before removing protective routines.",
          },
          {
            text: "Buy all available bottled water before neighbours can",
            feedback:
              "Hoarding can worsen access for others. Plan proportionate supplies and support vulnerable neighbours.",
          },
        ],
      },
      {
        time: "Alternative source",
        prompt: "Someone offers clear-looking water from an unfamiliar tank.",
        best: 2,
        options: [
          {
            text: "Drink it because it looks clean",
            feedback:
              "Appearance does not establish microbiological or chemical safety.",
          },
          {
            text: "Add an estimated amount of disinfectant",
            feedback:
              "Do not guess treatment doses or assume every contaminant can be treated this way.",
          },
          {
            text: "Verify the source and follow local drinking-water advice",
            feedback:
              "Use an approved source and the treatment advice relevant to that supply.",
          },
        ],
      },
      {
        time: "After a shower",
        prompt: "It rains for an hour. Restrictions are still in place.",
        best: 1,
        options: [
          {
            text: "Resume all discretionary uses immediately",
            feedback: "One shower may not restore stored water or groundwater.",
          },
          {
            text: "Keep the plan until official restrictions change",
            feedback:
              "Recovery depends on the water system, not just rainfall at the house.",
          },
          {
            text: "Declare the drought over in the app",
            feedback:
              "Neither a single rain event nor this app’s dry-day count is an official drought assessment.",
          },
        ],
      },
    ],
  },
  {
    id: "acid-rain",
    title: "A worrying air-chemistry graph",
    setting:
      "This fictional exercise is about interpreting environmental evidence. It does not simulate corrosive rain or an industrial accident.",
    steps: [
      {
        time: "Looking at the graph",
        prompt: "The modelled SO₂ concentration rises. What can you conclude?",
        best: 2,
        options: [
          {
            text: "The next rain shower will have a known pH",
            feedback:
              "Precursor concentrations do not provide a rainwater pH measurement.",
          },
          {
            text: "Everyone should evacuate because of acid rain",
            feedback:
              "This chart does not establish an acid-rain emergency. Follow relevant official advisories.",
          },
          {
            text: "A modelled precursor changed; check air-quality guidance",
            feedback:
              "Keep the conclusion matched to the measurement. Actual rain chemistry would require separate evidence.",
          },
        ],
      },
      {
        time: "Sharing information",
        prompt: "A friend asks whether ordinary rain will burn their skin.",
        best: 0,
        options: [
          {
            text: "Explain the difference between acid deposition and air-pollution health advice",
            feedback:
              "Avoid the corrosive-rain myth. The connected graphs concern precursors; relevant air-quality guidance still matters.",
          },
          {
            text: "Confirm the claim using the highest point on the graph",
            feedback:
              "The graph has no skin-exposure or rainwater-acidity measurements.",
          },
          {
            text: "Say all air pollution is harmless",
            feedback:
              "Rejecting a false claim does not remove the health concerns associated with air pollution.",
          },
        ],
      },
      {
        time: "Collecting rainwater",
        prompt:
          "A household wants to drink collected rainwater because it looks clear.",
        best: 1,
        options: [
          {
            text: "Drink it if the SO₂ graph is low",
            feedback:
              "An air-chemistry graph cannot establish drinking-water safety.",
          },
          {
            text: "Follow safe-water guidance and verify appropriate treatment",
            feedback:
              "Rainwater can contain contaminants unrelated to pH. Use a safe approved supply and relevant water-quality advice.",
          },
          {
            text: "Add household chemicals to neutralise it",
            feedback:
              "Do not add guessed chemicals to drinking water. Neutralising pH does not remove all hazards.",
          },
        ],
      },
    ],
  },
];
export const KIT = [
  "Safe drinking water and ready-to-eat food for your household",
  "Regular medicines, prescriptions and a first-aid kit",
  "Torch, spare batteries, charged phone and power bank",
  "Identity documents and emergency contacts in a waterproof pouch",
  "Cash, keys, sturdy footwear and a change of clothes",
  "Hygiene supplies, including menstrual and infant-care needs",
  "Glasses, hearing-aid supplies and mobility essentials as needed",
  "A contact outside the area and two agreed meeting points",
  "A designated shelter, travel plan and alternative safe route",
  "Arrangements for pets and people who need assistance",
];
