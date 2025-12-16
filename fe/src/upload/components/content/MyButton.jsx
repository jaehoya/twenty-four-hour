// type: 'gradient' | 'flat' | 'text'
export default function MyButton({ value = '버튼', type = 'flat', onClick = () => {} }) {
    return (
        <button
            onClick={onClick}
            className={`block w-full h-[45px] mx-auto rounded-[7px] text-sm md:text-sm
                ${(type === 'gradient') ? 'bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] shadow-lg text-white' : 'text-black'}
                ${(type === 'flat') && 'border-[1px] border-[#DAE0E9] text-[#222]'}
                ${(type === 'text') && 'underline'}
                `}
        >{value}</button>
    );
}