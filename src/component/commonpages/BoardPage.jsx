import React, { useState } from "react";
import MenualPage from "./MenualPage";
import MeetingLogBoard from "./MeetingLogBoard";
import AdminNoticeListPage from "./AdminNoticeListPage";
import AdminNoticeDetailPage from "./AdminNoticeDetailPage";
import AdminNoticeWritePage from "./AdminNoticeWritePage";
import '../styles/BoardPage.css';

function BoardPage() {
    const [page, setPage] = useState('menual');
    const [noticePage, setNoticePage] = useState("notice");
    const [noticeListKey, setNoticeListKey] = useState(0);
    const [selectedNoticeId, setSelectedNoticeId] = useState(null);

    const menuItems = [
        { id: 'menual', label: '업무 매뉴얼' },
        { id: 'minutes', label: '회의록' },
        { id: 'notice', label: '공지사항' }
    ];

    const handleNoticeAdded = () => {
        setNoticeListKey((prev) => prev + 1);
        setNoticePage("notice");
    };

    const renderContent = () => {
        switch (page) {
            case 'menual':
                return <MenualPage />;
            case 'minutes':
                return <MeetingLogBoard />;
            case 'notice':
                return renderNoticeContent();
            default:
                return <MenualPage />;
        }
    };

    const renderNoticeContent = () => {
        switch (noticePage) {
            case "notice":
                return (
                    <AdminNoticeListPage
                        key={noticeListKey}
                        setPage={setNoticePage}
                        setSelectedNotice={setSelectedNoticeId}
                    />
                );
                case "detail":
                    return (
                        <AdminNoticeDetailPage
                            noticeId={selectedNoticeId}
                            setPage={setNoticePage}
                        />
                );
                case "write":
                    return (
                        <AdminNoticeWritePage
                            setPage={setNoticePage}
                            onNoticeAdded={handleNoticeAdded}
                        />
                    );
                default:
                    return (
                        <AdminNoticeListPage
                            key={noticeListKey}
                            setPage={setNoticePage}
                            setSelectedNotice={setSelectedNoticeId}
                        />
                    );
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