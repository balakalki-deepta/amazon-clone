/** Amazon-style footer with a "Back to top" bar. */
export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="mt-8">
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full bg-[#37475a] py-4 text-[13px] text-white hover:bg-[#485769]"
      >
        Back to top
      </button>
      <div className="bg-amazon-dark px-4 py-8 text-center text-[#dddddd]">
        <p className="mb-2 text-xl font-bold text-white">
          amazon<span className="text-amazon-orange">.clone</span>
        </p>
        <p className="m-0 text-xs text-[#999999]">
          © {new Date().getFullYear()} Amazon Clone · Built for the SDE assignment · Not affiliated
          with Amazon.
        </p>
      </div>
    </footer>
  );
}
