import React, { useEffect, useState } from "react";
import "./RankingTracks.css";
import { getTopTracksImages } from "../services/spotify";
import Button from "../components/Button";

function RankingTracks() {
    const [tracks, setTracks] = useState([]);
    const [showMore, setShowMore] = useState(false);

    // Utilisez une fonction pour calculer la limite en fonction de l'état showMore
    const getLimit = () => (showMore ? 10 : 5);

    useEffect(() => {
        // Utilisez la fonction getLimit pour récupérer la limite actuelle
        const limit = getLimit(); 
        getTopTracksImages(limit).then((tracksData) => {
            if (Array.isArray(tracksData)) {
                setTracks(tracksData);
            }
        }).catch(error => {
            console.error('Error fetching top tracks:', error);
        });
    }, [showMore]); // Mettez à jour l'effet lorsque showMore change

    const toggleTracks = () => {
        setShowMore(!showMore);
        console.log(showMore);
    };

    return (
        <div className="ranking-tracks-container">
            {tracks.map(track => (
                <div key={track.id} className="track-item">
                    <img src={track.imageUrl} alt={`Album cover for ${track.name}`} className="album-cover" />
                    <div className="track-info">
                        <div className="track-name">{track.name}</div>
                        <div className="track-artist">{track.artists.map(artist => artist.name).join(", ")}</div>
                    </div>
                </div>
            ))}
            <br></br>
            <div className="ranking-tracks-container2">
                <Button onClick={toggleTracks} className="see-more-button" text={showMore ? "Voir moins" : "Voir plus"} />
            </div>
        </div>
    );
}

export default RankingTracks;