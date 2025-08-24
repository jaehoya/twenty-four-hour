import React from "react";
import SignupForm from "../components/SignupForm";
import Bg from "../../assets/signup/background_gradient.png";
import Logo from "../../assets/signup/24_logo.png";

function SignupPage() {
    return (
        <div className="flex flex-row w-full min-h-screen">
        <img src={Bg} className="m-[17px] h-auto max-h-screen w-[50%]"/>
        <div className="flex flex-col justify-center items-center w-full min-h-screen">
            <img src={Logo} className="w-[82px] h-[65px] mb-[30px]" />
            <span className="text-[21px] font-semibold mb-[60px]">TFH Storage 로그인</span>
            <SignupForm />
        </div>
        </div>
    )
}

export default SignupPage;