import React from "react";
import SignupForm from "../components/SignupForm";
import Bg from "../../assets/signup/background_gradient.svg";
import LogoUrl from "../../assets/signup/24_logo.svg";
import ScrollThumb from "../../assets/signup/scrollbar.svg";

function SignupPage() {
    return (
    <main className="min-h-screen grid w-[95svw] md:w-[60svw] h-[90svh] md:h-[60svh] max-w-[1158px] place-items-center mx-auto">
        <div className="flex flex-col md:flex-row shadow-[0_0_70px_0_rgba(73,91,134,0.2)] rounded-[25px] overflow-hidden w-full">
            <div className="md:basis-0 md:grow-[5.5] md:h-[60vh] flex items-center justify-center p-1 md:p-2">
                <div className="w-full h-full rounded-[20px] overflow-hidden">
                    <img src={Bg} className="w-full h-full object-cover" alt=""/>
                </div>
            </div>
            <section className="md:flex-[4_1_0%] min-w-0 grid grid-rows-[auto_minmax(0,1fr)_auto] md:h-[60vh] w-full bg-white">

                <div className="px-4 md:px-6 pt-6 md:pt-[4vw] pb-12 flex justify-center">
                    <img src={LogoUrl} className="h-auto max-h-[50px] md:max-h-[65px]" alt="logo" />
                </div>

                <div className="min-h-0 px-2 sm:px-4 md:px-6 flex justify-center">
                    <div
                        className={`
                            w-full max-w-[363px] min-w-0
                            h-auto
                            max-h-[clamp(300px,50svh,500px)] md:max-h-[clamp(300px,50vh,500px)]
                            overflow-y-auto
                            pr-2 md:pr-3
                            [overscroll-behavior-y:contain]
                            [scrollbar-gutter:stable-both]
                            [scrollbar-width:thin] [scrollbar-color:#F0F0F0_transparent]
                            [&::-webkit-scrollbar]:w-[6px]
                            [&::-webkit-scrollbar-track]:bg-transparent
                            [&::-webkit-scrollbar-thumb]:[background-image:var(--sb-thumb)]
                            [&::-webkit-scrollbar-thumb]:bg-no-repeat
                            [&::-webkit-scrollbar-thumb]:bg-center
                            [&::-webkit-scrollbar-thumb]:[background-size:100%_100%]
                            [&::-webkit-scrollbar-thumb]:rounded-full
                        `}
                        style={{ "--sb-thumb": `url(${ScrollThumb})` }}
                    >
                        <SignupForm />
                    </div>
                </div>

                <div className="bg-white flex justify-center p-2 sm:p-4 md:pb-20 relative z-10 pt-8 md:pt-4">
                    <div className="w-full max-w-[363px] min-w-0 pr-2 md:pr-3">
                        <button
                            type="submit"
                            form="signupForm"
                            className="block w-full h-[55px] mx-auto rounded-[7px]
                                        text-white text-sm md:text-base font-semibold
                                        bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF]
                                        shadow-lg"
                        >
                        가입하기
                        </button>
                    </div>
                </div>
            </section>
        </div>
    </main>
    );
}

export default SignupPage;
