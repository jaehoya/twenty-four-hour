import React, { useEffect, useMemo, useState } from "react";
import api from "../../../utils/api";

function Tags({
  fileId,
  tags: tagsProp,
  isFolder = false,
  className = "",
  emptyText = "태그 없음",
  onDelete,
  onAdd,
}) {
  const [tags, setTags] = useState(Array.isArray(tagsProp) ? tagsProp : []);
  const [loading, setLoading] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // 부모에서 tagsProp이 들어오면 그대로 우선 사용
  useEffect(() => {
    if (Array.isArray(tagsProp)) setTags(tagsProp);
  }, [tagsProp]);

  // fileId가 있으면 서버에서 태그 조회
  useEffect(() => {
    if (!fileId || isFolder) return;
    if (Array.isArray(tagsProp)) return;

    let cancelled = false;
    const fetchTags = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tags/${fileId}`);
        const serverTags = res?.data?.tags;
        if (!cancelled && Array.isArray(serverTags)) {
          setTags(serverTags);
        }
      } catch {
        // 태그 조회 실패는 조용히 처리
        if (!cancelled) setTags([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTags();
    return () => {
      cancelled = true;
    };
  }, [fileId, isFolder, tagsProp]);

  // 태그 삭제 후 로컬 상태 갱신
  const handleDelete = async (tagItem, idx) => {
    if (!onDelete) return;

    // tagItem이 객체면 id 사용, 아니면 인덱스 기반
    const tagId = tagItem?.id;
    
    try {
      await onDelete(tagId, fileId, tagItem);
      // 삭제 성공 시 로컬에서도 제거
      setTags((prev) => prev.filter((_, i) => i !== idx));
    } catch {
      // 에러는 onDelete에서 처리
    }
  };

  // normalized: { id, label } 형태로 통일
  const normalized = useMemo(() => {
    return (Array.isArray(tags) ? tags : [])
      .map((t) => {
        if (typeof t === "object" && t !== null) {
          return { id: t.id, label: String(t.tag ?? t.label ?? "").trim(), original: t };
        }
        return { id: null, label: String(t ?? "").trim(), original: t };
      })
      .filter((item) => item.label);
  }, [tags]);

  // 폴더는 태그 X
  if (isFolder) {
    return null;
  }

  if (loading && normalized.length === 0) {
    return (
      <div className={`flex flex-wrap items-center gap-2 min-w-0 ${className}`}>
        <span className="text-[9pt] text-[#9AA9B9]">불러오는 중…</span>
        {onAdd && <AddButton onClick={onAdd} />}
      </div>
    );
  }

  if (normalized.length === 0) {
    return (
      <div className={`flex flex-wrap items-center gap-2 min-w-0 ${className}`}>
        <span className="text-[9pt] text-[#9AA9B9]">{emptyText}</span>
        {onAdd && <AddButton onClick={onAdd} />}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 min-w-0 ${className}`}>
      {normalized.map((item, idx) => (
        <span
          key={item.id ?? `${item.label}-${idx}`}
          className={`group relative rounded-full bg-white border border-[#0D4CFF] transition-all pl-2 pr-2 py-1 text-[11px] font-medium leading-tight break-words whitespace-normal flex items-center ${
            hoveredIdx === idx ? "pr-7" : ""
          }`}
          style={{ overflowWrap: "anywhere" }}
          title={item.label}
          onMouseEnter={() => setHoveredIdx(idx)}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <span className="bg-gradient-to-r from-[#0D4CFF] to-[#33AAFF] bg-clip-text text-transparent">
            {item.label}
          </span>
          {/* 삭제 버튼: hover 시 표시 */}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.original, idx);
              }}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-[#667687] hover:text-[#FF4757] hover:bg-[#FFE8EA] transition-all ${
                hoveredIdx === idx ? "opacity-100" : "opacity-0"
              }`}
              aria-label="태그 삭제"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </span>
      ))}
      {/* + 버튼: 태그 추가 */}
      {onAdd && <AddButton onClick={onAdd} />}
    </div>
  );
}

/* + 버튼 */
function AddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-7 flex-shrink-0 flex items-center justify-center rounded-full border border-dashed border-[#A4B5C6] text-[#A4B5C6] hover:border-[#0D4CFF] hover:text-[#0D4CFF] hover:bg-[#F0F6FF] transition-all"
      aria-label="태그 추가"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  );
}

export default Tags;

