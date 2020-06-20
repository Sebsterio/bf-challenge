const getTeamsFromData = (teamData) => teamData.map((props) => new Team(props));

class Tournament {
	constructor({ teamData }) {
		this.teams = getTeamsFromData(teamData);
		this.rounds = [];
	}

	start() {
		const groupStage = new Round({ name: "Group Stage", teams: this.teams });
		this.rounds.push(groupStage);
		groupStage.start();

		// const stage2Teams = this.teams.filter((team) => team.place < 3);
		// const stage2 = new Round({ name: "Last 16", teams: stage2Teams });
		// stage2.start();

		// console.log('stage2Teams ', stage2Teams);
		// const stage3Teams = this.knockOutRound(stage2Teams)

		this.showResults();
	}

	showResults() {
		console.log("--------- Tournament Results ---------");
		this.rounds.forEach((round) => round.showResults());
		console.log("done");
	}
}
