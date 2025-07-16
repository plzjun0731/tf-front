// AdminFrame.jsx
import React, { useState, useMemo } from 'react';
import AffiliateBusiness from './AffiliateBusiness';
import BoardPage from '../guest_commonpages/BoardPage';
import Calendar from '../guest_commonpages/Calendar';
import { logoutUser } from '../../services/LoginApi';
import '../styles/Mainframe.css';

const MENU_ITEMS = [
    { id: 'alliance', label: '제휴사업' },
    { id: 'board', label: '게시판' },
    { id: 'calendar', label: '캘린더' },
    { id: 'team-stats', label: '팀별 실적' }
];

const GuestFrame = ({ onLogout }) => {
    const handleLogoutClick = async () => {
        const confirmLogout = window.confirm('로그아웃 하시겠습니까?');
        if (!confirmLogout) return;

        try {
            await logoutUser();
            console.log('로그아웃');
            onLogout();
        } catch (error) {
            if (error.status === 401 || error.status === 404) {
                onLogout(); 
            } else {
                console.log('로그아웃 실패: ', error)
                alert('로그아웃 실패');
            }
        }
        // onLogout(); // 프론트테스트
    };

    const [page, setPage] = useState('board');
    const [expandedMenu, setExpandedMenu] = useState(null);

    const isMenuActive = (menuItem) => {
        if (page === menuItem.id) return true;
        
        if (menuItem.hasSubMenu && menuItem.subItems) {
            return menuItem.subItems.some(subItem => subItem.id === page);
        }
        
        return false;
    };

    const currentPageTitle = useMemo(() => {
        for (const menu of MENU_ITEMS) {
            if (menu.subItems) {
            const subMenu = menu.subItems.find(item => item.id === page);
            if (subMenu) return subMenu.label;
            }
        }
        const currentMenu = MENU_ITEMS.find(item => item.id === page);
        return currentMenu ? currentMenu.label : '';
    }, [page]);


    const handleMenuClick = (menuId, hasSubMenu) => {
        if (hasSubMenu) {
            setExpandedMenu(expandedMenu === menuId ? null : menuId);
        } else {
            setPage(menuId);
            setExpandedMenu(null); 
        }
    };

    const renderContent = () => {
        switch (page) {
            case 'alliance':
                return <AffiliateBusiness />;
            case 'board':
                return <BoardPage />;
            case 'calendar':
                return <Calendar />;
            case 'team-stats':
                return <div>팀별 실적</div>;
            default:
                return <div>존재하지 않는 페이지입니다.</div>;
        }
    };

    return (
        <div className='container'>
            <nav className='navbar'>
                <button className="logout-button" onClick={handleLogoutClick}>로그아웃</button>
            </nav>
            <div className='main-layout'>
                <aside className='sidebar'>
                    <div className='sidebar-header'>
                        <div className='user-role'>게스트</div>
                    </div>
                    <ul className='menu-list'>
                        {MENU_ITEMS.map((item) => (
                            <li key={item.id}>
                                <button
                                    className={`menu-button ${isMenuActive(item) ? 'active' : ''}`}
                                    onClick={() => handleMenuClick(item.id, item.hasSubMenu)}
                                >
                                    {item.label}
                                </button>
                                {item.hasSubMenu && expandedMenu === item.id && (
                                    <ul className='sub-menu-list'>
                                        {item.subItems.map((subItem) => (
                                            <li key={subItem.id}>
                                                <button
                                                    className={`menu-button sub-menu ${page === subItem.id ? 'active' : ''}`}
                                                    onClick={() => setPage(subItem.id)}
                                                    data-menu={item.id}
                                                >
                                                    {subItem.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className='content-area'>
                    <header className='page-header'>
                        <h1 className='page-title'>{currentPageTitle}</h1>
                    </header>
                    <div className='page-content'>
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default GuestFrame;
