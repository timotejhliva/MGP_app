const RaceItem = ({ race, onAdjust, onToggleGrouped }) => {
  const adults = race.riders.filter(r => r.type === 'adult').length;
  const juniors = race.riders.filter(r => r.type === 'junior').length;
  const children = race.riders.filter(r => r.type === 'child').length;

  return (
    <div className="border p-4 bg-gray-50 rounded">
      <div className="flex justify-between mb-2">
        <span>Jazda #{race.number} (Kapacita: {race.capacity})</span>
        <label>
          <input
            type="checkbox"
            checked={race.grouped || false}
            onChange={e => onToggleGrouped(race.id, e.target.checked)}
          /> Spojené skupiny
        </label>
      </div>

      <div className="space-y-1">
        {['adult', 'junior', 'child'].map(type => (
          <div key={type} className="flex items-center gap-2">
            <span className="capitalize w-20">{type}:</span>
            <button onClick={() => onAdjust(race.id, type, -1)} className="px-2">-</button>
            <span>{race.riders.filter(r => r.type === type).length}</span>
            <button onClick={() => onAdjust(race.id, type, 1)} className="px-2">+</button>
          </div>
        ))}
      </div>
    </div>
  );
};
