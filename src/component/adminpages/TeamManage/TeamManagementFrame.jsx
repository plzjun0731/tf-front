import React, { useState } from "react";
import PerformanceManagement from "./PerformanceManagement";
import DBManagement from "./DBManagement";
import { useTeamData } from "./TeamDataContext";
import "../../styles/admin/TeamManage/TeamManagementFrame.css";

function TeamManagement() {
    const { teamId, teamName, teamData } = useTeamData();
    const [page, setPage] = useState('performance');

    const tabItems = [
        { id: 'performance', label: '실적 관리' },
        { id: 'executive', label: '제휴처 임원' },
        { id: 'database', label: 'DB 관리' },
        { id: 'schedule', label: '외근 일정표' }
    ];

    const renderTabContent = () => {
        switch (page) {
            case 'performance':
                return <PerformanceManagement />;
            case 'executive':
                return <div>제휴처 임원 추가 기안서</div>;
            case 'database':
                return <DBManagement />;
            case 'schedule':
                return <div>스케줄</div>;
            default:
                return <div>실적 관리</div>;
        }
    };

    return (
        <div className="team-page-container">
            <div className="team-menu">
                {tabItems.map(item => (
                    <button
                        key={item.id}
                        className={`menu-bt ${page === item.id ? 'active' : ''}`}
                        onClick={() => setPage(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
            <div className="team-content">
                {renderTabContent()}
            </div>
        </div>
    );
}

export default TeamManagement;