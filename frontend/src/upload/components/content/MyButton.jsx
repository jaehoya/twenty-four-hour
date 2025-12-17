// type: 'gradient' | 'flat' | 'text'
export default function MyButton({ value = '버튼', type = 'flat', onClick = () => {}, disabled = false, className = '' }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`block w-full h-[45px] mx-auto rounded-[7px] text-sm md:text-sm
                ${(type === 'gradient') ? 'bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] shadow-lg text-white' : 'text-black'}
                ${(type === 'flat') && 'border border-[#DAE0E9] text-[#222]'}
                ${(type === 'text') && 'underline'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
                `}
        >{value}</button>
    );
}