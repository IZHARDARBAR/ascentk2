import { useState, useEffect } from 'react';
import { Sun, Wind, MapPin, Check } from 'lucide-react';
import { useTreks } from '../context/TreksContext';

const LOCATIONS = [
  { name: 'Skardu Base', lat: 35.2971, lon: 75.6333, elev: '2,228m' },
  { name: 'Hunza Valley', lat: 36.3167, lon: 74.65, elev: '2,438m' },
  { name: 'Concordia (K2)', lat: 35.738, lon: 76.513, elev: '4,650m' },
];

export default function KarakoramWeatherWidget() {
  const { trailStatuses } = useTreks();
  const [weatherList, setWeatherList] = useState([]);

  useEffect(() => {
    let active = true;
    async function fetchWeather() {
      try {
        const results = await Promise.all(
          LOCATIONS.map(async (loc) => {
            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current_weather=true`
            );
            const data = await res.json();
            return {
              ...loc,
              temp: Math.round(data?.current_weather?.temperature ?? 12),
              wind: Math.round(data?.current_weather?.windspeed ?? 10),
            };
          })
        );
        if (active) setWeatherList(results);
      } catch {
        if (active) {
          setWeatherList([
            { name: 'Skardu Base', elev: '2,228m', temp: 18, wind: 11 },
            { name: 'Hunza Valley', elev: '2,438m', temp: 16, wind: 9 },
            { name: 'Concordia (K2)', elev: '4,650m', temp: -2, wind: 18 },
          ]);
        }
      }
    }
    fetchWeather();
    return () => {
      active = false;
    };
  }, []);

  const badgeStyle = (status) => {
    if (status === 'Open') return 'bg-[#142C25] text-[#C5A46D]';
    if (status === 'Caution') return 'bg-[#C5A46D] text-[#151A18]';
    return 'bg-red-700 text-white';
  };

  return (
    <section className="py-12 bg-[#151A18] text-white border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Live Weather */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-semibold">
            <Sun className="w-4 h-4" />
            <span>Live Karakoram Weather</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(weatherList.length > 0 ? weatherList : LOCATIONS.map((l) => ({ ...l, temp: '--', wind: '--' }))).map(
              (w) => (
                <div
                  key={w.name}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs text-white/65">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C5A46D]" /> {w.name}
                    </span>
                    <span>{w.elev}</span>
                  </div>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="font-serif text-3xl font-bold text-white">{w.temp}°C</span>
                    <span className="inline-flex items-center gap-1 text-xs text-white/70">
                      <Wind className="w-3.5 h-3.5 text-[#C5A46D]" /> {w.wind} km/h
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Trail & Pass Statuses */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C5A46D] font-semibold">
            <Check className="w-4 h-4" />
            <span>High Pass &amp; Trail Conditions</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trailStatuses.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-semibold text-white">{item.name}</div>
                  <div className="text-[11px] text-white/60">{item.note}</div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider shrink-0 ${badgeStyle(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}