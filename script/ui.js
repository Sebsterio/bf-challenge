const view = {
	tournamentStart: () => console.log("--- Tournament Started ---"),
	groupStageStart: () => console.log("--- Group Stage Draw  ---"),
	groupStart: (group, groupNum) => {
		console.log(
			`Group ${groupNum}: ${group.map((team) => team.name).join(", ")}`
		);
	},
	groupResults: () => console.log("Group Stage Results"),
	matchEnd: (homeTeam, guestTeam) => {
		console.log(
			`${homeTeam.matchGoals}:${guestTeam.matchGoals} --- ${homeTeam.name} vs ${guestTeam.name}`
		);
	},
	groupStageEnd: (tables) => {
		console.log("--- Group Stage Tables ---");
		tables.forEach((table) => {
			const [group, groupNum] = table;
			console.log("Group " + groupNum);
			console.table(
				group.map((team, i) => ({
					position: i + 1,
					team: team.name,
					points: team.getGroupPoints(),
					goals: team.getGroupGoals(),
				}))
			);
		});
	},
};
