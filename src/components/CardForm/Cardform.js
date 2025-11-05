import styles from './CardForm.module.scss';
import TextInput from '../TextInput/TextInput';
import Button from '../Button/Button';
import { useState } from 'react';
import { usePouchActions } from '../../hooks/pouchHooks';

const CardForm = ({ listId, columnId }) => {
  const [title, setTitle] = useState('');
  const { createCard } = usePouchActions();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    createCard({
      listId,
      categoryId: columnId,
      title: cleanTitle,
    });

    setTitle('');
  };

  return (
    <form className={styles.cardForm} onSubmit={handleSubmit}>
      <TextInput
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Card title..."
      />
      <Button type="submit">Add card</Button>
    </form>
  );
};

export default CardForm;
