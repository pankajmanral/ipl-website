"use server";

const RAPID_HEADERS = {
  'x-rapidapi-key': 'b456313192msh64ecf2f7b1e9975p1aed90jsn265203a0cf4d',
  'x-rapidapi-host': 'cricket-api-free-data.p.rapidapi.com',
  'Content-Type': 'application/json'
};

export async function getLiveScores() {
  const url = 'https://cricket-api-free-data.p.rapidapi.com/cricket-livescores';
  try {
    const response = await fetch(url, { headers: RAPID_HEADERS, next: { revalidate: 60 } });
    const result = await response.json();
    if (result.status !== "success" || !result.response) return [];
    
    return result.response.filter((match: any) => 
      match.match_title?.toLowerCase().includes("ipl") || 
      match.match_title?.toLowerCase().includes("indian premier league")
    ).map((match: any) => ({
      match_id: match.match_id,
      match_title: `${match.team_a?.name} vs ${match.team_b?.name}`,
      status: match.status || "Live",
      score_a: match.team_a?.score,
      score_b: match.team_b?.score,
      overs_a: match.team_a?.overs,
      overs_b: match.team_b?.overs,
      venue: match.venue
    }));
  } catch (error) {
    console.error("Live score fetch error:", error);
    return [];
  }
}

export async function getMatchScoreboard(matchId: string) {
  const url = `https://cricket-api-free-data.p.rapidapi.com/cricket-match-scoreboard?matchid=${matchId}`;
  try {
    const response = await fetch(url, { headers: RAPID_HEADERS, next: { revalidate: 30 } });
    const result = await response.json();
    return result.status === "success" ? result.response : null;
  } catch (error) {
    console.error("Scoreboard fetch error:", error);
    return null;
  }
}

export async function getTeamPlayers(teamId: string) {
  const url = `https://cricket-api-free-data.p.rapidapi.com/cricket-players?teamid=${teamId}`;
  try {
    const response = await fetch(url, { headers: RAPID_HEADERS, next: { revalidate: 3600 } });
    const result = await response.json();
    return result.status === "success" ? result.response : [];
  } catch (error) {
    console.error("Players fetch error:", error);
    return [];
  }
}
