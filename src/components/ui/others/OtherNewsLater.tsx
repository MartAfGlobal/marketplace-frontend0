export default function OtherNewsLater() {
  return (
    <div className="font-MontserratSemiBold text-c20 w-full md:min-w-c400 ">
      <h1 className="font-MontserratSemiBold text-c20 text-f0f0f mb-4">
        Newsletter
      </h1>
      <form>
        {/* Email input with icon */}
        <div className="w-ful h-c186 blurred-box flex flex-col items-center justify-center rounded-c24">
          <div className="relative w-full max-w-c336 mb-4 border border-b1b1b1 rounded-c24">
            <input
              placeholder="Your email address"
              className=" rounded-c24 h-10 pl-3 text-base text-f0f0f font-MontserratMedium"
            />
            <button className="h-c40 w-fit p-3.5 flex items-center justify-center bg-6a0dad rounded-c100 text-f2f2f2 font-MontserratMedium text-base absolute right-0 top-1/2 -translate-y-1/2">
              Subscribe
            </button>
          </div>

          {/* Checkbox */}
          <div className="flex items-center space-x-2 mb-4">
            <div className=" flex gap-3 items-center h-c40 w-full ">
              <input
                type="checkbox"
                id="agree"
                className="h-4 w-4 bg-transparent  border-ffffff  rounded-c4 cursor-pointer"
              />
              <label htmlFor="agree" className="text-c14 text-f0f0f">
                i agree with privacy terms and policy
              </label>
            </div>
          </div>
        </div>

        {/* Submit button */}
      </form>
    </div>
  );
}
