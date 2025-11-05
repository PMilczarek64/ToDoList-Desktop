import React from 'react';
import clsx from 'clsx';
import styles from './FavoriteButton.module.scss';
import { usePouchActions } from '../../hooks/pouchHooks';

const FavoriteButton = ({ id, isFavorite = false }) => {
  const { toggleCardFavorite } = usePouchActions();

  const handleClick = () => {
    if (!id) return;
    toggleCardFavorite(id); // Pouch → thunk toggleFavorite → pouchUpsertDoc
  };

  return (
    <button
      type="button"
      className={clsx(styles.star, isFavorite && styles.isFavorite)}
      onClick={handleClick}
      title={isFavorite ? 'Unfavorite' : 'Favorite'}
      aria-pressed={isFavorite}
    >
      <i className="fa fa-star" />
    </button>
  );
};

export default FavoriteButton;
