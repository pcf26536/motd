const GLib = imports.gi.GLib;
const Soup = imports.gi.Soup;

const Config = imports.misc.config;
const [major] = Config.PACKAGE_VERSION.split('.');
const SHELL_VER = Number.parseInt(major);

const STATUS = {
	TBD: "0",
	SCHEDULED: "1",
	IN_PROGRESS: "2",
	FINAL: "3",
	FORFEIT: "4",
	CANCELLED: "5",
	POSTPONED: "6",
	DELAYED: "7",
	SUSPENDED: "8",
	FORFEIT_HOME: "9",
	FORFEIT_AWAY: "10",
	RAIN_DELAY: "17",
	BEGIN_PERIOD: "21",
	END_PERIOD: "22",
	HALFTIME: "23",
	OVERTIME: "24",
	FIRST_HALF: "25",
	SECOND_HALF: "26",
	ABANDONED: "27",
	FULLTIME: "28",
	RESCHEDULED: "29",
	START_LIST: "30",
	INTERMEDIATE: "31",
	UNOFFICIAL: "32",
	MEDAL_OFFICIAL: "33",
	GROUPINGS_OFFICIAL: "34",
	PLAY_COMPELTE: "35",
	OFFICIAL_EVENT_SHORTENED: "36",
	CORRECTED_RESULT: "37",
	RETIRED: "38",
	BYE: "39",
	WALKOVER: "40",
	VOID: "41",
	PRELIMINARY: "42",
	GOLDEN_TIME: "43",
	SHOOTOUT: "44",
	FINAL_SCORE_AFTER_EXTRA_TIME: "45",
	FINAL_SCORE_AFTER_GOLDEN_GOAL: "46",
	FINAL_SCORE_AFTER_PENALTIES: "47",
	END_EXTRA_TIME: "48",
	EXTRA_TIME_HALF_TIME: "49",
	FIXTURE_NO_LIVE_COVERAGE: "50",
	FINAL_SCORE_ABANDONED: "51"
};	

