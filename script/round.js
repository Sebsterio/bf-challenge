class Round {
	constructor({ name, teams }) {
		this.name = name;
		this.teams = teams;
		this.groups = [];
	}

	start() {
		this.makeGroups(this.teams);
		this.groups.forEach((group, i) => group.play());
	}

	// Instantiate groups and add them to this.groups array
	makeGroups(teams) {
		// Determine number of groups to create
		const groupsToMake = teams.length / this.teamsInGroup;
		if (!Number.isInteger(groupsToMake)) throw Error("Invalid number of teams");

		const teamsCopy = [...teams];

		// Distribute teams from teamsCopy among new groups
		for (let i = 0; i < groupsToMake; i++) {
			let newGroup = this.createGroup({ number: i + 1 });

			// Add one team of each seed - respecting specified conditions
			for (let i = 1; i <= this.teamsInGroup; i++) {
				const teamIndex = teamsCopy.findIndex((team) =>
					this.isTeamEligible(team, newGroup, i)
				);
				if (teamIndex < 0) throw Error("Error creating groups");

				// Move team from teamsCopy into newGroup
				const team = teamsCopy.splice(teamIndex, 1)[0];
				newGroup.addTeam(team);
			}
			this.groups.push(newGroup);
		}
	}

	showStats() {
		this.showDraw();
		this.showResults();
		if (this.teamsInGroup === 4) this.showTables();
	}

	showDraw() {
		console.log(`|\n|--------- ${this.name} Draw  ---------\n|`);
		this.groups.forEach((group) => group.showDraw());
	}

	showResults() {
		console.log(`|\n|--------- ${this.name} Results  ---------\n|`);
		this.groups.forEach((group) => group.showResults());
	}
}

// --------------------------- Group Stage ---------------------------

class GroupStage extends Round {
	constructor(props) {
		super(props);
		this.teamsInGroup = 4;
	}

	createGroup({ number }) {
		return new Group4({ number });
	}

	// One from each seed, without repeating associations
	isTeamEligible(team, newGroup, seed) {
		return team.seed === seed && !newGroup.hasAssociation(team.association);
	}

	showTables() {
		console.log(`|\n|--------- ${this.name} Tables  ---------\n|`);
		this.groups.forEach((group) => {
			const { number, teams } = group;
			console.log("Group " + number);
			console.table(
				teams.map((team, i) => ({
					position: i + 1,
					team: team.name,
					points: team.getGroupPoints(),
					goals: team.getGroupGoals(),
				}))
			);
		});
	}
}

// --------------------------- Knock Out Round ---------------------------

class KnockOutRound extends Round {
	constructor(props) {
		super(props);
		this.teamsInGroup = 2;
	}

	createGroup({ number }) {
		return new Group2({ number });
	}

	isTeamEligible(team, newGroup, place) {
		return (
			team.place === place &&
			!newGroup.hasAssociation(team.association) &&
			team.groupNum !== !newGroup.hasGroupMember(team.groupNum)
		);
	}
}

// ---------------- Quarter-finals, Semi-finals, Finals ------------------

class PreFinalRound extends KnockOutRound {
	createGroup({ number }) {
		return new Group2PreFinals({ number });
	}

	isTeamEligible() {
		return true;
	}
}
