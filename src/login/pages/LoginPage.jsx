import LoginForm from "../components/LoginForm";
import Bg from "../../assets/signup/background_gradient.svg";
import LogoUrl from "../../assets/signup/24_logo.svg";
import ScrollThumb from "../../assets/signup/scrollbar.svg";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();

    return (
    <main className="h-screen flex flex-col md:grid md:w-[60svw] max-w-[1158px] md:place-items-center mx-auto p-2 md:p-0">
        <div className="flex flex-col md:flex-row md:shadow-[0_0_70px_0_rgba(73,91,134,0.2)] md:rounded-[25px] overflow-hidden w-full md:w-full h-full md:h-auto">
            <div className="h-[213px] w-full md:basis-0 md:grow-[5.5] md:h-[60vh] md:w-auto flex items-center justify-center p-0 md:p-2">
                <div className="w-full h-full md:rounded-[20px] overflow-hidden hidden md:block">
                    <img src={Bg} className="w-full h-full object-cover md:rotate-0 rotate-180 rounded-[10px] md:rounded-[20px]" alt=""/>
                </div>
            </div>
            <section className="md:flex-[4_1_0%] min-w-0 flex flex-col md:grid md:grid-rows-[auto_minmax(0,1fr)_auto] md:h-[60vh] w-full bg-white flex-1">

                <div className="px-4 md:px-6 pt-6 md:pt-[4vw] pb-6 flex justify-center mt-6">
                    <img src={LogoUrl} className="h-auto max-h-[50px] md:max-h-[65px]" alt="logo" />
                </div>

                <div className="flex-1 px-6 flex justify-center md:min-h-0 md:overflow-hidden">
                    <div className="w-full max-w-[363px] min-w-0 mt-5">
                        <span className="font-regular text-[#3F414E] text-[0.9375rem] md:hidden">로그인</span>
                        <div
                            className={`
                                w-full
                                h-full
                                max-h-[clamp(250px,45svh,455px)] md:max-h-full
                                md:overflow-y-auto
                                md:pr-3
                                border-b border-[#DDE4EE]
                                [overscroll-behavior-y:contain]
                                md:[scrollbar-gutter:stable-both]
                                md:[scrollbar-width:thin] md:[scrollbar-color:#F0F0F0_transparent]
                                md:[&::-webkit-scrollbar]:w-[6px]
                                md:[&::-webkit-scrollbar-track]:bg-transparent
                                md:[&::-webkit-scrollbar-thumb]:[background-image:var(--sb-thumb)]
                                md:[&::-webkit-scrollbar-thumb]:bg-no-repeat
                                md:[&::-webkit-scrollbar-thumb]:bg-center
                                md:[&::-webkit-scrollbar-thumb]:[background-size:100%_100%]
                                md:[&::-webkit-scrollbar-thumb]:rounded-full
                            `}
                            style={{ "--sb-thumb": `url(${ScrollThumb})` }}
                        >
                            <LoginForm />
                            <div className="h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white flex flex-col items-center px-6 py-2 mb-[20vh] md:mb-0 md:pb-10 relative z-10 -mt-4 md:-mt-12">
                    <div className="w-full max-w-[363px] min-w-0">
                        <button
                            type="submit"
                            form="loginForm"
                            className="block w-full h-[55px] mx-auto rounded-[7px]
                                        text-white text-sm md:text-base font-semibold
                                        bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF]
                                        shadow-lg"
                        >로그인</button>
                        <button
                            onClick={() => navigate("/signup")}
                            className="block w-full h-[55px] mx-auto
                                        text-[#222] text-sm md:text-base underline mt-2"
                        >회원가입</button>
                    </div>
                </div>
            </section>
        </div>
    </main>
    );
}

export default LoginPage;
