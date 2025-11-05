import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import styles from './List.module.scss';

// Nowe hooki PouchDB
import {
  usePouchLists,
  usePouchColumns,
  usePouchCards,
  usePouchActions,
} from '../../hooks/pouchHooks';

// Komponenty wizualne – te same, które już masz
import Column from '../Column/Column';
import ColumnForm from '../ColumnForm/ColumnForm';
import SearchForm from '../SearchFrom/SearchFrom';

const List = () => {
  const { id } = useParams();

  // 🧩 Pobieramy dane z PouchDB
  const lists = usePouchLists();
  const list = lists.find((l) => l._id === id);
  const columns = usePouchColumns(list?._id);
  const cards = usePouchCards({ listId: list?._id });

  const {
    createCard,
    updateCard,
    destroyCard,
    toggleCardFavorite,
  } = usePouchActions();

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

      {/* 🔹 Kolumny */}
      <div className={styles.columnsWrapper}>
        <div className={styles.columns}>
          {columns.map((column) => (
            <Column
              key={column._id}
              title={column.title}
              icon={column.icon}
              columnId={column._id}    // ← tu!
              listId={list._id}        // ← i tu!
            >
              {/* 🔸 Karty należące do tej kolumny */}
              {cards
                .filter((card) => card.categoryId === column._id)
                .map((card) => (
                  <div key={card._id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <strong>{card.title}</strong>
                      <div className={styles.cardActions}>
                        <button onClick={() => toggleCardFavorite(card._id)}>
                          {card.isFavorite ? '⭐' : '☆'}
                        </button>
                        <button
                          onClick={() =>
                            updateCard(card._id, {
                              title: card.title + ' ✏️',
                            })
                          }
                        >
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
                ))}

              {/* 🔸 Formularz dodania karty do danej kolumny */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;                 // ← zawsze formularz
                  const fd = new FormData(form);
                  const title = (fd.get('title') || '').toString().trim();
                  if (!title) return;

                  createCard({
                    listId: list._id,
                    categoryId: column._id,                     // ← KLUCZOWE
                    title,
                    createdAt: new Date().toISOString(),
                    type: 'card',
                  });

                  form.reset();
                }}
                className={styles.cardForm}
              >
                <input
                  type="text"
                  name="title"                                  // ← musi mieć name
                  placeholder="New card title..."
                  className={styles.input}
                />
                <button type="submit" className={styles.addButton}>+ Add card</button>
              </form>


            </Column>
          ))}

          {/* 🔹 Formularz dodawania nowej kolumny */}
          <ColumnForm listId={list._id} />
        </div>
      </div>

      {columns.length === 0 && (
        <p className={styles.empty}>No columns yet.</p>
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
