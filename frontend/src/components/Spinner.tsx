import styles from './Spinner.module.css';

/** Centered loading spinner. */
export default function Spinner() {
  return (
    <div className={styles.wrap}>
      <div className={styles.spinner} role="status" aria-label="Loading" />
    </div>
  );
}
