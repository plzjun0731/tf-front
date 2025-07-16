// TeamDataContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const TeamDataContext = createContext();

export const useTeamData = () => {
    const context = useContext(TeamDataContext);
    if (!context) {
        throw new Error('useTeamData must be used within TeamDataProvider');
    }
    return context;
};

export const TeamDataProvider = ({ children, teamId, teamName }) => {
    // 팀별 데이터 초기화
    const [teamData, setTeamData] = useState({
        dbEntries: [],
        schedules: [],
        performance: [],
        executives: []
    });

    const [loading, setLoading] = useState(false);

    // teamId가 바뀔 때마다 해당 팀의 데이터를 로드
    useEffect(() => {
        const savedData = localStorage.getItem(`teamData_${teamId}`);
        const initialData = savedData ? JSON.parse(savedData) : {
            dbEntries: [],
            schedules: [],
            performance: [],
            executives: []
        };
        setTeamData(initialData);
    }, [teamId]);

    // 팀 데이터가 변경될 때마다 localstorage에 저장
    useEffect(() => {
        localStorage.setItem(`teamData_${teamId}`, JSON.stringify(teamData));
    }, [teamData, teamId]);

    // 데이터 업데이트 함수
    const updateTeamData = (key, data) => {
        setTeamData(prev => ({
            ...prev,
            [key]: data
        }));
    };

    // DB 엔트리 관련 함수들
    const addDbEntry = (entry) => {
        const newEntry = {
            ...entry,
            id: Date.now(),
            teamId: teamId,
            createdAt: new Date().toISOString()
        };
        
        setTeamData(prev => ({
            ...prev,
            dbEntries: [...prev.dbEntries, newEntry]
        }));
        
        return newEntry;
    };

    const updateDbEntry = (id, updatedEntry) => {
        setTeamData(prev => ({
            ...prev,
            dbEntries: prev.dbEntries.map(entry => 
                entry.id === id ? { ...entry, ...updatedEntry } : entry
            )
        }));
    };

    const deleteDbEntry = (id) => {
        setTeamData(prev => ({
            ...prev,
            dbEntries: prev.dbEntries.filter(entry => entry.id !== id)
        }));
    };

    // 스케줄 관련 함수들
    const addSchedule = (schedule) => {
        const newSchedule = {
            ...schedule,
            id: Date.now(),
            teamId: teamId,
            createdAt: new Date().toISOString()
        };
        
        setTeamData(prev => ({
            ...prev,
            schedules: [...prev.schedules, newSchedule]
        }));
        
        return newSchedule;
    };

    const updateSchedule = (id, updatedSchedule) => {
        setTeamData(prev => ({
            ...prev,
            schedules: prev.schedules.map(schedule => 
                schedule.id === id ? { ...schedule, ...updatedSchedule } : schedule
            )
        }));
    };

    const deleteSchedule = (id) => {
        setTeamData(prev => ({
            ...prev,
            schedules: prev.schedules.filter(schedule => schedule.id !== id)
        }));
    };

    // 실적 관련 함수들
    const addPerformance = (performance) => {
        const newPerformance = {
            ...performance,
            id: Date.now(),
            teamId: teamId,
            createdAt: new Date().toISOString()
        };
        
        setTeamData(prev => ({
            ...prev,
            performance: [...prev.performance, newPerformance]
        }));
        
        return newPerformance;
    };

    const updatePerformance = (id, updatedPerformance) => {
        setTeamData(prev => ({
            ...prev,
            performance: prev.performance.map(perf => 
                perf.id === id ? { ...perf, ...updatedPerformance } : perf
            )
        }));
    };

    const deletePerformance = (id) => {
        setTeamData(prev => ({
            ...prev,
            performance: prev.performance.filter(perf => perf.id !== id)
        }));
    };

    // 제휴처 임원 관련 함수들
    const addExecutive = (executive) => {
        const newExecutive = {
            ...executive,
            id: Date.now(),
            teamId: teamId,
            createdAt: new Date().toISOString()
        };
        
        setTeamData(prev => ({
            ...prev,
            executives: [...prev.executives, newExecutive]
        }));
        
        return newExecutive;
    };

    const updateExecutive = (id, updatedExecutive) => {
        setTeamData(prev => ({
            ...prev,
            executives: prev.executives.map(exec => 
                exec.id === id ? { ...exec, ...updatedExecutive } : exec
            )
        }));
    };

    const deleteExecutive = (id) => {
        setTeamData(prev => ({
            ...prev,
            executives: prev.executives.filter(exec => exec.id !== id)
        }));
    };

    // 데이터 초기화 함수
    const resetTeamData = () => {
        const initialData = {
            dbEntries: [],
            schedules: [],
            performance: [],
            executives: []
        };
        setTeamData(initialData);
        localStorage.removeItem(`teamData_${teamId}`);
    };

    const value = {
        teamData,
        teamId,
        teamName,
        loading,
        updateTeamData,
        // DB 관련
        addDbEntry,
        updateDbEntry,
        deleteDbEntry,
        // 스케줄 관련
        addSchedule,
        updateSchedule,
        deleteSchedule,
        // 실적 관련
        addPerformance,
        updatePerformance,
        deletePerformance,
        // 제휴처 임원 관련
        addExecutive,
        updateExecutive,
        deleteExecutive,
        // 유틸리티
        resetTeamData
    };

    return (
        <TeamDataContext.Provider value={value}>
            {children}
        </TeamDataContext.Provider>
    );
};