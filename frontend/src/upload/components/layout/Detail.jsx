import React, { useEffect, useState } from "react";
import FolderIcon from "../../../assets/upload/folder_icon.svg";
import EmptyFolderIcon from "../../../assets/upload/empty_folder_icon.svg";
import FileIcon from "../../../assets/upload/file_icon.svg";
import { usePathStore } from "../../../store/store";
import Tags from "../content/tags.jsx";
import AddTagsModal from "./AddTagsModal";
import api from "../../../utils/api";

function Detail({ selectedItem = null, onClose = () => { } }) {
    const { pathNameHistory } = usePathStore();
    const [isMobile, setIsMobile] = useState(false);
    const [tagKey, setTagKey] = useState(0); // 태그 목록 갱신용
    const [isAddTagModalOpen, setIsAddTagModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    // selectedItem이 바뀔 때 에러 상태 초기화
    useEffect(() => {
        setImageError(false);
    }, [selectedItem]);

    // 태그 삭제 핸들러
    const handleDeleteTag = async (tagId, fileId) => {
        if (!tagId || !fileId) return;
        try {
            await api.delete(`/tags/${fileId}/${tagId}`);
            // 태그 목록 갱신
            setTagKey((prev) => prev + 1);
        } catch (err) {
            console.error("태그 삭제 실패:", err);
            alert("태그 삭제에 실패했습니다.");
            throw err; // Tags 컴포넌트에서 로컬 상태 갱신 막기 위해
        }
    };

    // 태그 추가 모달 열기
    const handleAddTag = () => {
        setIsAddTagModalOpen(true);
    };

    // 태그 추가 성공 시 목록 갱신
    const handleTagAdded = () => {
        setTagKey((prev) => prev + 1);
    };

    useEffect(() => {
        const updateIsMobile = () => {
            if (typeof window === "undefined") return;
            setIsMobile(window.innerWidth < 768);
        };

        updateIsMobile();
        window.addEventListener("resize", updateIsMobile);

        return () => {
            window.removeEventListener("resize", updateIsMobile);
        };
    }, []);

    const formatDateTime = (value) => {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "-";
        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    // 선택된 아이템이 없으면 빈 상태 표시
    if (!selectedItem) {
        if (isMobile) return null;
        return (
            <div className="hidden md:block md:w-[20.93svw] md:h-auto md:m-3 rounded-[10px] border-[1px] border-[#DAE0E9] bg-white p-6 flex items-center justify-center">
            </div>
        )
    }

    const getItemCount = (count) => {
        if (!count) return 0;
        return parseInt(count.split('개의 항목')[0]);
    };

    const itemCount = getItemCount(selectedItem.count);
    const isEmpty = selectedItem.mime_type === "folder" && itemCount === 0;

    // 전체 경로 생성: pathNameHistory를 '/' 로 연결
    const getFullPath = () => {
        const itemName = selectedItem.original_name || selectedItem.name;

        // 선택된 아이템이 현재 폴더인 경우 (폴더 안에 들어갔을 때)
        // pathNameHistory의 마지막 항목과 selectedItem의 이름이 같으면 중복 방지
        const lastPathName = pathNameHistory[pathNameHistory.length - 1];

        if (selectedItem.mime_type === "folder" && lastPathName === itemName) {
            // 현재 폴더 자체가 선택된 경우
            return `/${pathNameHistory.join('/')}`;
        } else {
            // 현재 폴더 내의 파일이나 하위 폴더가 선택된 경우
            return `/${pathNameHistory.join('/')}/${itemName}`;
        }
    };

    const infoBlock = (
        <div className="space-y-6">
            <div className="flex flex-col">
                <span className="text-[9pt] font-semibold text-[#34475C]">유형</span>
                <span className="text-[9pt] font-normal text-[#667687]">
                    {selectedItem.mime_type === "folder" ? "폴더" : "파일"}
                </span>
            </div>

            {selectedItem.mime_type === "folder" && (
                <div className="flex flex-col">
                    <span className="text-[9pt] font-semibold text-[#34475C]">항목 수</span>
                    <span className="text-[9pt] font-normal text-[#667687]">{itemCount}</span>
                </div>
            )}

            <div className="flex flex-col">
                <span className="text-[9pt] font-semibold text-[#34475C]">위치</span>
                <span className="text-[9pt] font-normal text-[#667687] break-all">{getFullPath()}</span>
            </div>

            <div className="flex flex-col">
                <span className="text-[9pt] font-semibold text-[#34475C]">생성 날짜</span>
                <span className="text-[9pt] font-normal text-[#667687]">
                    {formatDateTime(selectedItem.createdAt)}
                </span>
            </div>

            <div className="flex flex-col">
                <span className="text-[9pt] font-semibold text-[#34475C]">수정 날짜</span>
                <span className="text-[9pt] font-normal text-[#667687]">
                    {formatDateTime(selectedItem.updatedAt)}
                </span>
            </div>

            {/* 파일일 때만 태그 섹션 표시 */}
            {selectedItem?.mime_type !== "folder" && (
                <div>
                    <span className="text-[9pt] font-semibold text-[#34475C]">태그</span>
                    <div className="mt-2">
                        <Tags
                            key={tagKey}
                            fileId={selectedItem?.id}
                            onDelete={handleDeleteTag}
                            onAdd={handleAddTag}
                        />
                    </div>
                </div>
            )}
        </div>
    );

    // isImage 변수 선언 위치 수정
    // isImage 변수 선언 위치 수정
    const isImage = selectedItem?.mime_type?.startsWith('image/');
    const isPdf = selectedItem?.mime_type === 'application/pdf';
    const isText = selectedItem?.mime_type === 'text/plain';

    const isPreviewable = isImage || isPdf || isText;
    const token = localStorage.getItem('accessToken');
    const previewUrl = isPreviewable && token
        ? `${import.meta.env.VITE_API_ENDPOINT || 'http://localhost:4000/api'}/files/${selectedItem.id}/preview?token=${token}`
        : null;

    if (isMobile) {
        return (
            <>
                <div className="md:hidden fixed inset-0 z-40 flex items-end justify-center">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
                        onClick={onClose}
                    />
                    <div className="relative w-full bg-white rounded-t-[28px] px-6 pt-4 pb-10 max-h-[88vh] overflow-y-auto">
                        <div className="mx-auto mb-4 h-1 w-16 bg-[#D4DAE5] rounded-full" />
                        <div className="flex justify-center mb-6">
                            {selectedItem.mime_type === "folder" ? (
                                <img
                                    src={isEmpty ? EmptyFolderIcon : FolderIcon}
                                    alt={selectedItem.mime_type}
                                    className="w-[120px] h-[90px]"
                                />
                            ) : (
                                <div className="rounded-lg flex items-center justify-center overflow-hidden">
                                    {isImage && !imageError ? (
                                        <img
                                            src={previewUrl}
                                            alt={selectedItem.name}
                                            className="max-w-[120px] max-h-[120px] object-contain rounded-lg shadow-sm"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <img src={FileIcon} alt="file" className="w-[90px] h-[110px]" />
                                    )}
                                </div>
                            )}
                        </div>
                        <h2 className="text-center text-[1.0625rem] font-semibold text-[#34475C] mb-6">
                            {selectedItem.name}
                        </h2>
                        {infoBlock}
                    </div>
                </div>

                {/* 태그 추가 모달 */}
                <AddTagsModal
                    isOpen={isAddTagModalOpen}
                    onClose={() => setIsAddTagModalOpen(false)}
                    fileId={selectedItem?.id}
                    onTagAdded={handleTagAdded}
                />
            </>
        );
    }

    return (
        <>
            <div className="hidden md:block md:w-[20.93svw] scrollbar-hide md:h-auto md:m-3 md:px-[2.65svw] md:pt-28 rounded-[15px] border-[1px] overflow-auto border-[#DAE0E9] bg-white p-6">
                <div className="flex justify-center mb-6">
                    {selectedItem.mime_type === "folder" ? (
                        <img
                            src={isEmpty ? EmptyFolderIcon : FolderIcon}
                            alt={selectedItem.mime_type}
                            className="md:w-[135px] md:h-[101px]"
                        />
                    ) : (
                        <div className="rounded-lg flex items-center justify-center overflow-hidden">
                            {isImage && !imageError ? (
                                <img
                                    src={previewUrl}
                                    alt={selectedItem.name}
                                    className="max-w-full max-h-[200px] object-contain rounded-lg shadow-md"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <img src={FileIcon} alt="file" className="md:w-[100px] md:h-[125px]" />
                            )}
                        </div>
                    )}
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-[11pt] font-semibold text-[#34475C]">{selectedItem.name}</h2>
                </div>

                {infoBlock}
            </div>

            {/* 태그 추가 모달 */}
            <AddTagsModal
                isOpen={isAddTagModalOpen}
                onClose={() => setIsAddTagModalOpen(false)}
                fileId={selectedItem?.id}
                onTagAdded={handleTagAdded}
            />
        </>
    );
}

export default Detail;