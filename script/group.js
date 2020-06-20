// prettier-ignore
const GROUP_STAGE_SEQUENCE= [[2, 3],[4, 1],[1, 2],[3, 4],[3, 1],[2, 4],[1, 3],[4, 2],[3, 2],[1, 4],[2, 1],[4, 3]]

const randomScore = () => Math.floor(Math.random() * 3);

class Group {
	constructor({ number, teamsInGroup }) {
		this.number = number;
		this.teamsInGroup = teamsInGroup;
		this.teams = [];
		this.results = [];
	}

	addTeam(team) {
		this.teams.push(team);
	}

	hasAssociation(association) {
		return !!this.teams.find((team) => team.association === association);
	}

	hasGroupMember(groupNum) {
		return !!this.teams.find((team) => team.groupNum === groupNum);
	}

	// Determine group winners
	play() {
		this.runMatches();
		this.teams.sort((cur, next) => this.compareScores(cur, next));
		this.teams.forEach((team, i) => {
			team.place = i + 1;
			team.groupNum = this.groupNum;
		});
	}

	match(homeTeam, guestTeam) {
		// Generate score
		[homeTeam, guestTeam].forEach((team) => (team.matchGoals = randomScore()));

		this.results.push({
			localName: homeTeam.name,
			localGoals: homeTeam.matchGoals,
			guestName: guestTeam.name,
			guestGoals: guestTeam.matchGoals,
		});

		// Add stats to team
		[homeTeam, guestTeam].forEach((_, i) => {
			const team = i === 0 ? homeTeam : guestTeam;
			const opponent = i === 0 ? guestTeam : homeTeam;
			const teamIsAway = i === 1;

			// Save goals (take note of opponnent for future tie resolutions)
			team.addGoals(team.matchGoals, opponent.name, teamIsAway);

			// Attribute points (take note of opponnent for future tie resolutions)
			if (team.matchGoals > opponent.matchGoals)
				team.addPoints(3, opponent.name);
			else if (team.matchGoals === opponent.matchGoals)
				team.addPoints(1, opponent.name);
		});
	}

	showDraw() {
		console.log(
			`Group ${this.number}: ${this.teams.map((team) => team.name).join(", ")}`
		);
	}

	showResults() {
		console.log("\nGroup " + this.number);
		this.results.forEach(({ localName, localGoals, guestName, guestGoals }) =>
			console.log(
				`${localGoals}:${guestGoals} --- ${localName} vs ${guestName}`
			)
		);
	}
}

// ------------------------- Group of 4 teams --------------------------

class Group4 extends Group {
	constructor(props) {
		super(props);
	}

	// Run matches between team pairs in a specified sequence
	runMatches() {
		const sequence = GROUP_STAGE_SEQUENCE;
		sequence.forEach((pair) => {
			// e.g. pair: [1,2] -> match: teams[0] vs teams[1]
			const homeTeam = this.teams[pair[0] - 1];
			const guestTeam = this.teams[pair[1] - 1];
			this.match(homeTeam, guestTeam);
		});
	}

	// 'Sort' function
	compareScores(cur, next) {
		// Compare total points
		let difference = next.getGroupPoints() - cur.getGroupPoints();
		if (difference === 0) {
			// Compare points obtained from matches between compared teams
			difference = next.getGroupPoints(cur) - cur.getGroupPoints(next);
			if (difference === 0) {
				// Compare goals obtained from matches between compared teams
				difference = next.getGroupGoals(cur) - cur.getGroupGoals(next);
				if (difference === 0) {
					// Compare goals away from home from matches between compared teams
					difference =
						next.getGroupGoalsAway(cur) - cur.getGroupGoalsAway(next);
					if (difference === 0) {
						// Compare total goals
						difference = next.getGroupGoals() - cur.getGroupGoals();
						if (difference === 0) return Math.random() - 0.5;
					}
				}
			}
		}
		return difference;
	}
}

// ------------------------- Group of 2 teams --------------------------

class Group2 extends Group {
	constructor(props) {
		super(props);
	}

	runMatches() {
		const homeTeam = this.teams[0];
		const guestTeam = this.teams[1];
		this.match(homeTeam, guestTeam);
		this.match(guestTeam, homeTeam);
	}

	compareScores(cur, next) {
		// Compare total goals
		let difference = next.getGroupGoals() - cur.getGroupGoals();
		if (difference === 0) {
			// Compare goals away from home from matches between compared teams
			difference = next.getGroupGoalsAway(cur) - cur.getGroupGoalsAway(next);
			if (difference === 0) {
				// Awar random goal and compare totals
				this.awardRandomGoal(cur, next);
				return next.getGroupGoals() - cur.getGroupGoals();
			}
		}
		return difference;
	}

	// award a goal to a random team
	awardRandomGoal(cur, next) {
		if (Math.random() < 0.5) next.addGoals([1, cur, null]);
		else cur.addGoals([1, next, null]);
	}
}

// ------------------ Group of 2 teams - pre-final ---------------------

class Group2PreFinals extends Group2 {
	compareScores(cur, next) {
		// Compare total goals
		let difference = next.getGroupGoals() - cur.getGroupGoals();
		if (difference === 0) {
			// Awar random goal and compare totals
			this.awardRandomGoal(cur, next);
			return next.getGroupGoals() - cur.getGroupGoals();
		}
		return difference;
	}
}
