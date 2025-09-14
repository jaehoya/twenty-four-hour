import React from "react";
import Bg from "../../../assets/upload/background_gradient.svg";

function Profile() {
    return (
        <div className="rounded-full w-full h-full overflow-hidden">
            <img src={Bg} alt="profile" className="w-full h-full object-cover" />
        </div>
    )
}

export default Profile;