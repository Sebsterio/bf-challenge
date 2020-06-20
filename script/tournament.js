const getTeamsFromData = (teamData) => teamData.map((props) => new Team(props));

class Tournament {
	constructor({ teamData }) {
		this.teams = getTeamsFromData(teamData);
		this.rounds = [];
		this.winner = null;
	}

	start() {
		// Group stage
		const groupStage = new GroupStage({
			name: "Group Stage",
			teams: this.teams,
		});
		this.rounds.push(groupStage);
		groupStage.start();

		// Last 16
		const stage2Teams = this.teams.filter((team) => team.place < 3);
		const stage2 = new KnockOutRound({
			name: "Last 16",
			teams: stage2Teams,
		});
		this.rounds.push(stage2);
		stage2.start();

		// Quarter-finals
		const stage3Teams = stage2Teams.filter((team) => team.place === 1);
		const stage3 = new PreFinalRound({
			name: "Quarter-finals",
			teams: stage3Teams,
		});
		this.rounds.push(stage3);
		stage3.start();

		// Semi-finals
		const stage4Teams = stage3Teams.filter((team) => team.place === 1);
		const stage4 = new PreFinalRound({
			name: "Semi-finals",
			teams: stage4Teams,
		});
		this.rounds.push(stage4);
		stage4.start();

		// Finals!
		const stage5Teams = stage4Teams.filter((team) => team.place === 1);
		const stage5 = new PreFinalRound({
			name: "Half-finals",
			teams: stage5Teams,
		});
		this.rounds.push(stage5);
		stage5.start();

		this.winner = stage5Teams.find((team) => team.place === 1);

		this.showStats();
	}

	showStats() {
		console.log("--------- Tournament Results ---------");
		this.rounds.forEach((round) => round.showStats());
		console.log("=====================================");
		console.log("         Winner: " + this.winner.name);
		console.log("=====================================");
	}
}
