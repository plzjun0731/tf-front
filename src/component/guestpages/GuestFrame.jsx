import React, { useState } from 'react';
import '../styles/Mainframe.css';
import Calendar from '../commonpages/Calendar';

const AdminFrame = ({ onLogout }) => {
    const [page, setPage] = useState('notice-manage');

    const menuItems = [
        { id: 'notice-manage', label: '공지 관리' },
        { id: 'db-manage', label: 'DB 관리' },
        { id: 'executive-manage', label: '임원 관리' },
        { id: 'board', label: '게시판' },
        { id: 'calendar', label: '캘린더' }
    ];

    const getCurrentPageTitle = () => {
        const currentMenu = menuItems.find(item => item.id === page);
        return currentMenu ? currentMenu.label : '';
    };

    const renderContent = () => {
        switch (page) {
        case 'notice-manage':
            return <div>공지 관리</div>;
        case 'db-manage':
            return <div>DB 관리</div>;
        case 'executive-manage':
            return <div>임원 관리</div>;
        case 'board':
            return <div>게시판</div>;
        case 'calendar':
            return <Calendar />;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="navbar">
                <button className="logout-button" onClick={onLogout}>로그아웃</button>
            </div>

            <nav className="sidebar">
                <div className="sidebar-header">
                    <div className="user-role">게스트</div>
                </div>
                <ul className="menu-list">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                className={`menu-button ${page === item.id ? 'active' : ''}`}
                                onClick={() => setPage(item.id)}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="title-bar">
                <h1 className="page-title">{getCurrentPageTitle()}</h1>
            </div>
            <div className="content-area">
                <div className="page-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminFrame;
