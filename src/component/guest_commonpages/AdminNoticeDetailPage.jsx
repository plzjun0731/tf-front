import React, { useState, useEffect } from "react";
import { getNoticeDetail } from "../../services/NoticeApi";
import "../styles/AdminNotice.css";

function AdminNoticeDetailPage({ noticeId, setPage }) {
  const [notice, setNotice] = useState(null);
  
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const noticeData = await getNoticeDetail(noticeId);
        setNotice(noticeData);
      } catch (err) {
        console.error('공지사항 상세 로드 실패:', err)
      } 
    };

    if (noticeId) {
      fetchNotice();
    }
  }, [noticeId]);

  if (!notice) return <div>공지사항을 찾을 수 없습니다.</div>;

  return (
    <div className="admin-wrapper">
      <main className="main-content">
        <div className="notice-write-box">
          <h2>{notice.title}</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              padding: "10px 0",
              borderBottom: "1px solid var(--white-25)",
            }}
          >
            <p style={{ color: "var(--text-color)", margin: 0 }}>
              작성일: {notice.date || "2024-01-01"}
            </p>
            <p style={{ color: "var(--text-color)", margin: 0 }}>
              작성자: {notice.author || "관리자"}
            </p>
          </div>

          <div className="form-group">
            <label>내용</label>
            <textarea
              readOnly
              value={notice.content || "내용 없음"}
              style={{
                minHeight: "200px",
                backgroundColor: "var(--white-10)",
                color: "var(--text-color)",
                border: "1px solid var(--white-25)",
                resize: "none",
              }}
            />
          </div>

          <div className="form-group">
            <label>첨부파일</label>
            <div
              style={{
                padding: "10px 12px",
                backgroundColor: "var(--white-10)",
                border: "1px solid var(--white-25)",
                borderRadius: "6px",
                color: "var(--text-color)",
              }}
            >
              {notice.file ? (
                <a
                  href="#"
                  style={{
                    color: "var(--color-gold-light)",
                    textDecoration: "none",
                  }}
                >
                  📎 {notice.file}
                </a>
              ) : (
                "첨부파일 없음"
              )}
            </div>
          </div>

          <button className="submit-btn" onClick={() => setPage("notice")}>
            목록으로 돌아가기
          </button>
        </div>
      </main>
    </div>
  );
}

export default AdminNoticeDetailPage;
