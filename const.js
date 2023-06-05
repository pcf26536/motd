var PREF_UPDATE_FREQ = "update-frequency";
var PREF_FOLLOWED_ONLY = "followed-only";
var PREF_COMPACT_MODE = "compact-mode";
var PREF_POSITION_TOPBAR = "position-in-topbar"

var PREF_LEAGUES = {
    Bund: "bund-enabled",
    EPL: "epl-enabled",
    LaLiga: "laliga-enabled",
    "Serie A": "seriea-enabled",
    Championship: "championship-enabled"
};

var PREF_TOURNAMENTS = {
  "Copa America": "conmebol-enabled",
  "FIFA World Cup": "fifawc-enabled",
  EURO: "uefaeuro-enabled",
  UCL: "ucl-enabled",
  UEL: "uel-enabled",
};

var SPORTS = {
  Bund: [
    { id: 2506, name: "Arminia Bielefeld", pref: "bund-dsc" },
    { id: 131, name: "Bayer Leverkusen", pref: "bund-lev" },
    { id: 132, name: "Bayern Munich", pref: "bund-mun" },
    { id: 124, name: "Borussia Dortmund", pref: "bund-dor" },
    { id: 268, name: "Borussia Monchengladbach", pref: "bund-mon" },
    { id: 125, name: "Eintracht Frankfurt", pref: "bund-einf" },
    { id: 3841, name: "FC Augsburg", pref: "bund-aug" },
    { id: 122, name: "FC Cologne", pref: "bund-col" },
    { id: 598, name: "FC Union Berlin", pref: "bund-fcub" },
    { id: 129, name: "Hertha Berlin", pref: "bund-hert" },
    { id: 2950, name: "Mainz", pref: "bund-main" },
    { id: 11420, name: "RB Leipzig", pref: "bund-lei" },
    { id: 126, name: "SC Freiburg", pref: "bund-frei" },
    // { id: 133, name: "Schalke 04", pref: "bund-scha" },
    { id: 3070, name: "SpVgg Greuther Furth", pref: "bund-spgf" },
    { id: 7911, name: "TSG Hoffenheim", pref: "bund-hof" },
    { id: 134, name: "VfB Stuttgart", pref: "bund-stu" },
    { id: 121, name: "VfL Bochum", pref: "bund-boch" },
    { id: 138, name: "VfL Wolfsburg", pref: "bund-wolf" },
    // { id: 137, name: "Werder Bremen", pref: "bund-wer" }
  ],
  /*UCL: [
    { id: 139, name: "Ajax Amsterdam", pref: "ucl-aja" },
    { id: 105, name: "Atalanta", pref: "ucl-ata" },
    { id: 83, name: "Barcelona", pref: "ucl-bar" },
    { id: 132, name: "Bayern Munich", pref: "ucl-mun" },
    { id: 124, name: "Borussia Dortmund", pref: "ucl-dor" },
    { id: 268, name: "Borussia Monchengladbach", pref: "ucl-mon" },
    { id: 363, name: "Chelsea", pref: "ucl-che" },
    { id: 570, name: "Club Brugge", pref: "ucl-brug" },
    { id: 440, name: "Dynamo Kiev", pref: "ucl-kiev" },
    { id: 572, name: "FC Midtjylland", pref: "ucl-midt" },
    { id: 437, name: "FC Porto", pref: "ucl-por" },
    { id: 110, name: "Internazionale", pref: "ucl-int" },
    { id: 111, name: "Juventus", pref: "ucl-juv" },
    { id: 112, name: "Lazio", pref: "ucl-laz" },
    { id: 364, name: "Liverpool", pref: "ucl-livs" },
    { id: 442, name: "Lokomotiv Moscow", pref: "ucl-lmo" },
    { id: 382, name: "Manchester City", pref: "ucl-mnc" },
    { id: 360, name: "Manchester United", pref: "ucl-man" },
    { id: 176, name: "Marseille", pref: "ucl-mar" },
    { id: 435, name: "Olympiakos", pref: "ucl-oly" },
    { id: 160, name: "Paris Saint-Germain", pref: "ucl-psg" },
    { id: 86, name: "Real Madrid", pref: "ucl-mad" },
    { id: 243, name: "Sevilla FC", pref: "ucl-sev" },
    { id: 493, name: "Shakhtar Donetsk", pref: "ucl-shk" },
    { id: 169, name: "Stade Rennes", pref: "ucl-renn" }
  ],*/
  EPL: [
    { id: 359, name: "Arsenal", pref: "epl-ars" },
    { id: 362, name: "Aston Villa", pref: "epl-avl" },
    { id: 337, name: "Brentford", pref: "epl-bre"},
    { id: 331, name: "Brighton & Hove Albion", pref: "epl-bha" },
    { id: 379, name: "Burnley", pref: "epl-bur" },
    { id: 363, name: "Chelsea", pref: "epl-che" },
    { id: 384, name: "Crystal Palace", pref: "epl-cry" },
    { id: 368, name: "Everton", pref: "epl-eve" },
    // { id: 370, name: "Fulham", pref: "epl-ful" },
    { id: 357, name: "Leeds United", pref: "epl-lee" },
    { id: 375, name: "Leicester City", pref: "epl-lei" },
    { id: 364, name: "Liverpool", pref: "epl-liv" },
    { id: 382, name: "Manchester City", pref: "epl-mnc" },
    { id: 360, name: "Manchester United", pref: "epl-man" },
    { id: 361, name: "Newcastle United", pref: "epl-new" },
    { id: 381, name: "Norwich City", pref: "epl-nor" },
    // { id: 398, name: "Sheffield United", pref: "epl-shu" },
    { id: 376, name: "Southampton", pref: "epl-sou" },
    { id: 367, name: "Tottenham Hotspur", pref: "epl-tot" },
    { id: 395, name: "Watford", pref: "epl-wat" },
    // { id: 383, name: "West Bromwich Albion", pref: "epl-wba" },
    { id: 371, name: "West Ham United", pref: "epl-whu" },
    { id: 380, name: "Wolverhampton Wanderers", pref: "epl-wol" }
  ],
  LaLiga: [
    { id: 96, name: "Alavés", pref: "laliga-alv" },
    { id: 93, name: "Athletic Bilbao", pref: "laliga-ath" },
    { id: 1068, name: "Atletico Madrid", pref: "laliga-atl" },
    { id: 83, name: "Barcelona", pref: "laliga-bar" },
    { id: 85, name: "Celta Vigo", pref: "laliga-cel" },
    { id: 3842, name: "Cádiz", pref: "laliga-cad" },
    { id: 3752, name: "Eibar", pref: "laliga-eib" },
    { id: 3751, name: "Elche", pref: "laliga-elc" },
    { id: 2922, name: "Getafe", pref: "laliga-get" },
    { id: 3747, name: "Granada", pref: "laliga-gcf" },
    { id: 5413, name: "Huesca", pref: "laliga-hue" },
    { id: 29, name: "Levante", pref: "laliga-lev" },
    { id: 97, name: "Osasuna", pref: "laliga-osa" },
    { id: 244, name: "Real Betis", pref: "laliga-bet" },
    { id: 86, name: "Real Madrid", pref: "laliga-mad" },
    { id: 89, name: "Real Sociedad", pref: "laliga-rso" },
    { id: 95, name: "Real Valladolid", pref: "laliga-vall" },
    { id: 243, name: "Sevilla FC", pref: "laliga-sev" },
    { id: 94, name: "Valencia", pref: "laliga-val" },
    { id: 102, name: "Villarreal", pref: "laliga-vill" }
  ],
  "Serie A": [
    { id: 103, name: "AC Milan", pref: "seriea-mil" },
    { id: 104, name: "AS Roma", pref: "seriea-roma" },
    { id: 105, name: "Atalanta", pref: "seriea-ata" },
    { id: 4059, name: "Benevento", pref: "seriea-ben" },
    { id: 107, name: "Bologna", pref: "seriea-bol" },
    { id: 2925, name: "Cagliari", pref: "seriea-cag" },
    { id: 3173, name: "Crotone", pref: "seriea-cro" },
    { id: 109, name: "Fiorentina", pref: "seriea-fio" },
    { id: 3263, name: "Genoa", pref: "seriea-gen" },
    { id: 119, name: "Hellas Verona", pref: "seriea-ver" },
    { id: 110, name: "Internazionale", pref: "seriea-int" },
    { id: 111, name: "Juventus", pref: "seriea-juv" },
    { id: 112, name: "Lazio", pref: "seriea-laz" },
    { id: 114, name: "Napoli", pref: "seriea-nap" },
    { id: 115, name: "Parma", pref: "seriea-par" },
    { id: 2734, name: "Sampdoria", pref: "seriea-samp" },
    { id: 3997, name: "Sassuolo", pref: "seriea-sas" },
    { id: 4056, name: "Spezia", pref: "seriea-spez" },
    { id: 239, name: "Torino", pref: "seriea-tor" },
    { id: 118, name: "Udinese", pref: "seriea-udn" }
  ]
};