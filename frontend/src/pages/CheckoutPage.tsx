import { useState, type ChangeEvent, type ComponentProps, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/orders';
import { getApiErrorMessage } from '../api/errorMessage';
import { formatPrice } from '../utils/formatPrice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

/** A labelled shadcn input for the address form. */
function Field({ id, label, ...props }: { id: string; label: string } & ComponentProps<'input'>) {
  return (
    <div className="mb-3.5 flex-1">
      <Label htmlFor={id} className="mb-1 block text-[13px] font-bold">
        {label}
      </Label>
      <Input id={id} {...props} />
    </div>
  );
}

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
    } catch (err) {
      setError(
        getApiErrorMessage(err, 'Something went wrong placing your order. Please try again.'),
      );
      setSubmitting(false);
    }
  }

  return (
    <form className="mx-auto max-w-[1200px] p-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 items-start gap-4 min-[800px]:grid-cols-[1fr_340px]">
        <section className="rounded-lg bg-white p-5">
          <h1 className="mb-4 text-[21px] font-semibold">Shipping address</h1>

          <Field
            id="fullName"
            label="Full name"
            name="fullName"
            value={address.fullName}
            onChange={handleChange}
            required
          />
          <Field
            id="phone"
            label="Phone number"
            name="phone"
            value={address.phone}
            onChange={handleChange}
            required
          />
          <Field
            id="line1"
            label="Address line 1"
            name="line1"
            value={address.line1}
            onChange={handleChange}
            required
          />
          <Field
            id="line2"
            label="Address line 2 (optional)"
            name="line2"
            value={address.line2}
            onChange={handleChange}
          />

          <div className="flex gap-3">
            <Field
              id="city"
              label="City"
              name="city"
              value={address.city}
              onChange={handleChange}
              required
            />
            <Field
              id="state"
              label="State"
              name="state"
              value={address.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex gap-3">
            <Field
              id="postalCode"
              label="Postal code"
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
              required
            />
            <Field
              id="country"
              label="Country"
              name="country"
              value={address.country}
              onChange={handleChange}
              required
            />
          </div>
        </section>

        <aside className="sticky top-[120px] rounded-lg bg-white p-[18px] max-[800px]:static">
          <h2 className="mb-3 text-lg font-semibold">Order summary</h2>

          <ul className="mb-3 flex max-h-[260px] list-none flex-col gap-2 overflow-y-auto p-0">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-2.5 text-[13px]">
                <span className="text-amazon-ink">
                  {item.title} <span className="text-amazon-muted">× {item.quantity}</span>
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between border-t border-amazon-border py-2 text-sm">
            <span>
              Subtotal ({totalQuantity} {itemNoun})
            </span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between border-t border-amazon-border py-2 pb-3.5 text-lg font-bold text-[#b12704]">
            <span>Order total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {error && <p className="m-0 mb-2.5 text-[13px] text-[#b12704]">{error}</p>}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full border border-[#fcd200] bg-amazon-yellow text-amazon-ink hover:bg-amazon-yellow-hover"
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </Button>
        </aside>
      </div>
    </form>
  );
}
