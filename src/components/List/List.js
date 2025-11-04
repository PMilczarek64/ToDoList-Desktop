import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import styles from './List.module.scss';

// Nowe hooki PouchDB
import { usePouchLists, usePouchCards, usePouchActions } from '../../hooks/pouchHooks';

// Komponenty wizualne – te same, które już masz
import Column from '../Column/Column';
import ColumnForm from '../ColumnForm/ColumnForm';
import SearchForm from '../SearchFrom/SearchFrom';

const List = () => {
  const { id } = useParams();
  const lists = usePouchLists();
  const list = lists.find(l => l._id === id);

  const { createCard, updateCard, destroyCard, toggleCardFavorite } = usePouchActions();
  const cards = usePouchCards({ listId: list?._id });

  // 💡 jeśli lista nie istnieje — wróć na stronę główną
  if (!list) return <Navigate to="/" />;

  return (
    <section className={styles.list}>
      <header className={styles.header}>
        <h2 className={styles.title}>{list.title}</h2>
        {list.description && (
          <p className={styles.description}>{list.description}</p>
        )}
      </header>

      <SearchForm />

      {/* 🔹 kolumny / karty */}
      <div className={styles.columnsWrapper}>
        <div className={styles.columns}>
          {cards.map(card => (
            <Column key={card._id}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <strong>{card.title}</strong>
                  <div className={styles.cardActions}>
                    <button onClick={() => toggleCardFavorite(card._id)}>
                      {card.isFavorite ? '⭐' : '☆'}
                    </button>
                    <button onClick={() => updateCard(card._id, { title: card.title + ' ✏️' })}>
                      Edit
                    </button>
                    <button onClick={() => destroyCard(card._id)}>
                      Delete
                    </button>
                  </div>
                </div>
                {card.description && (
                  <p className={styles.cardDesc}>{card.description}</p>
                )}
              </div>
            </Column>
          ))}

          {/* Formularz dodawania kolumny / karty */}
          <ColumnForm
            onAdd={(title) => createCard({ listId: list._id, title })}
          />
        </div>
      </div>

      {cards.length === 0 && (
        <p className={styles.empty}>No cards yet.</p>
      )}

      <footer className={styles.footer}>
        <Link to="/" className={styles.backLink}>
          ← Back to lists
        </Link>
      </footer>
    </section>
  );
};

export default List;
