class Team {
	constructor({ name, association, seed }) {
		this.name = name;
		this.association = association;
		this.seed = seed;
		this.matchGoals = 0; // reset every match
		this.groupGoals = []; // [goalsNum, opponentName, awayBool]
		this.groupPoints = []; // [pointsNum, opponentName]
		this.tournamentGoals = 0;
		this.tournamentPoints = 0;
	}

	addGoals(goalsNum, opponentName, isAway) {
		this.groupGoals.push([goalsNum, opponentName, isAway]);
		this.tournamentGoals += goalsNum;
	}

	addPoints(pointsNum, opponentName) {
		this.groupPoints.push([pointsNum, opponentName]);
		this.tournamentPoints += pointsNum;
	}

	// Get points scored against opponent
	// No arg: Get total points
	getGroupPoints(opponent) {
		return this.groupPoints
			.filter((cur) => (opponent ? cur[1] === opponent.name : true))
			.map((cur) => cur[0])
			.reduce((acc, cur) => acc + cur, 0);
	}

	// Get goals scored against opponent
	// No arg: Get total goals
	getGroupGoals(opponent) {
		return this.groupGoals
			.filter((cur) => (opponent ? cur[1] === opponent.name : true))
			.map((cur) => cur[0])
			.reduce((acc, cur) => acc + cur, 0);
	}

	// Get goals scored against opponent when playing away from home
	getGroupGoalsAway(opponent) {
		return this.groupGoals
			.filter((cur) => cur[1] === opponent.name && cur[2] === true)
			.map((cur) => cur[0])
			.reduce((acc, cur) => acc + cur, 0);
	}
}
