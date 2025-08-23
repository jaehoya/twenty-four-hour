// 입력칸 컴포넌트
// - label: 라벨 텍스트
// - type: input 타입
// - placeholder: 힌트 텍스트
// - value: 입력 값
// - onChange: 값 변경 함수
// - error: 에러 메시지
// - className: 스타일 클래스

export default function InputField({
  id,
  label,
  type = "text",
  placeholder = "",
  value = "",
  onChange,
  error,
  className = "",
}) {
  return (
    <div className={`input-field ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input-box${error ? " has-error" : ""}`}
      />

      {error && <p className="input-error">{error}</p>}
    </div>
  );
}
