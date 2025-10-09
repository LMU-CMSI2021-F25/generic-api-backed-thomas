import { TEAM_ABBREVIATIONS } from './teams';

const Selector = ({ selected, onChange, defaultOption = 'Select a team', label = 'Team Selector', options = TEAM_ABBREVIATIONS }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="team-select">
      <label className="team-select-label">{label}</label>
      <select 
        className="team-select-input"
        value={selected}
        onChange={handleChange}
      >
        <option value="">{defaultOption}</option>
        {options.map((abbr) => (
          <option key={abbr} value={abbr}>
            {abbr}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Selector;


