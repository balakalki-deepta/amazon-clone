import styles from './ProductOffers.module.css';

interface Offer {
  title: string;
  text: string;
  count: string;
}

// Static promotional offers (display only — Amazon shows a row like this).
const OFFERS: Offer[] = [
  { title: 'Bank Offer', text: 'Upto ₹500 off on select Credit Cards', count: '3 offers' },
  { title: 'No Cost EMI', text: 'Avail No Cost EMI on orders above ₹3,000', count: '2 offers' },
  { title: 'Cashback', text: 'Upto ₹50 back as Amazon Pay balance', count: '1 offer' },
  {
    title: 'Partner Offers',
    text: 'Get GST invoice & save up to 28% on business purchases',
    count: '1 offer',
  },
];

/** Amazon-style horizontal "Offers" strip (static content). */
export default function ProductOffers() {
  return (
    <section className={styles.offers}>
      <h2 className={styles.heading}>Offers</h2>
      <div className={styles.row}>
        {OFFERS.map((offer) => (
          <div key={offer.title} className={styles.card}>
            <span className={styles.title}>{offer.title}</span>
            <p className={styles.text}>{offer.text}</p>
            <span className={styles.count}>{offer.count} ›</span>
          </div>
        ))}
      </div>
    </section>
  );
}
