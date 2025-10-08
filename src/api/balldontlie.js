import { getTeamIdFromAbbreviation } from "../components/teams";

class RateLimitError extends Error {
  constructor() {
    super("Rate limited by API");
    this.name = "RateLimitError";
    this.code = "RATE_LIMIT";
  }
}

async function apiRequest(endpoint, params = {}) {
  const url = new URL(`https://api.balldontlie.io/v1/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== "") url.searchParams.append(key, String(value));
  });
  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
    },
  });
  if (response.status === 429) {
    throw new RateLimitError();
  }
  return await response.json();
}

export async function fetchPlayers({ firstName = "", lastName = "", perPage = 100 } = {}) {
  const json = await apiRequest("players", {
    per_page: perPage,
    first_name: firstName,
    last_name: lastName,
  });
  return json.data;
}

export async function fetchTeams() {
  const json = await apiRequest("teams");
  return json.data;
}

export async function fetchGames({
  startDate = "",
  endDate = "",
  postseason = false,
  perPage = 100,
  teamAbbreviation = "",
} = {}) {
  const params = {
    per_page: perPage,
    postseason: String(postseason),
  };
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  const teamId = getTeamIdFromAbbreviation(teamAbbreviation);
  if (teamId != null) params["team_ids[]"] = String(teamId);
  const json = await apiRequest("games", params);
  const filtered = (json.data || []).filter(
    (game) => game.period != 0 && game.home_team_score != 0 && game.visitor_team_score != 0
  );
  return { data: filtered, nextCursor: json.meta?.next_cursor };
}

export async function fetchMoreGames({
  startDate = "",
  endDate = "",
  postseason = false,
  perPage = 100,
  teamAbbreviation = "",
  cursor,
} = {}) {
  const params = {
    per_page: perPage,
    postseason: String(postseason),
  };
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  if (cursor != null) params.cursor = String(cursor);
  const teamId = getTeamIdFromAbbreviation(teamAbbreviation);
  if (teamId != null) params["team_ids[]"] = String(teamId);
  const json = await apiRequest("games", params);
  const filtered = (json.data || []).filter(
    (game) => game.period != 0 && game.home_team_score != 0 && game.visitor_team_score != 0
  );
  return { data: filtered, nextCursor: json.meta?.next_cursor };
}

export { RateLimitError };


