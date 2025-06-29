import React, { useEffect, useState } from 'react';
import '../style.css'

const RaceManager = () => {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    fetch('/api/races')
      .then(res => res.json())
      .then(data => setRaces(data));
  }, []);



  const addNewRace = () => {
    fetch('/api/races/new', { method: 'POST' })
      .then(res => res.json())
      // .then(data => setRaces(prev => [data.race, ...prev]));

      .then(data => {
      const newRace = {
        id_day: data.id_day,
        date: new Date().toISOString().slice(0, 10),
        time: 0,
        adults_count: 0,
        juniors_count: 0,
        children_count: 0,
        note: '',
        grouped: false,
        id: -1  // Dočasné ID, backend nemá ID, uprav podľa potreby
      };

      setRaces(prev => {
        if (!prev || prev.length === 0) {
          // Ak je prázdne, pridaj s id_day = 1
          return [{ ...newRace, id_day: 1 }, ...prev];
        } else {
          // Pridaj novú jazdu na začiatok
          return [newRace, ...prev];
        }
      });
    });
  };

  const adjustRiders = (raceId, type, delta) => {
    fetch(`/api/races/${raceId}/adjust`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [type]: delta })
    }).then(() => {
      setRaces(prev => prev.map(r => r.id === raceId ? {
        ...r,
        riders: adjustLocalRiders(r.riders, type, delta)
      } : r));
    });
  };

  const toggleGrouped = (raceId, grouped) => {
    fetch(`/api/races/${raceId}/grouped`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grouped })
    }).then(() => {
      setRaces(prev => prev.map(r => r.id === raceId ? { ...r, grouped } : r));
    });
  };

  const adjustLocalRiders = (riders, type, delta) => {
    let updated = [...riders];
    if (delta > 0) {
      for (let i = 0; i < delta; i++) updated.push({ name: "unknown", type });
    } else {
      let count = 0;
      updated = updated.filter(r => {
        if (r.type === type && count < Math.abs(delta)) {
          count++;
          return false;
        }
        return true;
      });
    }
    return updated;
  };





 return (
    <div className="manager-container">
      <button onClick={addNewRace} className="add-button">+ Pridať novú jazdu</button>
      {races.length > 0 && (
        <div className="race-item">
          <div className="race-header">
            <h2>Posledná jazda #{races[0].number}</h2>
          </div>
          <RaceItem race={races[0]} onAdjust={adjustRiders} onToggleGrouped={toggleGrouped} />
        </div>
      )}

      <div className="scrollable-races">
        {races.slice(1).map(r => (
          <RaceItem key={r.id} race={r} onAdjust={adjustRiders} onToggleGrouped={toggleGrouped} />
        ))}
      </div>
    </div>
  );
};

const RaceItem = ({ race, onAdjust, onToggleGrouped }) => {
  return (
    <div className="race-item">
      <div className="race-header">
        <span>Jazda #{race.number} (Kapacita: {race.capacity})</span>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={race.grouped || false}
            onChange={e => onToggleGrouped(race.id, e.target.checked)}
          /> Spojené skupiny
        </label>
      </div>
      {/*<div>*/}
      {/*  {['adult', 'junior', 'child'].map(type => (*/}
      {/*    <div key={type} className="rider-row">*/}
      {/*      <span className="rider-label">{type}:</span>*/}
      {/*      <div className="counter-buttons">*/}
      {/*        <button className="minus" onClick={() => onAdjust(race.id, type, -1)}>-</button>*/}
      {/*        <span>{race.riders.filter(r => r.type === type).length}</span>*/}
      {/*        <button onClick={() => onAdjust(race.id, type, 1)}>+</button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*</div>*/}
    </div>
  );
};

export default RaceManager;