var MotdClient = class MotdClient {
	constructor(constants, settings) {
		this.session = new Soup.Session();
		this.dateFmt = new Intl.DateTimeFormat("en", {
			month:'2-digit',day:'2-digit', year:'numeric',
			timeZone: 'Etc/UTC'
		}); 

		let locale = new Intl.DateTimeFormat();
		this.timeFmt = new Intl.DateTimeFormat(
			locale.resolvedOptions().locale === "en-US" ? "en-US" : "en-GB", {
			hour: 'numeric', minute: 'numeric'
		}); 

		this.BASE_API_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/';
		this.API_URLS = {
			EPL: [
				this.BASE_API_URL + 'eng.1/scoreboard'
			],
			EFL: [
				this.BASE_API_URL + 'eng.league_cup/scoreboard'
			],
			FA: [
				this.BASE_API_URL + 'eng.fa/scoreboard'
			],
			Championship: [
				this.BASE_API_URL + 'eng.2/scoreboard'
			],
			LaLiga: [
				this.BASE_API_URL + 'esp.1/scoreboard'
			],
			"Serie A": [
				this.BASE_API_URL + 'ita.1/scoreboard'
			],
			Bund: [
				this.BASE_API_URL + 'ger.1/scoreboard'
			],
			UCL: [
				this.BASE_API_URL + 'uefa.champions/scoreboard'
			],
			UEL: [
				this.BASE_API_URL + 'uefa.europa/scoreboard'
			],
			UECL: [
				this.BASE_API_URL + 'uefa.europa.conf/scoreboard'
			],
			"Club Friendly": [
				this.BASE_API_URL + 'CLUB.FRIENDLY/scoreboard'
			],
			EURO: [
				this.BASE_API_URL + 'uefa.euro/scoreboard',	
				this.BASE_API_URL + 'uefa.euroq/scoreboard'
			],
			"Nations League": [
				this.BASE_API_URL + 'uefa.nations/scoreboard'
			],
			"Copa America": [
				this.BASE_API_URL + 'conmebol.america/scoreboard',
			],
			"FIFA World Cup": [
				this.BASE_API_URL + 'fifa.world/scoreboard'
			],
			CAF: [
				this.BASE_API_URL + 'caf.nations/scoreboard'
			]
		}

		this._CONSTANTS = constants;
		this._leagues = Object.keys(this._CONSTANTS.PREF_LEAGUES);
		this._tournaments = Object.keys(this._CONSTANTS.PREF_TOURNAMENTS);
		this._settings = settings;

        if (SHELL_VER >= 43) {
            this._decoder = new TextDecoder();
        }
	}

	getLeagueScoreboard(league, date, cacheBuster) {
		let urls = this.API_URLS[league].map(l => `${l}?limit=1000&dates=${date}&${cacheBuster}`);

		let requests = [];

		for (let i = 0; i < urls.length; i++) {
			let message = Soup.Message.new('GET', urls[i]);

			requests.push(new Promise((resolve, reject) => {
                if (SHELL_VER <= 42) {
					this.session.queue_message(message, () => {
					    try {
							if (message.status_code === Soup.KnownStatusCode.OK) {
								let result = JSON.parse(message.response_body.data);

							    resolve(result);
							} else {
								resolve([]);
							}
					    } catch (e) {
							resolve([]);
					    }
					});
				} else {
					this.session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, function (session, res) {
                        let data = session.send_and_read_finish(res);

                        if (data) {
                        	try {
	                            data = this._decoder.decode(data.toArray())
							    resolve(JSON.parse(data));
                        	} catch (e) {
                        		resolve([]);
                        	}
                        } else {
                        	resolve([])
                        }
                    }.bind(this));
				}
			}))
		}

		return Promise.all(requests);
	}

	async getScores() {
		let scoreboardDate = new Date();

		// show previous day's scores until 7:00 UTC
		let utcHour = scoreboardDate.getUTCHours();
		if (utcHour < 7) {
			scoreboardDate.setUTCHours(utcHour - 8);
		}

		let events = [];

		let leagues = this.getEnabledLeagues();
		let tournaments = this.getEnabledTournaments();
		let followOnlyMode = this.isFollowOnlyEnabled();

		for (let i = 0; i < leagues.length; i++) {
			let l = {
				league: leagues[i],
				games: [],
				following: []
			};

			let followedTeams = this.getFollowedTeams(leagues[i]);

			try {
				let data = await this.getLeagueScoreboard(
					l.league, 
					this.getDate(scoreboardDate), 
					scoreboardDate.getTime()
				);

				for (let j = 0; j < data.length; j++) {
					for (let k = 0; k < data[j].events.length; k++) {
						let e = this.parseEvent(data[j].events[k]);

						let isFollowedTeam = [e.home.id, e.away.id].some(t => followedTeams.indexOf(t) >= 0);

						if (followOnlyMode) {
							if (isFollowedTeam) l.games.push(e);
						} else {
							l.games.push(e);
						}

						if (isFollowedTeam && e.live) {
							l.following.push(`${e.home.teamAbbr}  ${e.home.score} - ${e.away.score}  ${e.away.teamAbbr} [${e.meta}]`);						
						}
					}
				}
			} catch (error) {}

			if (l.games.length) {
				events.push(l);
			}
		}

		for (let i = 0; i < tournaments.length; i++) {
			let l = {
				league: tournaments[i],
				games: [],
				following: []
			};

			try {
				let data = await this.getLeagueScoreboard(
					l.league, 
					this.getDate(scoreboardDate), 
					scoreboardDate.getTime()
				);

				for (let j = 0; j < data.length; j++) {
					for (let k = 0; k < data[j].events.length; k++) {
						let e = this.parseEvent(data[j].events[k]);
						l.games.push(e);
					} 
				}
			} catch (error) {}

			if (l.games.length) {
				events.push(l);
			}
		}

		return events;
	}

	getDate(date) {
		let parts = this.dateFmt.format(date).split('/');
		return parts[2] + parts[0] + parts[1];
	}

	parseEvent(evt) {
		let home = evt.competitions[0].competitors.find(c => c.homeAway === 'home');
		let away = evt.competitions[0].competitors.find(c => c.homeAway === 'away');

		let event = {};

		event.live = false;
		event.isComplete = evt.status.type.completed;
		event.home = {};
		event.home.id = home.id;
		event.home.team = home.team.shortDisplayName;
		event.home.teamAbbr = home.team.abbreviation;
		event.home.score = home.score;
		event.home.isWinner = 'winner' in home ? home.winner : false;
		event.home.isLoser = 'winner' in home ? (home.winner === false ? true : false) : false;

		event.away = {};
		event.away.id = away.id;
		event.away.team = away.team.shortDisplayName;
		event.away.teamAbbr = away.team.abbreviation;
		event.away.score = away.score;
		event.away.isWinner = 'winner' in away ? away.winner : false;
		event.away.isLoser = 'winner' in away ?(away.winner === false ? true : false) : false;

		if (
			evt.status.type.id === STATUS.SCHEDULED 	|| 
			evt.status.type.id === STATUS.DELAYED 		|| 
			evt.status.type.id === STATUS.RAIN_DELAY
		) {
			event.home.score = '';
			event.away.score = '';
			event.meta = this.timeFmt.format(new Date(evt.date));
		} else if (
			evt.status.type.id === STATUS.FINAL 						||
			evt.status.type.id === STATUS.FINAL_SCORE_ABANDONED 		||
			evt.status.type.id === STATUS.FINAL_SCORE_AFTER_PENALTIES 	||
			evt.status.type.id === STATUS.FINAL_SCORE_AFTER_EXTRA_TIME 	||
			evt.status.type.id === STATUS.FINAL_SCORE_AFTER_GOLDEN_GOAL ||
			evt.status.type.id === STATUS.WALKOVER		
		) {
			event.meta = 'Final';
		} else if (
			evt.status.type.id === STATUS.IN_PROGRESS   || 
			evt.status.type.id === STATUS.BEGIN_PERIOD  || 
			evt.status.type.id === STATUS.END_PERIOD    || 
			evt.status.type.id === STATUS.HALFTIME 	    || 
			evt.status.type.id === STATUS.OVERTIME      ||
			evt.status.type.id === STATUS.FIRST_HALF	||
			evt.status.type.id === STATUS.SECOND_HALF   ||
			evt.status.type.id === STATUS.SHOOTOUT 		||
			evt.status.type.id === STATUS.GOLDEN_TIME   ||
			evt.status.type.id === STATUS.INTERMEDIATE  ||
			evt.status.type.id === STATUS.EXTRA_TIME_HALF_TIME  	||
			evt.status.type.id === STATUS.FIXTURE_NO_LIVE_COVERAGE
		) {
			event.live = true;
			event.meta = evt.status.type.shortDetail;
		} else if (evt.status.type.id === STATUS.POSTPONED) {
			event.isComplete = true;
			event.meta = 'Post';
		} else if (evt.status.type.id === STATUS.SUSPENDED) {
			event.isComplete = true;
			event.meta = 'Susp';
		} else {
			event.home.score = event.isComplete ? home.score : '';
			event.away.score = event.isComplete ? away.score : '';
			event.meta = evt.status.type.shortDetail;
		}

		return event;
	}

	getEnabledLeagues() {
		let leagues = [];

		for (let i = 0; i < this._leagues.length; i++) {
			if (this._settings.get_boolean(this._CONSTANTS.PREF_LEAGUES[this._leagues[i]])) {
				leagues.push(this._leagues[i]);
			}
		}

		return leagues;
	}

	getEnabledTournaments() {
		let tournaments = [];

		for (let i = 0; i < this._tournaments.length; i++) {
			if (this._settings.get_boolean(this._CONSTANTS.PREF_TOURNAMENTS[this._tournaments[i]])) {
				tournaments.push(this._tournaments[i]);
			}
		}

		return tournaments;
	}

	getFollowedTeams(league) {
		let teams = [];

		for (let i = 0; i < this._CONSTANTS.SPORTS[league].length; i++) {
			if (this._settings.get_boolean(this._CONSTANTS.SPORTS[league][i].pref)) {
				teams.push(this._CONSTANTS.SPORTS[league][i].id.toString());
			}
		}

		return teams;
	}

	isFollowOnlyEnabled() {
		return this._settings.get_boolean(this._CONSTANTS.PREF_FOLLOWED_ONLY);
	}
}