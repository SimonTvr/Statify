import React, { useEffect, useState } from "react";
import "./RankingArtists.css";
import { getTopArtistsImages } from "../services/spotify";
import Button from "../components/Button"; 

function RankingArtists() {
    const [artists, setArtists] = useState([]);
    const [showMore, setShowMore] = useState(false);

    // Utilisez une fonction pour calculer la limite en fonction de l'état showMore
    const getLimit = () => (showMore ? 20 : 5);

    useEffect(() => {
        // Utilisez la fonction getLimit pour récupérer la limite actuelle
        const limit = getLimit();
        getTopArtistsImages(limit).then((artistsData) => {
            setArtists(artistsData);
        }).catch(error => {
            console.error('Error fetching top artists images:', error);
        });
    }, [showMore]); // Ajoutez showMore comme dépendance pour l'effet useEffect

    // La fonction pour basculer entre "Voir plus" et "Voir moins"
    const toggleArtists = () => {
        setShowMore(!showMore); // Inversez l'état du bouton lorsqu'il est cliqué
    };

    return (
        <div className="ranking-artists-container">
            {artists.map((artist, index) => (
                <div key={artist.id} className="artist-item">
                    <img src={artist.imageUrl} alt={artist.name} className="artist-image" />
                    <div className="artist-info">
                        <span className="artist-name">{artist.name}</span>
                    </div>
                </div>
            ))}
            <br></br>
            <div className="ranking-artists-container2">
                <Button onClick={toggleArtists} className="see-more-button" text={showMore ? "Voir moins" : "Voir plus"} />
            </div>
        </div>
    );
}

export default RankingArtists;