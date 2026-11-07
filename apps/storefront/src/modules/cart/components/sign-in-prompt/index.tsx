import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
      <div>
        <h2 className="text-2xl md:text-2xl font-medium  tracking-tighter text-black leading-none">
          Already have an account?
        </h2>
        <p className="mt-2 text-sm font-bold uppercase tracking-widest text-black/70">
          Sign in for a better experience.
        </p>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <button
            className="bg-black text-[#FDFDFF] text-lg font-black uppercase tracking-widest py-3 px-8 border-[3px] border-black shadow-[4px_4px_0px_#F42902] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#F42902] active:translate-y-1 active:shadow-[0px_0px_0px_#F42902] transition-all"
            data-testid="sign-in-button"
          >
            Sign In
          </button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt