import styles from './Column.module.scss';
import Card from '../Card/Card';
import CardForm from '../CardForm/Cardform';
import { usePouchCards } from '../../hooks/pouchHooks';

const Column = ({ id: columnId, title, icon, listId }) => {
  // Pobieramy karty tylko z tej kolumny
  const cards = usePouchCards({ listId, categoryId: columnId });

  return (
    <article className={styles.column}>
      <h2 className={styles.title}>
        <span className={`${styles.icon} fa fa-${icon}`}></span>
        {title}
      </h2>

      <ul className={styles.cards}>
        {cards.map((card) => (
          <Card key={card._id} id={card._id} title={card.title} />
        ))}
      </ul>

      {/* ✅ przekazujemy oba ID, żeby CardForm wiedział, gdzie dodać kartę */}
      <CardForm listId={listId} columnId={columnId} />
    </article>
  );
};

export default Column;
