import React from "react";
import Card from "./Card"; // Importez le composant Card
import "./CardScroll.css";

function CardScroll({ items }) {
  return (
    <div className="card-scroll-container">
      {items && items.map((item, index) => (
        <Card
          key={index}
          imageUrl={item.imageUrl}
          text1={item.name}
          text2={item.public ? 'PLaylist public' : 'Playlist privé'} 
        />
      ))}
    </div>
  );
}

export default CardScroll;
