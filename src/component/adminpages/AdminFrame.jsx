import React, { useState } from 'react';
import AdminAccountPage from './AdminAccountPage';
import BoardFrame from '../commonpages/BoardFrame';
import AffiliateBusiness from './AffiliateBusiness';
import Calendar from '../commonpages/Calendar';
import '../styles/Mainframe.css';


const AdminFrame = ({ onLogout }) => {
    const [page, setPage] = useState('account');

    const menuItems = [
        { id: 'alliance', label: '제휴사업' },
        { id: 'team-manage', label: '팀별 관리' },
        { id: 'board', label: '게시판' },
        { id: 'calendar', label: '캘린더' },
        { id: 'team-stats', label: '팀별 실적' },
        { id: 'account', label: '계정 생성' }
    ];

    const getCurrentPageTitle = () => {
        const currentMenu = menuItems.find(item => item.id === page);
        return currentMenu ? currentMenu.label : '';
    };

    const renderContent = () => {
        switch (page) {
            case 'team-manage':
                return <div>팀별 관리</div>;
            case 'alliance':
                return <AffiliateBusiness />;
            case 'board':
                return <BoardFrame />;
            case 'calendar':
                return <Calendar />;
            case 'team-stats':
                return <div>팀별 실적</div>;
            case 'account':
                return <AdminAccountPage />;
            default:
                return <AdminAccountPage />;
        }
    };

    return (
        <div className='container'>
            <nav className='navbar'>
                <button className="logout-button" onClick={onLogout}>로그아웃</button>
            </nav>
            <div className='main-layout'>
                <aside className='sidebar'>
                    <div className='sidebar-header'>
                        <div className='user-role'>관리자</div>
                    </div>
                    <ul className='menu-list'>
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
                </aside>
                <main className='content-area'>
                    <header className='page-header'>
                        <h1 className='page-title'>{getCurrentPageTitle()}</h1>
                    </header>
                    <div className='page-content'>
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminFrame;
