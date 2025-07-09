import React, { useState } from "react";
import MenualPage from "./MenualPage";
import MeetingLogBoard from "./MeetingLogBoard";
import AdminNoticeListPage from "./AdminNoticeListPage";
import '../styles/BoardPage.css';

function BoardPage() {
    const [page, setPage] = useState('menual');

    const menuItems = [
        { id: 'menual', label: '업무 매뉴얼' },
        { id: 'minutes', label: '회의록' },
        { id: 'notice', label: '공지사항' }
    ];

    const renderContent = () => {
        switch (page) {
            case 'menual':
                return <MenualPage />;
            case 'minutes':
                return <MeetingLogBoard />;
            case 'notice':
                return <AdminNoticeListPage />;
            default:
                return <MenualPage />;
        }
    };

    return (
        <div className="board-page-container">
            <div className="board-menu">
                {menuItems.map(item => (
                    <button 
                        key={item.id}
                        className={`menu-bt ${page === item.id ? 'active' : ''}`}
                        onClick={() => setPage(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
            <div className="board-content">
                {renderContent()}
            </div>
        </div>
    )
}

export default BoardPage;