const getTeamsFromData = (teamData) => teamData.map((props) => new Team(props));

class Tournament {
	constructor({ teamData }) {
		this.teamData = teamData;
		this.rounds = [];
		this.winner = null;
	}

	start() {
		let teams = getTeamsFromData(teamData);

		const rounds = [
			{
				name: "Group Stage",
				groupConstructor: (props) => new GroupStage(props),
				teamsPromoted: null,
			},
			{
				name: "Last 16",
				groupConstructor: (props) => new KnockOutRound(props),
				teamsPromoted: 2,
			},
			{
				name: "Quarter-finals",
				groupConstructor: (props) => new PreFinalRound(props),
				teamsPromoted: 1,
			},
			{
				name: "Semi-finals",
				groupConstructor: (props) => new PreFinalRound(props),
				teamsPromoted: 1,
			},
			{
				name: "Finals",
				groupConstructor: (props) => new PreFinalRound(props),
				teamsPromoted: 1,
			},
		];

		rounds.forEach((round, i) => {
			teams = teams.filter((team) => team.place <= round.teamsPromoted);
			const newStage = round.groupConstructor({ name: round.name, teams });
			this.rounds.push(newStage);
			newStage.start();
		});

		this.winner = teams.find((team) => team.place === 1);

		this.showStats();
	}

	showStats() {
		console.log("--------- Tournament Results ---------\n ");
		this.rounds.forEach((round) => round.showStats());
		console.log("=====================================");
		console.log("         Winner: " + this.winner.name);
		console.log("=====================================");
	}
}
