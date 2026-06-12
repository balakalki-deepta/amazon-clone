import styles from './Footer.module.css';

/** Amazon-style footer with a "Back to top" bar. */
export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className={styles.footer}>
      <button type="button" className={styles.backToTop} onClick={scrollToTop}>
        Back to top
      </button>
      <div className={styles.info}>
        <p className={styles.logo}>
          amazon<span>.clone</span>
        </p>
        <p className={styles.copy}>
          © {new Date().getFullYear()} Amazon Clone · Built for the SDE assignment · Not affiliated
          with Amazon.
        </p>
      </div>
    </footer>
  );
}
