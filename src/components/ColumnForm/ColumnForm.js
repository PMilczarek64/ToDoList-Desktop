import styles from './ColumnForm.module.scss';
import { useState } from 'react';
import Button from '../Button/Button';
import TextInput from '../TextInput/TextInput';

// 🔄 nowy import — zamiast Redux dispatch
import { usePouchActions } from '../../hooks/pouchHooks';

const ColumnForm = ({ listId }) => {
  const { createColumn } = usePouchActions(); // nowa akcja PouchDB

  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    // 🔹 Zapisujemy kolumnę do bazy PouchDB
    createColumn({
      listId,
      title,
      icon,
      createdAt: new Date().toISOString(),
      type: 'column',
    });

    // 🔄 Reset formularza
    setTitle('');
    setIcon('');
  };

  return (
    <form className={styles.columnForm} onSubmit={handleSubmit}>
      <span>
        Title:{' '}
        <TextInput
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </span>
      <span>
        Icon:{' '}
        <TextInput
          className={styles.input}
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
        />
      </span>
      <Button>Add column</Button>
    </form>
  );
};

export default ColumnForm;
