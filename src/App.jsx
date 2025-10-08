import { useState, useMemo } from "react";
import Text from "./components/Text";
import CategoryButton from "./components/CategoryButton";
import Player from "./components/Player";
import Selector from "./components/Selector";
import Input from "./components/Input";
import { getTeamIdFromAbbreviation } from "./components/teams";
import { fetchPlayers, fetchTeams, fetchGames, fetchMoreGames, RateLimitError } from "./api/balldontlie";
import Game from "./components/Game";
import Team from "./components/Team";

function App() {

  const [players, setPlayers] = useState([]);

  const [category, setCategory] = useState("players"); // players, teams, games

  const [playerFirstName, setPlayerFirstName] = useState("");
  const [playerLastName, setPlayerLastName] = useState("");
  
  const [allTeams, setAllTeams] = useState([]);

  const [games, setGames] = useState([]);
  const [gameStartDate, setGameStartDate] = useState("");
  const [gameEndDate, setGameEndDate] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(""); 
  const [isPostseason, setIsPostseason] = useState(false);
  const [gameCursor, setGameCursor] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [selectedConference, setSelectedConference] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");

  const filteredTeams = useMemo(() => {
    let result = allTeams;
    if (selectedConference !== "") {
      result = result.filter((team) => team.conference === selectedConference);
    }
    if (selectedDivision !== "") {
      result = result.filter((team) => team.division === selectedDivision);
    }
    return result;
  }, [allTeams, selectedConference, selectedDivision]);

  const getPlayer = async () => {
    if (playerFirstName === "" && playerLastName === "") {
      alert("Please provide either a first name or last name.");
      return;
    }
    try {
      const data = await fetchPlayers({ firstName: playerFirstName, lastName: playerLastName });
      setPlayers(data);
    } catch (err) {
      if (err?.code === "RATE_LIMIT") {
        alert("You have been rate limited. Please wait one minute, then try again.");
      } else {
        alert("An error occurred while fetching player. Please try again.");
      }
    }
  };

  const getTeams = async () => {
    if (allTeams.length > 0) {
      return allTeams;
    }
    try {
      const data = await fetchTeams();
      setAllTeams(data);
      return data;
    } catch (err) {
      if (err?.code === "RATE_LIMIT") {
        alert("You have been rate limited. Please wait one minute, then try again.");
        return undefined;
      }
      alert("An error occurred while fetching teams. Please try again.");
      return undefined;
    }
  };

  const getGames = async () => {
    try {
      const { data, nextCursor } = await fetchGames({
        startDate: gameStartDate,
        endDate: gameEndDate,
        postseason: isPostseason,
        perPage: 100,
        teamAbbreviation: selectedTeam,
      });
      if (data.length === 0) {
        alert("No games were found for the selected criteria.");
        return;
      }
      setGames(data);
      setGameCursor(nextCursor);
    } catch (err) {
      if (err?.code === "RATE_LIMIT") {
        alert("You have been rate limited. Please wait one minute, then try again.");
      } else {
        alert("An error occurred while fetching games. Please try again.");
      }
    }
  };

  const loadMoreGames = async () => {
    try {
      setIsLoadingMore(true);
      const { data, nextCursor } = await fetchMoreGames({
        startDate: gameStartDate,
        endDate: gameEndDate,
        postseason: isPostseason,
        perPage: 100,
        teamAbbreviation: selectedTeam,
        cursor: gameCursor,
      });
      if (data.length === 0) {
        alert("No games were found for the selected criteria.");
        return;
      }
      const dataToAdd = data.filter((game) => !games.some((g) => g.id === game.id));
      setGames([...games, ...dataToAdd]);
      setGameCursor(nextCursor);
    } catch (err) {
      if (err?.code === "RATE_LIMIT") {
        alert("You have been rate limited. Please wait one minute, then try again.");
      } else {
        alert("An error occurred while fetching games. Please try again.");
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleLoadResults = async () => {
    try {
      setIsLoading(true);
      if (category === "players") {
        await getPlayer();
      } else if (category === "games") {
        await getGames();
      } else if (category === "teams") {
        const list = await getTeams();
        const source = list ?? allTeams;
        let filtered = source;
        if (selectedConference !== "") {
          filtered = filtered.filter((team) => team.conference === selectedConference);
        }
        if (selectedDivision !== "") {
          filtered = filtered.filter((team) => team.division === selectedDivision);
        }
        if (filtered.length === 0) {
          alert("No teams were found for the selected criteria.");
          return;
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="box">
        <Text className="center" text="NBA Stats" type="h1"/>
        <Text className="center text-closer" text="View Historical NBA stats for players, teams, and games" type="p" />
      </div>
      <div className="categorySelector">
        <CategoryButton category="players" onClick={setCategory} isActive={category === "players"} />
        <CategoryButton category="games" onClick={setCategory} isActive={category === "games"} />
        <CategoryButton category="teams" onClick={setCategory} isActive={category === "teams"} />
      </div>
      <form className="searchBox" onSubmit={(e) => { e.preventDefault(); handleLoadResults(); }}>
        {category === "players" && (
          <div>
            <Input type="text" placeholder="First Name" value={playerFirstName} onChange={(e) => setPlayerFirstName(e.target.value)} />
            <Input type="text" placeholder="Last Name" value={playerLastName} onChange={(e) => setPlayerLastName(e.target.value)} />
          </div>
        )}
        {category === "teams" && (
          <div>
            <Selector selected={selectedConference} onChange={setSelectedConference} defaultOption="Select a conference" label="Conference Selector" options={["East", "West"]} />
            <Selector selected={selectedDivision} onChange={setSelectedDivision} defaultOption="Select a division" label="Division Selector" options={
              selectedConference === "" 
                ? ["Atlantic", "Central", "Southeast", "Northwest", "Pacific", "Southwest"]
                : (selectedConference === "East" 
                    ? ["Atlantic", "Central", "Southeast"] 
                    : ["Northwest", "Pacific", "Southwest"]) 
            } />
          </div>
        )}
        {category === "games" && (
          <div>
              <div className="center">
                <label className="group-label">Date Range</label>
              </div>
              <div className="dates">
                <label htmlFor="startDate">Start Date</label>
                <label htmlFor="endDate">End Date</label>
              </div>
              <div className="dates">
                <Input type="date" placeholder="Start Date" value={gameStartDate} onChange={(e) => setGameStartDate(e.target.value)} id="startDate" />
                <Input type="date" placeholder="End Date" value={gameEndDate} onChange={(e) => setGameEndDate(e.target.value)} id="endDate" />
              </div>
              <Selector selected={selectedTeam} onChange={setSelectedTeam} />
              <div className="center post-season-checkbox">
                <label htmlFor="isPostseason">Postseason</label>
                <Input type="checkbox" value={isPostseason} onChange={(e) => setIsPostseason(e.target.checked)} id="isPostseason" />
              </div>
          </div>
        )}
        <button className="category-button active" type="submit" disabled={isLoading}>{isLoading ? 'Loading…' : 'Load Results'}</button>
      </form>
      {isLoading && (
        <div className="loading"><span className="spinner" /> Loading…</div>
      )}
      {(
        <div className="results" style={{ display: category === "players" && players.length > 0 ? 'block' : 'none' }}>
          <div className="searchResults">
            {useMemo(() => players.map((player) => (
              <Player key={player.id} player={player} />
            )), [players])}
          </div>
        </div>
      )}
      {(
        <div className="results" style={{ display: category === "games" && games.length > 0 ? 'block' : 'none' }}>
          <div className="searchResults">
            {useMemo(() => games.map((game) => (
              <Game key={game.id} game={game} />
            )), [games])}
          </div>
          <div className="center">
            {games.length == 100 && (
              <button className="category-button active" onClick={() => loadMoreGames()} disabled={isLoadingMore}>{isLoadingMore ? 'Loading…' : 'Load More'}</button>
            )}
          </div>
        </div>
      )}
      {(
        <div className="results" style={{ display: category === "teams" && filteredTeams.length > 0 ? 'block' : 'none' }}>
          <div className="searchResults">
            {useMemo(() => {
              const seen = new Set();
              return filteredTeams.map((team) => {
                if (seen.has(team.full_name)) return null;
                seen.add(team.full_name);
                return <Team key={team.id} team={team} />;
              });
            }, [filteredTeams])}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;