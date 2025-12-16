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
        <div className={`w-full mb-3 ${className}`}>
            <div
                className={`flex flex-row items-center rounded-[7px]
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
                className="h-[40%] md:h-[49%] mx-3 md:mx-[5%]"
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
            className="flex-1 min-w-0 px-3 placeholder-[#9698A9] text-[0.9375rem] md:text-[0.875rem] font-normal outline-none border-none h-[55px] md:h-[49px]"
            aria-invalid={error || undefined}
            {...inputProps}
        />
        </div>
    </div>
    );
}

export default InputField;