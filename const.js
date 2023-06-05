var PREF_UPDATE_FREQ = "update-frequency";
var PREF_FOLLOWED_ONLY = "followed-only";
var PREF_COMPACT_MODE = "compact-mode";
var PREF_POSITION_TOPBAR = "position-in-topbar"

var PREF_LEAGUES = {
    EPL: "epl-enabled",
    // not really tournaments but Man Utd followed
    UCL: "ucl-enabled",
    UEL: "uel-enabled",
    UECL: "uecl-enabled",
    EFL: "efl-enabled",
    FA: "fa-enabled",
    "Club Friendly": "friendly-enabled"
};

var PREF_TOURNAMENTS = {
  // not really tournaments but no team followed
  Bund: "bund-enabled",
  LaLiga: "laliga-enabled",
  "Serie A": "seriea-enabled",
  Championship: "championship-enabled",
  // actual tournaments
  "Copa America": "conmebol-enabled",
  "FIFA World Cup": "fifawc-enabled",
  EURO: "uefaeuro-enabled",
  "Nations League": "uefanl-enabled",
  CAF: "caf-enabled"
};

var SPORTS = {
  UEL: [
    { id: 360, name: "Manchester United", pref: "uel-man" },
  ],
  UECL: [
    { id: 360, name: "Manchester United", pref: "uecl-man" },
  ],
  UCL: [
    { id: 360, name: "Manchester United", pref: "ucl-man" },
  ],
  EPL: [
    { id: 360, name: "Manchester United", pref: "epl-man" },
  ],
  FA: [
    { id: 360, name: "Manchester United", pref: "fa-man" },
  ],
  EFL: [
    { id: 360, name: "Manchester United", pref: "efl-man" },
  ],
  "Club Friendly": [
    { id: 360, name: "Manchester United", pref: "cf-man" },
  ]
};