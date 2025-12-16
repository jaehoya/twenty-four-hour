import React from "react";
import { useOutletContext } from "react-router-dom";
import Data from "../components/layout/Data";

function TrashPage() {
    const { selectedItem, onItemSelect, onFileUpload, sortOption, searchQuery } = useOutletContext();
    
    return (
        <div 
            className="flex-1 flex flex-col mt-2 md:mt-3 mb-2 md:mb-3 rounded-[15px] transition-all duration-300 relative min-h-0 max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-180px)]"
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <Data 
                selectedItem={selectedItem} 
                onItemSelect={onItemSelect}
                isAddNewItemOpen={false}
                setIsAddNewItemOpen={() => {}}
                onFileUpload={onFileUpload}
                activeTab="trash"
                sortOption={sortOption}
                searchQuery={searchQuery}
            />
        </div>
    );
}

export default TrashPage;

