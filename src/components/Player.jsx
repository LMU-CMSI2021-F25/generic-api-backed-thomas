import { getTeamAccentColor, hexToRgb } from './Color';
import { toBBRTeamCode } from './teams';

const Player = ({ player }) => {
    const accentHex = getTeamAccentColor(player.team);
    const { r, g, b } = hexToRgb(accentHex);
    return (
        <div className="player" style={{ '--accent-r': r, '--accent-g': g, '--accent-b': b }}>
            <div className="player-header">
                <img
                    className="team-logo"
                    src={`./src/assets/${player.team.abbreviation}.png`}
                    alt={player.team.full_name}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="player-title">
                    <a target="_blank" href={`https://www.basketball-reference.com/search/search.fcgi?hint=${player.first_name}+${player.last_name}&search=${player.first_name}+${player.last_name}&pid=&idx=&hint_language=en`}>
                        <h2 className="player-name">{player.first_name} {player.last_name}</h2>
                    </a>
                    <span className="badge">{getPosition(player.position)}</span>
                </div>
            </div>
            <div className="player-body">
                {player.team.city ? (
                        <a target="_blank" href={`https://nba.com/${player.team.name.toLowerCase()}`}>
                            <p className="team-name team-hoverable">{player.team.full_name}</p>
                        </a>
                    ) : (
                        <a target="_blank" href={`https://www.basketball-reference.com/teams/${toBBRTeamCode(player.team.abbreviation)}`}>
                            <p className="team-name team-hoverable">{player.team.full_name}</p>
                        </a>
                    )}
                {(player.height || player.weight) && (
                    <p className="physique">{player.height ? player.height : ''} {player.weight ? `${player.weight} pounds` : ''}</p>
                )}
                {player.college && (
                    <p className="college-line">Last Team: {player.college}</p>
                )}
                {player.country && (
                    <p className="country-line">{player.country}</p>
                )}
                {player.jersey_number && (
                    <p className="jersey-line">Last Jersey: #{player.jersey_number}</p>
                )}
                {(player.draft_number || player.draft_round || player.draft_year) && (
                    <p className="draft-line">
                        Draft: 
                        {player.draft_year ? ` ${player.draft_year}` : ''}
                        {player.draft_round ? ` • Round ${player.draft_round}` : ''}
                        {player.draft_number ? ` • Pick ${player.draft_number}` : ''}
                    </p>
                )}
            </div>
        </div>
    );
}

const getPosition = (position) => {
    if (position === "F") {
        return "Forward";
    } else if (position === "C") {
        return "Center";
    } else if (position === "G") {
        return "Guard"
    } else if (position === "G-F") {
        return "Guard-Forward";
    } else {
        return "Not Listed";
    }
}

export default Player;