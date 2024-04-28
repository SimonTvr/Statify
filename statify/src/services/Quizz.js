import { searchArtist } from './spotify'; // Importez la fonction searchArtist depuis votre fichier spotify.js (ou tout autre fichier où elle est définie)

export const questions = [
  {
    text: "Quelle est l'artiste féminine #1 en ce moment ?",
    answers: [
      { imageUrl: "", text: "", correct: true }, // Mettez des valeurs vides pour l'instant, elles seront mises à jour par la suite
      { imageUrl: "", text: "", correct: false },
      { imageUrl: "", text: "", correct: false },
      { imageUrl: "", text: "", correct: false }
    ]
  },
  {
    text: "Quelle est l'artiste féminine #2 en ce moment ?",
    answers: [
      { imageUrl: "", text: "", correct: false },
      { imageUrl: "", text: "", correct: true },
      { imageUrl: "", text: "", correct: false },
      { imageUrl: "", text: "", correct: false }
    ]
  }
];

// Fonction pour mettre à jour les données de question avec les informations récupérées de l'API Spotify
export async function updateQuestionDataWithSpotifyInfo() {
  for (const question of questions) {
    for (const answer of question.answers) {
      const artist = await searchArtist(answer.text); // Recherchez l'artiste dans l'API Spotify
      answer.imageUrl = artist.images[0]?.url || ""; // Mettez à jour l'URL de l'image avec celle récupérée de l'API Spotify
      answer.text = artist.name; // Mettez à jour le nom de l'artiste avec celui récupéré de l'API Spotify
    }
  }
}
