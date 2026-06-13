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
    <section className="my-3.5">
      <h2 className="mb-2 text-base font-semibold">Offers</h2>
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {OFFERS.map((offer) => (
          <div
            key={offer.title}
            className="flex w-[200px] flex-none flex-col gap-1 rounded-lg border border-amazon-border p-[10px_12px]"
          >
            <span className="text-sm font-bold">{offer.title}</span>
            <p className="m-0 text-xs leading-snug text-amazon-ink">{offer.text}</p>
            <span className="mt-auto text-xs text-amazon-link">{offer.count} ›</span>
          </div>
        ))}
      </div>
    </section>
  );
}
