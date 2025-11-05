import styles from './Card.module.scss';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
import RemoveButton from '../RemoveButton/RemoveButton';

const Card = ({ id, title, isFavorite }) => {
  return (
    <li className={styles.card}>
      <div className={styles.content}>
        <strong>{title}</strong>
      </div>

      <div className={styles.buttons}>
        <FavoriteButton id={id} isFavorite={!!isFavorite} />
        <RemoveButton id={id} />
      </div>
    </li>
  );
};

export default Card;
