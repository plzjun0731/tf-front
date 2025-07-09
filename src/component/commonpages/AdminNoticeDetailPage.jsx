import React from 'react';
import '../styles/AdminNotice.css';

function AdminNoticeDetailPage({ notice, setPage }) {
  if (!notice) return <div>공지사항을 찾을 수 없습니다.</div>;

  return (
    <div className="admin-wrapper">
      <main className="main-content">
        <div className="notice-write-box">
          <h2>{notice.title}</h2>
          <p style={{ color: 'var(--text-color)', marginBottom: '20px' }}>
            작성일: {notice.date || '2024-01-01'} {/* 임시 날짜 */}
          </p>
          <div className="form-group">
            <label>내용</label>
            <textarea readOnly value={notice.content || '내용 없음'} />
          </div>
          <div className="form-group">
            <label>첨부파일</label>
            <span style={{ color: 'var(--text-color)' }}>
              {notice.file ? notice.file : '첨부파일 없음'}
            </span>
          </div>
          <button className="submit-btn" onClick={() => setPage('notice')}>돌아가기</button>
        </div>
      </main>
    </div>
  );
}

export default AdminNoticeDetailPage;
