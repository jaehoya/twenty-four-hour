// 버튼 컴포넌트 
// - props
// children: 버튼 내용 (텍스트/아이콘)
// onClick: 실행할 함수
// type: 버튼 용도
// className: 스타일

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}