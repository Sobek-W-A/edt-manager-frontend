import React, { useState } from 'react';

interface CollapsibleButtonProps {
    children: React.ReactNode;
}

const CollapsibleButton: React.FC<CollapsibleButtonProps> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div>
            <button
                className="p-1 text-white rounded hover:border-green-300 bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                onClick={toggleCollapse}
            >
                {isCollapsed ? 'Masquer' : 'Chercher professeur'}
            </button>
            {isCollapsed && (
                <div className="mt-3 p-3 border rounded bg-gray-100">{children}</div>
            )}
        </div>
    );
};

export default CollapsibleButton;