import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orders';
import { formatPrice } from '../utils/formatPrice';
import styles from './CheckoutPage.module.css';

interface AddressFormValues {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const EMPTY_ADDRESS: AddressFormValues = {
  fullName: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
};

/**
 * Checkout page ("/checkout"): shipping address form + order review.
 * On submit it creates the order on the server, clears the cart, and routes to
 * the confirmation page.
 */
export default function CheckoutPage() {
  const { items, subtotal, totalQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState<AddressFormValues>(EMPTY_ADDRESS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Can't check out an empty cart — send the user back.
  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const itemNoun = totalQuantity === 1 ? 'item' : 'items';

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const order = await createOrder({
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2.trim() || undefined,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
      });
      clearCart();
      navigate(`/order/${order.orderNumber}`);
    } catch {
      setError('Something went wrong placing your order. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.page} onSubmit={handleSubmit}>
      <div className={styles.layout}>
        <section className={styles.formPanel}>
          <h1 className={styles.heading}>Shipping address</h1>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" className={styles.input} value={address.fullName} onChange={handleChange} required />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">Phone number</label>
            <input id="phone" name="phone" className={styles.input} value={address.phone} onChange={handleChange} required />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="line1">Address line 1</label>
            <input id="line1" name="line1" className={styles.input} value={address.line1} onChange={handleChange} required />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="line2">Address line 2 (optional)</label>
            <input id="line2" name="line2" className={styles.input} value={address.line2} onChange={handleChange} />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="city">City</label>
              <input id="city" name="city" className={styles.input} value={address.city} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="state">State</label>
              <input id="state" name="state" className={styles.input} value={address.state} onChange={handleChange} required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="postalCode">Postal code</label>
              <input id="postalCode" name="postalCode" className={styles.input} value={address.postalCode} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="country">Country</label>
              <input id="country" name="country" className={styles.input} value={address.country} onChange={handleChange} required />
            </div>
          </div>
        </section>

        <aside className={styles.summary}>
          <h2 className={styles.summaryHeading}>Order summary</h2>

          <ul className={styles.reviewList}>
            {items.map((item) => (
              <li key={item.productId} className={styles.reviewItem}>
                <span className={styles.reviewTitle}>
                  {item.title} <span className={styles.reviewQty}>× {item.quantity}</span>
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className={styles.summaryRow}>
            <span>Subtotal ({totalQuantity} {itemNoun})</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Order total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.placeButton} disabled={submitting}>
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </aside>
      </div>
    </form>
  );
}
