
import React from 'react';
import { getTeamAccentColor, hexToRgb } from './Color';
import { toBBRTeamCode } from './teams';
import { getTeamLogoUrl } from '../assets/logoMap';

const Team = ({ team }) => {
    const accentHex = getTeamAccentColor(team);
    const { r, g, b } = hexToRgb(accentHex);
    return (
        <div className="team" style={{ '--accent-r': r, '--accent-g': g, '--accent-b': b }}>
            <div className="team-header">
                <img
                    className="team-logo"
                    src={getTeamLogoUrl(team) || ''}
                    alt={team.full_name}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div>
                    {team.city ? (
                        <a target="_blank" href={`https://nba.com/${team.name.toLowerCase()}`}>
                            <h2 className="team-name team-hoverable">{team.full_name}</h2>
                        </a>
                    ) : (
                        <a target="_blank" href={`https://www.basketball-reference.com/teams/${toBBRTeamCode(team.abbreviation)}`}>
                            <h2 className="team-name team-hoverable">{team.full_name}</h2>
                        </a>
                    )}
                </div>
            </div>
            <div>
                <p>Conference: {team.conference.trim() || "None Provided by API"}</p>
                <p>Division: {team.division.trim() || "None Provided by API"}</p>
                <p>Abbreviation: {team.abbreviation}</p>
            </div>
        </div>
  );
};

export default Team;

