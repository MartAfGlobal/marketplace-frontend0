

export default function OtherSearchInput() {
  return (
    <div className="relative w-full max-w-c464 min-w-c464  h-12 bg-ffffff shadow-customW rounded-c100">
      <input
        type="text"
        placeholder="Search for products"
        className="w-full rounded-c100 pl-10 pr-4 py-2 h-full font-MontserratNormal text-000000 text-sm  focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button className="h-c40 w-c80 bg-6a0dad rounded-c100 text-f2f2f2 font-MontserratMedium text-base absolute right-1 top-1/2 -translate-y-1/2">
        Search
      </button>
    </div>
  );
}
