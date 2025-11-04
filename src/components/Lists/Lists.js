import React from "react";
import { Link } from "react-router-dom";
import styles from "./Lists.module.scss";
import { usePouchLists } from "../../hooks/pouchHooks";
import ListForm from "../ListForm/ListForm";

const Lists = () => {
  const lists = usePouchLists();

  console.log('%c[Lists.js] lists received from hook:', 'color:yellow', lists);

  if (!lists.length) {
    return (
      <section className={styles.lists}>
        <h2 className={styles.heading}>Loading lists...</h2>
      </section>
    );
  }

  return (
    <section className={styles.lists}>
      <h2 className={styles.heading}>Browse lists</h2>

      {lists.map((list) => (
        <Link
          key={list._id}
          to={`/list/${list._id}`}   // ← bez encodeURIComponent
          className={styles.listLink}
        >
          <h3>{list.title}</h3>
          {list.description ? <p>{list.description}</p> : null}
        </Link>
      ))}

      <ListForm />
    </section>
  );
};

export default Lists;
