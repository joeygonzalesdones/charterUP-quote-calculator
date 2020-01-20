// ~~~~~~~~~~~~~~~~~~~~ Data ~~~~~~~~~~~~~~~~~~~~


const QUOTE_TYPES = [
  {
    id: "mileage",
    label: "By Mileage"
  },
  {
    id: "time",
    label: "By Journey Time"
  },
  {
    id: "daily",
    label: "By Daily Rate"
  },
];

const SCENARIO_TYPES = [
  {
    id: "best",
    label: "Best Price"
  },
  {
    id: "daily2", // avoid a name collision with the "daily" in QUOTE_TYPES, just in case
    label: "Daily"
  },
  {
    id: "hourly",
    label: "Hourly"
  },
  {
    id: "mileage2", // avoid a name collision with the "mileage" in QUOTE_TYPES, just in case
    label: "Mileage"
  },
];

const TRIP_TYPES = [
  {
    id: "roundTrip",
    label: "Round Trip"
  },
  {
    id: "oneWay",
    label: "One Way"
  },
];

// ~~~~~~~~~~~~~~~~~~~~ CSS styles ~~~~~~~~~~~~~~~~~~~~

// top, right, bottom, left
const MARGIN = "10px 10px 40px 10px";
const FONT_SIZE = "24px";

export { 
  QUOTE_TYPES, 
  SCENARIO_TYPES, 
  TRIP_TYPES,
  MARGIN,
  FONT_SIZE
};