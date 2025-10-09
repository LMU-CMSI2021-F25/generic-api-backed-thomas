export const TEAM_ACCENT_MAP = {
    ATL: '#E03A3E',
    BKN: '#0f0f0f',
    BOS: '#007A33',
    CHA: '#1D1160',
    CHI: '#CE1141',
    CLE: '#6F263D',
    DAL: '#00538C',
    DEN: '#0E2240',
    DET: '#C8102E',
    GSW: '#1D428A',
    HOU: '#CE1141',
    IND: '#002D62',
    LAC: '#C8102E',
    LAL: '#552583',
    MEM: '#5D76A9',
    MIA: '#98002E',
    MIL: '#00471B',
    MIN: '#0C2340',
    NOP: '#0C2340',
    NYK: '#006BB6',
    OKC: '#007AC1',
    ORL: '#0077C0',
    PHI: '#006BB6',
    PHX: '#1D1160',
    POR: '#E03A3E',
    SAC: '#5A2D81',
    SAS: '#1a1818',
    TOR: '#CE1141',
    UTA: '#002B5C',
    WAS: '#002B5C',
};

function getTeamAccentColor(team) {
    const fallback = '#0095FF';
    if (!team.abbreviation) return fallback;
    if (team.full_name === 'Washington Capitols') {
        return '#0095FF';
    }
    return TEAM_ACCENT_MAP[team.abbreviation] || fallback;
}

function hexToRgb(hex) {
    let normalized = hex.replace('#', '');
    if (normalized.length === 3) {
        normalized = normalized.split('').map((c) => c + c).join('');
    }
    const r = parseInt(normalized.substring(0, 2), 16) || 0;
    const g = parseInt(normalized.substring(2, 4), 16) || 0;
    const b = parseInt(normalized.substring(4, 6), 16) || 0;
    return { r, g, b };
}

export { getTeamAccentColor, hexToRgb };