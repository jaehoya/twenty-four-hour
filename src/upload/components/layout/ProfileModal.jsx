
export default function ProfileModal() {
    return (
        <div className="fixed w-full h-full top-0 left-0 bg-[#00000077] flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-4">Profile Modal</h2>
                <p className="text-sm text-gray-600">test profile modal</p>
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
    );
}