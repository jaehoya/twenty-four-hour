// 입력칸 컴포넌트
// - props
// label: 라벨 텍스트
// type: input 타입
// placeholder: 힌트 텍스트
// value: 입력 값
// onChange: 값 변경 함수
// error: 에러 메시지
// className: 스타일 클래스

// src/components/common/InputField.jsx (간단 패치)
export default function InputField({
  id,
  label,
  type = "text",
  placeholder = "",
  value = "",
  icon,
  onChange,
  error,
  required = false,
  disabled = false,
  className = "",
}) {
 const inputBase =
  "peer w-full max-w-[337px] h-[55px] px-4 border rounded-[10px] md:rounded-[8px] transition focus:outline-none " +
  "text-[#9698A9] text-[0.875rem] " +
  "disabled:bg-muted/20 disabled:text-muted disabled:cursor-not-allowed";

  const borderByState = error
    ? "border border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border border-[#C6CED9] focus:border-[#3888FF] focus:ring-2 focus:ring-[#3888FF]";
  return (
    <div className="relative w-full flex flex-col">
      {label && (
        <label htmlFor={id} className="hidden md:block text-[13px] mb-0.5">
          {label}
        </label>
      )}
      {icon && (
        <img
          src={icon}
          alt=""
          className="absolute left-3.5 top-1/2 -translate-y-1/2 md:-translate-y-1"
        />
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        className={`${icon ? "pl-12" : ""} ${inputBase} ${borderByState} ${className}`}
      />

      {error && <p className="input-error">{error}</p>}
    </div>
  );
}
