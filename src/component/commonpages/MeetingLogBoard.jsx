import React, { useState, useEffect } from "react";
import MeetingLogWriteForm from "./MeetingLogWriteForm";
import MeetingLogDetail from "./MeetingLogDetail";
import "../styles/MeetingLogBoard.css";

const MeetingLogItem = ({ log, onView }) => (
  <div className="meeting-log-item" onClick={() => onView(log.id)}>
    <h3>{log.title}</h3>
    <p>
      작성자: {log.author} | 작성일: {log.date}
    </p>
  </div>
);

const MeetingLogBoard = () => {
  const [viewMode, setViewMode] = useState("list");
  const [meetingLogs, setMeetingLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [editingLog, setEditingLog] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredMeetingLogs, setFilteredMeetingLogs] = useState([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(-1);

  useEffect(() => {
    const result = meetingLogs.filter(
      (log) =>
        searchKeyword.trim() === "" || log.title.includes(searchKeyword.trim())
    );
    setFilteredMeetingLogs(result);
  }, [meetingLogs, searchKeyword]);

  const handleSearch = () => {
    setSearchKeyword(inputValue);
  };

  const handleSaveLog = (newLogData) => {
    if (editingLog) {
      setMeetingLogs((prevLogs) =>
        prevLogs.map((log) =>
          log.id === editingLog.id ? { ...log, ...newLogData } : log
        )
      );
      setEditingLog(null);
    } else {
      const newId =
        meetingLogs.length > 0
          ? Math.max(...meetingLogs.map((log) => log.id)) + 1
          : 1;
      setMeetingLogs((prevLogs) => [...prevLogs, { ...newLogData, id: newId }]);
    }
    setViewMode("list");
  };

  const handleViewLog = (logId) => {
    const logToView = meetingLogs.find((log) => log.id === logId);
    const logIndex = filteredMeetingLogs.findIndex((log) => log.id === logId);
    setSelectedLog(logToView);
    setCurrentLogIndex(logIndex);
    setViewMode("view");
  };

  const handleDeleteLog = (logId) => {
    if (window.confirm("정말로 이 회의록을 삭제하시겠습니까?")) {
      setMeetingLogs((prevLogs) => prevLogs.filter((log) => log.id !== logId));
      setViewMode("list");
      setSelectedLog(null);
      setCurrentLogIndex(-1);
    }
  };

  const handleEditLog = (logId) => {
    const logToEdit = meetingLogs.find((log) => log.id === logId);
    setEditingLog(logToEdit);
    setViewMode("write");
  };

  // 이전 게시물로 이동
  const handlePreviousLog = () => {
    if (currentLogIndex > 0) {
      const previousLog = filteredMeetingLogs[currentLogIndex - 1];
      const fullLog = meetingLogs.find((log) => log.id === previousLog.id);
      setSelectedLog(fullLog);
      setCurrentLogIndex(currentLogIndex - 1);
    }
  };

  // 다음 게시물로 이동
  const handleNextLog = () => {
    if (currentLogIndex < filteredMeetingLogs.length - 1) {
      const nextLog = filteredMeetingLogs[currentLogIndex + 1];
      const fullLog = meetingLogs.find((log) => log.id === nextLog.id);
      setSelectedLog(fullLog);
      setCurrentLogIndex(currentLogIndex + 1);
    }
  };

  return (
    <div className="meeting-log-board">
      {viewMode === "list" && (
        <div className="meeting-log-list-section">
          <div className="meeting-log-header">
            <h2>회의록</h2>
            <button
              className="register-button"
              onClick={() => {
                setViewMode("write");
                setEditingLog(null);
              }}
            >
              등록
            </button>
          </div>

          <div className="meeting-log-search">
            <select disabled>
              <option>제목</option>
            </select>
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button onClick={handleSearch}>검색</button>
          </div>

          <div className="meeting-log-count">
            전체 {filteredMeetingLogs.length}건
          </div>

          <ul className="meeting-log-list">
            {filteredMeetingLogs.length === 0 ? (
              <li className="empty">등록된 회의록이 없습니다.</li>
            ) : (
              filteredMeetingLogs.map((log) => (
                <li
                  key={log.id}
                  onClick={() => handleViewLog(log.id)}
                  className="meeting-log-list-item"
                >
                  {log.title}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {viewMode === "write" && (
        <MeetingLogWriteForm
          onSave={handleSaveLog}
          onCancel={() => {
            setViewMode("list");
            setEditingLog(null);
          }}
          initialData={editingLog}
        />
      )}

      {viewMode === "view" && selectedLog && (
        <MeetingLogDetail
          log={selectedLog}
          onBack={() => {
            setViewMode("list");
            setSelectedLog(null);
            setCurrentLogIndex(-1);
          }}
          onDelete={handleDeleteLog}
          onEdit={handleEditLog}
          onPrevious={handlePreviousLog}
          onNext={handleNextLog}
          hasPrevious={currentLogIndex > 0}
          hasNext={currentLogIndex < filteredMeetingLogs.length - 1}
          currentIndex={currentLogIndex + 1}
          totalCount={filteredMeetingLogs.length}
        />
      )}
    </div>
  );
};

export default MeetingLogBoard;
