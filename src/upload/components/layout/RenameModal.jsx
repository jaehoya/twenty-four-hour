import InputField from "../content/InputField";
import { useModalStore } from '../../../store/store';

export default function RenameModal() {
    const {isOpenRenameModal, setIsOpenRenameModal} = useModalStore();

    // type: 'gradient' | 'flat' | 'text'
    function MyButton({ value = '버튼', type = 'flat', onClick = () => {}}) {
        return (
            <button
                onClick={onClick}
                className={`block w-full h-[40px] mx-auto rounded-[7px] text-sm md:text-sm
                    ${(type === 'gradient') ? 'bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] shadow-lg text-white' : 'text-black'}
                    ${(type === 'flat') && 'border-[1px] border-[#DAE0E9] text-[#222]'}
                    ${(type === 'text') && 'underline'}
                `}
            >{value}</button>
        );
    }

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