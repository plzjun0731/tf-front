import React, { useState, useEffect } from "react";
import { getBoardManual } from "../../services/ManualApi";
import "../styles/guest_MenualPage.css";

/**
 * 읽기 전용 업무 매뉴얼 페이지
 *  - API 로부터 매뉴얼을 가져와 화면에 표시만 합니다.
 *  - textarea 대신 <pre> 태그를 사용해 문자열을 그대로 보여주면서, 줄바꿈도 유지합니다.
 */
function MenualPage() {
  const [manual, setManual] = useState({ script: "", checklist: "", etc: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchManual = async () => {
      try {
        const result = await getBoardManual();
        if (!mounted) return;
        setManual({
          script: result.manualScript || "",
          checklist: result.manualChecklist || "",
          etc: result.manualEtc || "",
        });
      } catch (error) {
        console.error("매뉴얼 불러오기 실패:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchManual();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>불러오는 중...</p>;

  return (
    <div className="menual-page-container">
      <h2 className="text-xl font-bold mb-4">업무 매뉴얼</h2>

      <section className="db-section mb-6">
        <h3 className="font-semibold mb-2">DB 상담 멘트</h3>
        <pre className="manual-view whitespace-pre-wrap p-4 rounded-xl shadow">
          {manual.script || "등록된 내용이 없습니다."}
        </pre>
      </section>

      <section className="checklist-section mb-6">
        <h3 className="font-semibold mb-2">※ 상담 시 체크사항</h3>
        <pre className="manual-view whitespace-pre-wrap p-4 rounded-xl shadow">
          {manual.checklist || "등록된 내용이 없습니다."}
        </pre>
      </section>

      <section className="etc-section">
        <h3 className="font-semibold mb-2">특이사항</h3>
        <pre className="manual-view whitespace-pre-wrap p-4 rounded-xl shadow">
          {manual.etc || "등록된 내용이 없습니다."}
        </pre>
      </section>
    </div>
  );
}

export default MenualPage;