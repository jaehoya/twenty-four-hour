import React from "react";

function InputField({
    id,                 
    type = "text",
    value,
    onChange,
    placeholder,
    icon,
    error = false,    
    className = "",    
    inputProps = {},    
    }) {
    return (
        <div className={`w-full max-w-[363px] mb-3 ${className}`}>
            <div
                className={`flex flex-row items-center rounded-[7px]
                            max-h-[44px] md:max-h-[49px]
                            ring-inset ring-1
                    ${
                    error
                        ? "ring-2 ring-[#F46464]"
                        : "ring-[#C6CED9] focus-within:ring-2 focus-within:ring-[#3888FF]"
                    }`}
        >
        {icon && (
            <img
                src={icon}
                className="h-[40%] md:h-[49%] ml-3 md:ml-[5%]"
                alt=""
                aria-hidden="true"
            />
        )}

        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="flex-1 min-w-0 placeholder-[#9698A9] text-sm md:text-[0.9375rem] outline-none border-none p-3 md:p-[5%]"
            aria-invalid={error || undefined}
            {...inputProps}
        />
        </div>
    </div>
    );
}

export default InputField;