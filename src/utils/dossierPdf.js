export function openBrandedDossierPDF(trek, formattedStartingPrice, sortedItinerary, gearCategories) {
  const win = window.open('', '_blank', 'width=960,height=800');
  if (!win) {
    alert('Please allow pop-ups to generate your branded PDF brochure.');
    return;
  }

  const itineraryRows = (sortedItinerary || [])
    .map(
      (d) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #D8D5CA;font-weight:600;color:#142C25;">Day ${d.day}</td>
        <td style="padding:10px;border-bottom:1px solid #D8D5CA;font-weight:600;">${d.route}</td>
        <td style="padding:10px;border-bottom:1px solid #D8D5CA;">${d.elevation}</td>
        <td style="padding:10px;border-bottom:1px solid #D8D5CA;">${d.accommodation}</td>
      </tr>`
    )
    .join('');

  const inclusionsHtml = (trek.inclusions || [])
    .map((inc) => `<li style="margin-bottom:6px;">✓ ${inc}</li>`)
    .join('');

  const gearHtml = (gearCategories || [])
    .map(
      (cat) => `
      <div style="margin-bottom:12px;">
        <div style="font-weight:700;color:#142C25;margin-bottom:4px;">${cat.category}</div>
        <div style="font-size:12px;color:#333;">${cat.items.join(' · ')}</div>
      </div>`
    )
    .join('');

  win.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${trek.name} — AscentK2 Treks Dossier</title>
        <style>
          body { font-family: Arial, sans-serif; color: #151A18; margin: 0; padding: 32px; background: #fff; }
          .header { background: #142C25; color: #fff; padding: 28px; border-radius: 8px; margin-bottom: 24px; }
          .gold { color: #C5A46D; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }
          h1 { margin: 8px 0 6px; font-size: 28px; }
          .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
          .stat-box { background: #F6F5F0; border: 1px solid #D8D5CA; padding: 12px; border-radius: 6px; }
          .stat-label { font-size: 10px; text-transform: uppercase; color: #666; }
          .stat-val { font-size: 14px; font-weight: 700; margin-top: 4px; color: #142C25; }
          h2 { font-size: 18px; color: #142C25; border-bottom: 2px solid #C5A46D; padding-bottom: 6px; margin-top: 26px; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 10px; }
          th { background: #151A18; color: #C5A46D; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; }
          @media print { body { padding: 12px; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align:right;margin-bottom:14px;">
          <button onclick="window.print()" style="background:#142C25;color:#fff;border:none;padding:10px 20px;border-radius:20px;cursor:pointer;font-weight:bold;">
            Save as PDF / Print Brochure
          </button>
        </div>

        <div class="header">
          <div class="gold">AscentK2 Treks · Gilgit-Baltistan, Pakistan</div>
          <h1>${trek.name}</h1>
          <p style="margin:0;opacity:0.85;font-size:14px;">${trek.tagline}</p>
        </div>

        <div class="stats">
          <div class="stat-box"><div class="stat-label">Duration</div><div class="stat-val">${trek.durationLabel}</div></div>
          <div class="stat-box"><div class="stat-label">Difficulty</div><div class="stat-val">${trek.difficulty}</div></div>
          <div class="stat-box"><div class="stat-label">Max Altitude</div><div class="stat-val">${trek.maxAltitude}</div></div>
          <div class="stat-box"><div class="stat-label">Starting From</div><div class="stat-val">${formattedStartingPrice}</div></div>
        </div>

        <h2>Route Overview</h2>
        <p style="font-size:13px;line-height:1.6;">${(trek.overview || [trek.tagline]).join('</p><p style="font-size:13px;line-height:1.6;">')}</p>

        <h2>Day-by-Day Itinerary</h2>
        <table>
          <thead><tr><th>Day</th><th>Route</th><th>Elevation</th><th>Accommodation</th></tr></thead>
          <tbody>${itineraryRows}</tbody>
        </table>

        <h2>What's Included</h2>
        <ul style="font-size:13px;list-style:none;padding-left:0;">${inclusionsHtml}</ul>

        <h2>Essential Packing Checklist</h2>
        ${gearHtml}

        <div style="margin-top:30px;padding-top:14px;border-top:1px solid #D8D5CA;font-size:11px;color:#666;">
          AscentK2 Treks · Main Bazaar, Gilgit, Gilgit-Baltistan, Pakistan · info@ascentk2treks.com · +92-355-5550192
        </div>
      </body>
    </html>
  `);
  win.document.close();
}