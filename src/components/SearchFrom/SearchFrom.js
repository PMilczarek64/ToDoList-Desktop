// src/components/SearchFrom/SearchFrom.js
import styles from './SearchFrom.module.scss';
import TextInput from '../TextInput/TextInput';
import Button from '../Button/Button';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { updateSearchstring } from '../../redux/searchStringRedux';

const SearchForm = () => {
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSearchstring({ searchKey }));
  };

  // czyścimy kontekst wyszukiwania na wejściu do widoku
  useEffect(() => {
    dispatch(updateSearchstring({ searchKey: '' }));
  }, [dispatch]);

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <TextInput
        placeholder="search"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
      <Button type="submit">
        <span className="fa fa-search" />
      </Button>
    </form>
  );
};

export default SearchForm;
