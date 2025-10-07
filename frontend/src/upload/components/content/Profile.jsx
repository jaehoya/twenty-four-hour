import React from "react";
import Bg from "../../../assets/upload/background_gradient.svg";

function Profile() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="rounded-full w-full md:w-[80%] aspect-1 overflow-hidden">
                <img src={Bg} alt="profile" className="w-full h-full object-cover" />
            </div>
        </div>
    )
}

export default Profile;