import React from "react";
import "../styles/MeetingLogBoard.css";

const MeetingLogDetail = ({
  log,
  onBack,
  onDelete,
  onEdit,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  currentIndex,
  totalCount,
}) => {
  if (!log) return <p>회의록을 선택해주세요.</p>;

  return (
    <div className="meeting-log-detail-form">
      {/* 네비게이션 헤더 */}
      <div className="detail-navigation">
        <div className="nav-info">
          {currentIndex} / {totalCount}
        </div>
        <div className="nav-buttons">
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="nav-button"
          >
            이전
          </button>
          <button onClick={onNext} disabled={!hasNext} className="nav-button">
            다음
          </button>
        </div>
      </div>

      <div className="detail-form-layout">
        <div className="form-section">
          <h2 className="section-title">회의 내용</h2>
          <table>
            <tbody>
              <tr>
                <th>주제</th>
                <td>{log.title}</td>
              </tr>
              <tr>
                <th>장소</th>
                <td>{log.location}</td>
              </tr>
              <tr>
                <th>일시</th>
                <td>{log.date}</td>
              </tr>
              <tr>
                <th>작성자</th>
                <td>{log.author}</td>
              </tr>
              <tr>
                <th>참여자</th>
                <td>{log.attendees}</td>
              </tr>
              <tr>
                <th>결석자</th>
                <td>{log.absentees}</td>
              </tr>
              <tr>
                <th>내용</th>
                <td className="pre-line">{log.content}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="form-section">
          <h2 className="section-title">회의 요약</h2>
          <table>
            <tbody>
              <tr>
                <th>결론</th>
                <td>{log.conclusion}</td>
              </tr>
              <tr>
                <th>다음 단계</th>
                <td>{log.nextStep}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="form-section">
          <h2 className="section-title">Follow-up</h2>
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>작업</th>
                <th>실행자</th>
                <th>마감일</th>
              </tr>
            </thead>
            <tbody>
              {log.followUps?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.task}</td>
                  <td>{item.executor}</td>
                  <td>{item.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="detail-buttons">
        <button onClick={onBack}>목록으로</button>
        <button onClick={() => onEdit(log.id)}>수정</button>
        <button onClick={() => onDelete(log.id)}>삭제</button>
      </div>
    </div>
  );
};

export default MeetingLogDetail;
