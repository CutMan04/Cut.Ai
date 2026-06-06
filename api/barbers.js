export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { lat, lng } = req.body;
  if (!lat || !lng) return res.status(400).json({ error: 'Location required' });

  const key = process.env.GOOGLE_PLACES_API_KEY;

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=8000&type=hair_care&keyword=barbershop&key=${key}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return res.status(500).json({ error: 'Google Places error: ' + data.status });
    }

    const barbers = (data.results || []).slice(0, 6).map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating || null,
      totalRatings: place.user_ratings_total || 0,
      openNow: place.opening_hours?.open_now ?? null,
      photo: place.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${key}`
        : null,
      mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
    }));

    res.status(200).json({ barbers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
