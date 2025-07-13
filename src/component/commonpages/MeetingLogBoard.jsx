import React, { useState, useEffect } from "react";
import MeetingLogWriteForm from "./MeetingLogWriteForm";
import MeetingLogDetail from "./MeetingLogDetail";
import { getMeetingLogList, getMeetingLogDetail, writeMeetingLog } from "../../services/MeetingLogApi";
import "../styles/MeetingLogBoard.css";

const MeetingLogBoard = () => {
  const [viewMode, setViewMode] = useState("list");
  const [meetingLogs, setMeetingLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [editingLog, setEditingLog] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchOption, setSearchOption] = useState("subject");
  const [filteredMeetingLogs, setFilteredMeetingLogs] = useState([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(-1);
  const itemsPerPage = 10; // 페이지당 항목 수

  useEffect(() => {
    const loadMeetingLogs = async () => {

      try {
        const data = await getMeetingLogList();
        setMeetingLogs(data);
      } catch (err) {
        console.error('회의록 로딩 실패:', err);
      }
    };

    loadMeetingLogs();
  }, []);
  
  useEffect(() => {
    const trimmedKeyword = searchKeyword.trim();
    const result = meetingLogs.filter((log) => {
      if (trimmedKeyword === "") {
        return true;
      }
      switch (searchOption) {
        case "subject":
          return log.subject && log.subject.includes(trimmedKeyword);
        case "content":
          return log.content && log.content.includes(trimmedKeyword);
        case "author":
          return log.author && log.author.includes(trimmedKeyword);
        // case "location":
        //   return log.location && log.location.includes(trimmedKeyword);
        // case "participants":
        //   return log.participants && log.participants.includes(trimmedKeyword);
        // case "conclusion":
        //   return log.conclusion && log.conclusion.includes(trimmedKeyword);
        // case "nextStep":
        //   return log.nextStep && log.nextStep.includes(trimmedKeyword);
        default:
          return log.subject && log.subject.includes(trimmedKeyword);
      }
    });
    setFilteredMeetingLogs(result);
    setCurrentLogIndex(-1); // 검색 후 인덱스 초기화
  }, [meetingLogs, searchKeyword, searchOption]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredMeetingLogs.length / itemsPerPage);

  const handleSearch = () => {
    setSearchKeyword(inputValue);
  };

  const handleSaveLog = async (newLogData) => {
    try {
        if (editingLog) {
            setMeetingLogs((prevLogs) =>
                prevLogs.map((log) =>
                log.id === editingLog.id ? { ...log, ...newLogData } : log
                )
            );
            setEditingLog(null);
        } else {
            console.log('회의록 등록:', newLogData);
            const result = await writeMeetingLog(newLogData);
            console.log('회의록 등록 성공:', result);

            const newId = meetingLogs.length > 0 ? Math.max(...meetingLogs.map((log) => log.id)) + 1 : 1;
            setMeetingLogs((prevLogs) => [...prevLogs, { 
                ...newLogData, 
                id: newId, 
                date: newLogData.startDate, 
                createdAt: new Date().toISOString() 
            }]);

            alert('회의록이 등록되었습니다.');
        }
        setViewMode("list");
    } catch (error) {
        console.error('회의록 등록 실패:', error);
        alert(`회의록 등록에 실패했습니다: ${error.message}`);
    }
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

  // 페이지네이션 버튼 렌더링 함수 추가
  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={currentLogIndex === i - 1 ? "active" : ""}
          onClick={() => {
            setCurrentLogIndex(i - 1);
            if (filteredMeetingLogs[i - 1]) {
              const log = meetingLogs.find((l) => l.id === filteredMeetingLogs[i - 1].id);
              setSelectedLog(log);
            }
          }}
        >
          {i}
        </button>
      );
    }
    return buttons;
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
              글쓰기
            </button>
          </div>

          <div className="meeting-log-search">
            <select
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}
            >
              <option value="subject" style={{color: "#1F2D3D"}}>주제</option>
              <option value="content" style={{color: "#1F2D3D"}}>내용</option>
              <option value="author" style={{color: "#1F2D3D"}}>작성자</option>
              {/* <option value="location" style={{color: "#1F2D3D"}}>장소</option>
              <option value="participants" style={{color: "#1F2D3D"}}>참여자</option>
              <option value="conclusion" style={{color: "#1F2D3D"}}>결론</option>
              <option value="nextStep" style={{color: "#1F2D3D"}}>다음 단계</option> */}
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

          <table className="meeting-log-table">
            <thead>
              <tr>
                <th>주제</th>
                <th>내용</th>
                <th>작성자</th>
                <th>시작 일시</th>
              </tr>
            </thead>
            <tbody>
            {filteredMeetingLogs.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="4" className="empty">등록된 회의록이 없습니다.</td>
              </tr>
            ) : (
              [...filteredMeetingLogs]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => handleViewLog(log.id)}
                    className="meeting-log-table-row"
                  >
                    <td className="log-subject">{log.subject}</td>
                    <td className="log-content">{log.content}</td>
                    <td className="log-author">{log.author}</td>
                    <td className="log-date">
                      {new Date(log.startDate).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })} ({new Date(log.startDate).toLocaleString("ko-KR", { weekday: "short" })}) {new Date(log.startDate).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
            )}
            </tbody>
          </table>
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
        <>
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
          {/* 동적 페이지네이션 */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={handlePreviousLog}
                disabled={currentLogIndex === 1}
              >
                «
              </button>
              {renderPaginationButtons()}
              <button 
                onClick={handleNextLog}
                disabled={currentLogIndex === totalPages}
              >
                »
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MeetingLogBoard;
