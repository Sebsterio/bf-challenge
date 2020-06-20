const TEAMS_IN_GROUP = 4;

class Round {
	constructor({ name, teams }) {
		this.name = name;
		this.teams = teams;
		this.groups = [];
	}

	// Determine winners of the round
	start() {
		this.makeGroups(this.teams);

		// let winner, second;
		this.groups.forEach((group, i) => group.play());
		// return [winner, second];
	}

	// Instantiate groups and add them to this.groups array
	makeGroups(teams) {
		// Determine number of groups to create
		const teamsInGroup = TEAMS_IN_GROUP;
		const groupsToMake = teams.length / teamsInGroup;
		if (!Number.isInteger(groupsToMake)) throw Error("Invalid number of teams");

		// Get number of possible seeds
		const seeds = teams.map((team) => team.seed);
		const minSeed = seeds.reduce((acc, cur) => (cur > acc ? acc : cur));
		const maxSeed = seeds.reduce((acc, cur) => (cur > acc ? cur : acc));

		const teamsCopy = [...teams];

		// Distribute teams from teamsCopy among new groups
		for (let i = 0; i < groupsToMake; i++) {
			const newGroup = new Group({ number: i + 1 });

			// Add one team of each seed - without repeating association
			for (let i = minSeed; i <= maxSeed; i++) {
				const teamIndex = teamsCopy.findIndex(
					(team) =>
						team.seed === i && !newGroup.hasAssociation(team.association)
				);
				if (teamIndex < 0) throw Error("Error creating groups");

				// Move team from teamsCopy into newGroup
				const team = teamsCopy.splice(teamIndex, 1)[0];
				newGroup.addTeam(team);
			}
			this.groups.push(newGroup);
		}
	}

	showResults() {
		console.log(`--------- ${this.name} Draw  ---------`);
		this.groups.forEach((group) => group.showDraw());

		console.log(`--------- ${this.name} Results  ---------`);
		this.groups.forEach((group) => group.showResults());

		console.log(`--------- ${this.name} Tables  ---------`);
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

// class GroupStage extends Round {
// 	constructor(props) {
// 		super(props);
// 	}

// }
