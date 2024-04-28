// Parameters
import { questions } from './Quizz';

const clientId = "69d9384d9b8b4c9eabe153ef7b638a8e"; // your clientId
export const redirectUrl = "https://main--statify-ensc.netlify.app/"; // your redirect URL - must be localhost URL and/or HTTPS
const authorizationEndpoint = "https://accounts.spotify.com/authorize";
const tokenEndpoint = "https://accounts.spotify.com/api/token";
const scope = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-playback-state",
  "user-modify-playback-state",
].join(" ");

// Data structure that manages the current active token, caching it in localStorage
const currentToken = {
  get access_token() {
    return localStorage.getItem("access_token") || null;
  },
  get refresh_token() {
    return localStorage.getItem("refresh_token") || null;
  },
  get expires_in() {
    return localStorage.getItem("refresh_in") || null;
  },
  get expires() {
    return localStorage.getItem("expires") || null;
  },

  save: function (response) {
    const { access_token, refresh_token, expires_in } = response;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("expires_in", expires_in);

    const now = new Date();
    const expiry = new Date(now.getTime() + expires_in * 1000);
    localStorage.setItem("expires", expiry);
  },
};

// On page load, try to fetch auth code from current browser search URL
const args = new URLSearchParams(window.location.search);
const code = args.get("code");

// If we find a code, we're in a callback, do a token exchange
if (code) {
  const token = await getToken(code);
  currentToken.save(token);

  // Remove code from URL so we can refresh correctly.
  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  const updatedUrl = url.search ? url.href : url.href.replace("?", "");
  window.history.replaceState({}, document.title, updatedUrl);
}

export async function redirectToSpotifyAuthorize() {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = crypto.getRandomValues(new Uint8Array(64));
  const randomString = randomValues.reduce(
    (acc, x) => acc + possible[x % possible.length],
    ""
  );

  const code_verifier = randomString;
  const data = new TextEncoder().encode(code_verifier);
  const hashed = await crypto.subtle.digest("SHA-256", data);

  const code_challenge_base64 = btoa(
    String.fromCharCode(...new Uint8Array(hashed))
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  window.localStorage.setItem("code_verifier", code_verifier);

  const authUrl = new URL(authorizationEndpoint);
  const params = {
    response_type: "code",
    client_id: clientId,
    scope: scope,
    code_challenge_method: "S256",
    code_challenge: code_challenge_base64,
    redirect_uri: redirectUrl,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString(); // Redirect the user to the authorization server for login
}

// Soptify API Calls
async function getToken(code) {
  const code_verifier = localStorage.getItem("code_verifier");

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUrl,
      code_verifier: code_verifier,
    }),
  });

  return await response.json();
}

async function refreshToken() {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: currentToken.refresh_token,
    }),
  });

  return await response.json();
}

// Click handlers
export async function loginSpotify() {
  await redirectToSpotifyAuthorize();
}

export async function logoutSpotify() {
  localStorage.clear();
  window.location.href = redirectUrl;
}

export async function refreshSpotify() {
  const token = await refreshToken();
  currentToken.save(token);
}

export function isLogged() {
  return currentToken.access_token != null;
}

// Fetch functions
async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${currentToken.access_token}`,
    },
    method,
    body: JSON.stringify(body),
  });

  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function getUserData() {
  return await fetchWebApi("v1/me/", "GET");
}

export async function getTopTracks(limit = 5) {
    const endpoint = `v1/me/top/tracks?time_range=long_term&limit=${limit}`;
    return (
        await fetchWebApi(endpoint, "GET")
    ).items;
}

export async function getTopArtists(limit = 5) {
    const endpoint = `v1/me/top/artists?time_range=long_term&limit=${limit}`;
    return (
        await fetchWebApi(endpoint, "GET")
    ).items;
}

export async function getPlaybackState() {
  return await fetchWebApi("v1/me/player?market=FR", "GET");
}

export async function playBestSongOfTheKnownUniverse() {
  const body = { uris: ["spotify:track:60JWUDrpUTuu6gxTvknjg5"] };
  return await fetchWebApi("v1/me/player/play", "PUT", body);
}

export async function getUserPlaylists() {
  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${currentToken.access_token}`,
    },
  });
  const data = await response.json();

  // Récupérer les données pertinentes pour chaque playlist
  const playlists = data.items.map(item => {
    return {
      id: item.id,
      name: item.name,
      imageUrl: item.images.length > 0 ? item.images[0].url : null, // URL de l'image de la playlist
      // Autres données de la playlist si nécessaire
    };
  });

  return playlists;
}

