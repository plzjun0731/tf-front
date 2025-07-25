import React, { useState, useEffect } from "react";
import { getNoticeList } from "../../services/NoticeApi";
import "../styles/AdminNotice.css";

function AdminNoticeListPage({ setPage, setSelectedNotice }) {
  const [notices, setNotices] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const noticeList = await getNoticeList();
        setNotices(noticeList);
      } catch (error) {
        console.error("공지사항 불러오기 실패:", error);
        setNotices([]);
      }
    }
    fetchNotices();
  }, []);

  useEffect(() => {
    const result = notices.filter((n) => {
      if (searchKeyword.trim() === "") return true;

      switch (searchType) {
        case "title":
          return n.title.includes(searchKeyword.trim());
        case "content":
          return n.content && n.content.includes(searchKeyword.trim());
        case "author":
          return n.author && n.author.includes(searchKeyword.trim());
        default:
          return n.title.includes(searchKeyword.trim());
      }
    });
    setFiltered(result);
    setCurrentPage(1);
  }, [notices, searchKeyword, searchType]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  const handleWriteClick = () => {
    setPage("write");
  };

  const handleSearch = () => {
    setSearchKeyword(inputValue);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice.id);
    setPage("detail");
  };

  // 페이지네이션 버튼 렌더링
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={currentPage === i ? "current" : ""}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="notice-page-container">
      <div className="notice-header">
        <h2>공지사항</h2>
        <button className="write-btn" onClick={handleWriteClick}>
          글쓰기
        </button>
      </div>
      <div className="notice-search">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="title">제목</option>
          <option value="author">작성자</option>
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

          <div className="notice-count">전체 {filtered.length}건</div>

          <ul className="notice-list">
            {currentItems.length === 0 ? (
              <li>공지사항이 없습니다.</li>
            ) : (
              currentItems.map((notice) => (
                <li
                  key={notice.id}
                  onClick={() => handleNoticeClick(notice)}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <span>{notice.title}</span>
                    <span
                      style={{ fontSize: "0.9rem", color: "var(--white-50)" }}
                    >
                      {notice.date} | {notice.author}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={currentPage === 1}>
                «
              </button>
              {renderPaginationButtons()}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          )}
    </div>
  );
}

export default AdminNoticeListPage;
