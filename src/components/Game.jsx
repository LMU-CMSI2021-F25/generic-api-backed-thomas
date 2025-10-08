import { getTeamAccentColor, hexToRgb } from './Color';
import { toBBRTeamCode } from './teams';
import { getTeamLogoUrlByAbbreviation } from '../assets/logoMap';

function periodToOvertime(period) {
    switch (period) {
        case 4:
            return "No Overtime";
        case 5:
            return "1OT";
        case 6:
            return "2OT";
        case 7:
            return "3OT";
        case 8:
            return "4OT";
        case 9:
            return "5OT";
        case 10:
            return "6OT";
    default:
        return "Unknown";
    }
}

function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-').map(Number);
    const months = [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December'
    ];
    const suffix = (n) => {
      if (n % 100 >= 11 && n % 100 <= 13) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    return `${months[month - 1]} ${day}${suffix(day)}, ${year}`;
  }

const Game = ({ game }) => {
    // true if home team won, false if away team won
    const homeTeamWon = game.home_team_score > game.visitor_team_score;
    const gameTimeString = game.date.replaceAll("-", "") + "0";
    const accentHex = getTeamAccentColor(game.home_team);
    const { r, g, b } = hexToRgb(accentHex);
    return (
        <div className="game" style={{ '--accent-r': r, '--accent-g': g, '--accent-b': b }}>
            <div className="game-header">
                <img
                    className="game-team-logo"
                    src={getTeamLogoUrlByAbbreviation(game.home_team.abbreviation) || ''}
                    alt={game.home_team.full_name}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="game-team-name">{game.home_team.abbreviation}</div>
                <span className={homeTeamWon ? "winner-badge" : "loser-badge"}>{homeTeamWon ? "W" : "L"}</span>
                <div className="game-score">{game.home_team_score} — {game.visitor_team_score}</div>
                <div className="align-right player-title">
                    <span className={!homeTeamWon ? "winner-badge" : "loser-badge"}>{!homeTeamWon ? "W" : "L"}</span>
                    <div className="game-team-name">{game.visitor_team.abbreviation}</div>
                        <img 
                        className="game-team-logo"
                        src={getTeamLogoUrlByAbbreviation(game.visitor_team.abbreviation) || ''}
                        alt={game.visitor_team.full_name}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                </div>
            </div>
            <div className="game-footer">
                {formatDate(game.date)} - {periodToOvertime(game.period)}
            </div>
            <a className="game-more-info" href={`https://www.basketball-reference.com/boxscores/${gameTimeString}${toBBRTeamCode(game.home_team.abbreviation)}.html`} target="_blank">More Info</a>
        </div>
    )
}

export default Game;