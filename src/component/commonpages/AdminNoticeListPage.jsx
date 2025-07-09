import React, { useState, useEffect } from 'react';
import '../styles/AdminNotice.css';
import './AdminNoticeWritePage';
// import axios from 'axios'; // 백엔드 연동 시 사용

function AdminNoticeListPage({ setPage, setSelectedNotice }) {
  const [notices, setNotices] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    setNotices([]); // 백엔드 생기면 axios로 대체
  }, []);

  useEffect(() => {
    const result = notices.filter((n) =>
      searchKeyword.trim() === '' || n.title.includes(searchKeyword.trim())
    );
    setFiltered(result);
  }, [notices, searchKeyword]);

  const handleWriteClick = () => {
    setPage('write');
  };

  const handleSearch = () => {
    setSearchKeyword(inputValue);
  };

  return (
    <div className="admin-wrapper">
      <main className="main-content">
        <div className="page-wrapper">
          <div className="notice-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'var(--text-color)', fontSize: '1.2rem' }}>공지사항</h2>
            <button className="write-btn" onClick={handleWriteClick}>글쓰기</button>
          </div>

          <div className="notice-search">
            <select>
              <option>제목</option>
              <option>내용</option>
              <option>작성자</option>
            </select>
            <input
              type="text"
              placeholder="검색어를 입력해주세요."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>검색</button>
          </div>

          <div className="notice-count">전체 {filtered.length}건</div>

          <ul className="notice-list">
            {filtered.length === 0 ? (
              <li>공지사항이 없습니다.</li>
            ) : (
              filtered.map((notice) => (
                <li
                  key={notice.id}
                  onClick={() => {
                    setSelectedNotice(notice);
                    setPage('detail');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {notice.title}
                </li>
              ))
            )}
          </ul>

          <div className="pagination">
            <button disabled>«</button>
            <button className="current">1</button>
            <button disabled>2</button>
            <button disabled>3</button>
            <button disabled>»</button>
          </div>
        </div>
      </main>
    </div>
  );
}


export default AdminNoticeListPage;
