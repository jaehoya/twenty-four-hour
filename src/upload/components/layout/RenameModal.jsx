import InputField from "../content/InputField";
import { useModalStore } from '../../../store/store';
import MyButton from '../content/MyButton';

export default function RenameModal() {
    const {isOpenRenameModal, setIsOpenRenameModal} = useModalStore();

    return (
        <div className={`fixed w-full h-full top-0 left-0 bg-[#00000077] flex justify-center items-center z-50 ${isOpenRenameModal ? '' : 'hidden'}`}>
            <div className="bg-white w-[500px] p-6 rounded-[10px] shadow-md">
                <div className="text-[13pt]">항목 이름 변경</div>
                <InputField
                    id="rename"
                    placeholder="새로운 이름을 입력하세요."
                    className="mt-4 mb-2"
                />
                {/* Buttons */}
                <div className='flex gap-2'>
                    <div className="w-300" />
                    <MyButton value='취소' type='text' onClick={() => setIsOpenRenameModal(false)} />
                    <MyButton value='확인' type='gradient' />
                </div>
            </div>
        </div>
    );
}