export async function getRecommendations() {
  try {
    // Endpoint pour obtenir les recommandations de pistes de l'utilisateur
    const endpoint = 'v1/recommendations';

    // Paramètres de requête pour spécifier des pistes de graines (facultatif)
    const queryParams = {
      seed_tracks: 'ID_PISTE_1,ID_PISTE_2', // Remplacez ID_PISTE_1, ID_PISTE_2 par les ID des pistes de graines
      seed_artists: 'ID_ARTISTE_1,ID_ARTISTE_2', // Remplacez ID_ARTISTE_1, ID_ARTISTE_2 par les ID des artistes de graines
      seed_genres: 'pop,rock', // Remplacez pop, rock par les genres musicaux de graines
      limit: 10, // Nombre maximal de pistes recommandées
    };
    

    // Faire une requête GET à l'API Spotify avec les paramètres de requête
    const response = await fetchWebApi(endpoint, 'GET', queryParams);

    // Vérifier si la réponse est réussie
    if (response.status === 200) {
      // Convertir la réponse en JSON
      const data = await response.json();

      // Renvoyer les recommandations de pistes
      return data;
    } else {
      // Gérer les erreurs
      console.error('Erreur lors de la récupération des recommandations de pistes:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations de pistes:', error.message);
    return null;
  }
}

export async function getTrackDetails(trackId) {
  try {
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de la piste:", error);
    throw error;
  }
}

// Fonction pour obtenir les détails d'un artiste spécifique
export async function getArtistDetails(artistId) {
    const endpoint = `v1/artists/${artistId}`;
    return await fetchWebApi(endpoint, 'GET');
}

// Calcul des statistiques de consomation 
export async function musicalTastes() {
    let allTracks = [];
    let tracks;

    // Récupération des 300 pistes
    do {
        tracks = await getTopTracks();  // Cette fonction doit gérer la pagination
        allTracks.push(...tracks);
    } while (tracks.length > 0 && allTracks.length < 300);

    // Extraction des IDs uniques des artistes
    const artistIds = new Set(allTracks.map(track => track.artists.map(artist => artist.id)).flat());

    // Récupération des genres pour chaque artiste et comptage
    let genresCount = {};
    for (let artistId of artistIds) {
        const artistDetails = await getArtistDetails(artistId);
        artistDetails.genres.forEach(genre => {
            genresCount[genre] = (genresCount[genre] || 0) + 1;
        });
    }

    // Trier les genres par nombre de comptages et prendre les 5 premiers
    const sortedGenres = Object.entries(genresCount).sort((a, b) => b[1] - a[1]);
    const topGenres = sortedGenres.slice(0, 5);
    const otherGenres = sortedGenres.slice(5);

    // Calculer le total des comptages pour les genres "Autres"
    const otherCount = otherGenres.reduce((sum, [_, count]) => sum + count, 0);

    // Inclure "Autres" dans les résultats si nécessaire
    if (otherCount > 0) {
        topGenres.push(["Autres", otherCount]);
    }

    // Calcul du pourcentage pour chaque genre dans le top 5 et "Autres"
    let totalGenres = Object.values(genresCount).reduce((sum, current) => sum + current, 0);
    let genresPercentage = {};
    topGenres.forEach(([genre, count]) => {
        genresPercentage[genre] = ((count / totalGenres) * 100).toFixed(2) + '%';
    });

    return genresPercentage;
}


export async function searchArtist(artistName) {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`);
  const data = await response.json();
  return data.artists.items[0]; // Nous prenons seulement le premier résultat pour simplifier
}

export async function getTotalListeningTime() {
  const userData = await getUserData();
  const totalListeningTimeMs = userData.listeningTime;
  // Convertir la durée totale d'écoute en heures, minutes et secondes
  const totalListeningTime = convertMsToTime(totalListeningTimeMs);
  return totalListeningTime;
}

// Fonction utilitaire pour convertir la durée en millisecondes en heures, minutes et secondes
function convertMsToTime(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return { hours, minutes, seconds };
}

export async function getTopTracksImages(limit = 5) {
    const endpoint = `v1/me/top/tracks?time_range=long_term&limit=${limit}`;
    const response = await fetchWebApi(endpoint, "GET");
    
    // Vérifie si la réponse contient des items
    if (response && response.items) {
        return response.items.map(track => ({
            ...track,
            imageUrl: track.album && track.album.images && track.album.images.length > 0 ? track.album.images[0].url : "/default_image.png", // Utilisez une image par défaut si aucune image d'album n'est disponible
        }));
    } else {
        // Gère le cas où la réponse n'est pas ce qui est attendu
        console.error('Invalid response from Spotify API:', response);
        return []; // Retourne un tableau vide pour éviter des erreurs
    }
}

export async function getTopArtistsImages(limit = 5) {
    const endpoint = `v1/me/top/artists?time_range=long_term&limit=${limit}`;
    const response = await fetchWebApi(endpoint, "GET");
    
    // Check if the response contains items
    if (response && response.items) {
        return response.items.map(artist => ({
            ...artist,
            imageUrl: artist.images && artist.images.length > 0 ? artist.images[0].url : "/default_artist_image.png", // Use a default image if no artist images are available
        }));
    } else {
        // Handle the case where the response is not what is expected
        console.error('Invalid response from Spotify API:', response);
        return []; // Return an empty array to avoid errors
    }
}

export async function generateQuizQuestion() {
  try {
    const randomIndex = Math.floor(Math.random() * 2);

    if (randomIndex === 0) {
      const topArtists = await getTopArtists(50);
      if (!topArtists.length) throw new Error('No top artists found.');

      const randomArtistIndex = Math.floor(Math.random() * topArtists.length);
      const artist = topArtists[randomArtistIndex];

      const topTracksResponse = await fetchWebApi(`v1/artists/${artist.id}/top-tracks`, 'GET');
      const topTracks = topTracksResponse.tracks;

      if (!topTracks || topTracks.length === 0) {
        throw new Error('No top tracks found for the selected artist.');
      }

      const correctAnswer = {
        name: topTracks[0].name,
        imageUrl: topTracks[0].album.images[0].url
      };

      const shuffledTracks = topTracks.sort(() => 0.5 - Math.random());
      const wrongAnswers = shuffledTracks.slice(1, 4).map(track => ({
        name: track.name,
        imageUrl: track.album.images[0].url
      }));

      const question = `Quel est le titre le plus écouté de ${artist.name}?`;
      const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());

      return {
        question: question,
        options: options,
        correctAnswer: correctAnswer.name,
      };
    } else {
      const topTracks = await getTopTracks(50);
      if (!topTracks.length) throw new Error('No top tracks found.');

      const randomTrackIndex = Math.floor(Math.random() * topTracks.length);
      const track = topTracks[randomTrackIndex];

      const topArtists = await getTopArtists(50);
      if (!topArtists.length) throw new Error('No top artists found.');

      // Sélectionner aléatoirement trois artistes incorrects parmi les artistes préférés de l'utilisateur
      const randomOtherArtists = shuffleArray(topArtists).slice(0, 3);

      // Formuler la question
const question = `Quel artiste a sorti "${track.name}"?`;

// Récupérer les images des artistes
const correctArtist = track.artists[0];
const correctArtistDetailsResponse = await fetchWebApi(`v1/artists/${correctArtist.id}`, 'GET');
console.log('correctArtistDetailsResponse:', correctArtistDetailsResponse); // Ajoutez cette ligne pour afficher la réponse dans la console
const correctArtistDetails = correctArtistDetailsResponse; // Utilisez directement la réponse si elle est déjà au format JSON
const correctArtistImageUrl = correctArtistDetails.images.length > 0 ? correctArtistDetails.images[0].url : '';
const otherArtists = await getTopArtistsImages(randomOtherArtists.length);

const options = [
  { name: correctArtist.name, imageUrl: correctArtistImageUrl }, // Réponse correcte
  ...otherArtists.map((artist, index) => ({
    name: artist.name,
    imageUrl: artist.imageUrl // Utiliser les images récupérées pour les artistes incorrects
  })) // Réponses incorrectes
];

return {
  question: question,
  options: shuffleArray(options),
  correctAnswer: correctArtist.name,
};

    }
  } catch (error) {
    console.error('Erreur lors de la génération de la question de quiz:', error);
    return null;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}