
const logoModules = import.meta.glob('./*.png', { eager: true });

const abbreviationToUrl = Object.entries(logoModules).reduce((acc, [path, mod]) => {
  const match = path.match(/\.\/([A-Z]+)\.png$/);
  if (match) {
    acc[match[1]] = mod.default || mod;
  }
  return acc;
}, {});

abbreviationToUrl['WASC'] = abbreviationToUrl['WASC'] || abbreviationToUrl['WAS'];

export function getTeamLogoUrlByAbbreviation(abbreviation) {
  if (!abbreviation) return null;
  return abbreviationToUrl[abbreviation] || null;
}

export function getTeamLogoUrl(team) {
  if (!team) return null;
  if (team.full_name === 'Washington Capitols' && abbreviationToUrl['WASC']) {
    return abbreviationToUrl['WASC'];
  }
  return getTeamLogoUrlByAbbreviation(team.abbreviation);
}


