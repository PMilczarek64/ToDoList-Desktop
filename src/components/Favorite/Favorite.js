// src/components/Favorite/Favorite.js
import React from "react";
import PageTitle from "../PageTitle/PageTitle";
import styles from './Favorite.module.scss';
import Card from "../Card/Card";

import { useSelector } from "react-redux";

export default function Favorite() {
  // Pobieramy WSZYSTKIE karty z PouchDB
  const allCards = useSelector(state => state.pouch.cards);

  // Filtrowanie ulubionych
  const favCards = allCards.filter(card => !!card.isFavorite);

  return (
    <div>
      <PageTitle>Favorite</PageTitle>

      {favCards.length === 0 && (
        <p className={styles.subtitle}>No cards added...</p>
      )}

      {favCards.length > 0 && (
        <div className={styles.wrapper}>
          <div className={styles.column}>
            <ul className={styles.cards}>
              {favCards.map(card => (
                <Card
                  key={card._id}
                  id={card._id}
                  title={card.title}
                  isFavorite={card.isFavorite}   // ← bardzo ważne!
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
