export default function AdressSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
   

      {/* Cart items */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4">
          <p className="h-4 w-3/4 bg-gray-200 rounded" />
          <p className="h-3 w-1/2 bg-gray-200 rounded" />
          <p className="h-3 w-1/3 bg-gray-200 rounded" />
        </div>
      ))}

     
    </div>
  );
}
