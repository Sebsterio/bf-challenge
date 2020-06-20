(function () {
	// prettier-ignore
	const GROUP_STAGE_SEQUENCE= [[2, 3],[4, 1],[1, 2],[3, 4],[3, 1],[2, 4],[1, 3],[4, 2],[3, 2],[1, 4],[2, 1],[4, 3]]
	const TEAMS_IN_GROUP = 4;

	const randomScore = () => Math.floor(Math.random() * 3);

	const getTeamsFromData = (teamData) =>
		teamData.map((props) => new Team(props));

	class Tournament {
		constructor({ teamData }) {
			this.teams = getTeamsFromData(teamData);
			this.stats = {
				draw: [],
				results: [],
				tables: [],
			};
			this.results = []; // <<<<<<<<<<<, save and show at the end of groupStage
			this.tables = [];
		}

		start() {
			view.tournamentStart();
			const stage2Teams = this.groupStage();
			console.log("done");
			// console.log('stage2Teams ', stage2Teams);
			// const stage3Teams = this.knockOutRound(stage2Teams)
		}

		// Determine winners of the group stage
		groupStage() {
			view.groupStageStart();

			const groups = this.makeGroups(this.teams);
			let winner, second;
			groups.forEach((group, i) => {
				const groupNumber = i + 1;
				[winner, second] = this.playGroup(group, groupNumber);
			});

			view.groupStageEnd(this.tables);
			// view.showStageStats()
			// show group stage draw x4
			// show group stage results x8 x16
			// show group stage tables x8
			return [winner, second];
		}

		makeGroups(teams) {
			// Determine number of groups to create
			const teamsInGroup = TEAMS_IN_GROUP;
			const groupsToMake = teams.length / teamsInGroup;
			if (!Number.isInteger(groupsToMake))
				throw Error("Invalid number of teams");

			// Get number of possible seeds
			const seeds = teams.map((team) => team.seed);
			const minSeed = seeds.reduce((acc, cur) => (cur > acc ? acc : cur));
			const maxSeed = seeds.reduce((acc, cur) => (cur > acc ? cur : acc));

			const teamsCopy = [...teams];
			const groups = [];

			// Distribute teams from teamsCopy among groups
			for (let i = 0; i < groupsToMake; i++) {
				const newGroup = [];
				const associations = [];

				// Add one team of each seed - without repeating association
				for (let i = minSeed; i <= maxSeed; i++) {
					const teamIndex = teamsCopy.findIndex(
						(team) =>
							team.seed === i && !associations.includes(team.association)
					);
					if (teamIndex < 0) throw Error("Impossible to create groups");
					const team = teamsCopy.splice(teamIndex, 1)[0];
					newGroup.push(team);
					associations.push(team.association);
				}
				groups.push(newGroup);
			}
			return groups;
		}

		playGroup(group, groupNum) {
			view.groupStart(group, groupNum);

			// Run matches between team pairs in a specified sequence
			const sequence = GROUP_STAGE_SEQUENCE;
			sequence.forEach((pair) => {
				// e.g. pair: [1,2] -> match: group[0] vs group[1]
				const homeTeam = group[pair[0] - 1];
				const guestTeam = group[pair[1] - 1];
				this.match(homeTeam, guestTeam);
			});

			// Determine group winners
			group.sort((cur, next) => {
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
			});

			group.forEach((team, i) => {
				team.place = i;
				team.group = groupNum;
			});

			this.tables.push([group, groupNum]);
			return [group[0], group[1]];
		}

		match(homeTeam, guestTeam) {
			// Generate score
			[homeTeam, guestTeam].forEach(
				(team) => (team.matchGoals = randomScore())
			);

			view.matchEnd(homeTeam, guestTeam);

			// Add stats to team
			[(homeTeam, guestTeam)].forEach((_, i) => {
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
	}

	window.Tournament = Tournament;
})();
