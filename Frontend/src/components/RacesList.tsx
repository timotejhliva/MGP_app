// src/components/RacesList.js
import React from 'react';

const RacesList = ({ races, onConfirmRace }) => {
  return (
    <div className="races">
      <h2>Aktuálne jazdy</h2>
      {races.map((race) => (
        <div key={race.id} className="race-card">
          <h3>Jazda #{race.number}</h3>
          <p>
            🧍 {race.riders.length} / {race.capacity}
          </p>
          <div className="riders">
            {race.riders.map((rider, index) => (
              <span key={index} title={rider.name}>
                {rider.type === 'child' ? '🧒' : '🧑'}
              </span>
            ))}
          </div>
          {!race.completed && (
            <button onClick={() => onConfirmRace(race.id)}>✅ Potvrdiť jazdu</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default RacesList;
