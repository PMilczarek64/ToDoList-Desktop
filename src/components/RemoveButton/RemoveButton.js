import React from 'react';
import styles from './RemoveButton.module.scss';
import { usePouchActions } from '../../hooks/pouchHooks';

const RemoveButton = ({ id }) => {
  const { destroyCard } = usePouchActions();

  const handleClick = () => {
    if (!id) return;
    destroyCard(id); // Pouch → thunk removeCard → pouchRemoveDoc
  };

  return (
    <button
      type="button"
      className={styles.trash}
      onClick={handleClick}
      title="Delete"
    >
      <i className="fa fa-trash" />
    </button>
  );
};

export default RemoveButton;
