import React, { useEffect, useRef } from "react";
import useTopikQuestionTypes from "../../hooks/useTopikQuestion";

const LEVELS = [
  { label: "초급", value: "초급" },
  { label: "중급", value: "중급" },
  { label: "고급", value: "고급" },
];

const TopikFilter = ({
  filters,
  setFilters,
  loading,
  onGenerate,
  error,
}) => {
  const { data, loading: loadingTypes, error: errorTypes } = useTopikQuestionTypes();
  const topicInputRef = useRef(null);

  // Tự động chọn type đầu tiên khi data đã có và chưa chọn type
  useEffect(() => {
    if (data && data.length > 0 && !filters.type) {
      const firstType = data[0].type;
      setFilters(f => ({
        ...f,
        type: firstType,
        subtype: data.find(item => item.type === firstType && item.applicable_levels.includes(f.level))?.subtype || "",
      }));
    }
    // eslint-disable-next-line
  }, [data]);

  // Tự động chọn subtype đầu tiên hợp lệ khi type hoặc level đổi
  useEffect(() => {
    if (data && filters.type) {
      const validSubtypes = data
        .filter(
          item =>
            item.type === filters.type &&
            item.applicable_levels.includes(filters.level)
        )
        .map(item => item.subtype);
      if (validSubtypes.length > 0 && !validSubtypes.includes(filters.subtype)) {
        setFilters(f => ({
          ...f,
          subtype: validSubtypes[0],
        }));
      }
    }
    // eslint-disable-next-line
  }, [filters.type, filters.level, data]);

  // Type options
  const typeOptions = data ? [...new Set(data.map(item => item.type))] : [];

  // Subtype options cho type và level hiện tại
  const subtypeOptions = data
    ? data
        .filter(
          item =>
            item.type === filters.type &&
            item.applicable_levels.includes(filters.level)
        )
        .map(item => ({
          value: item.subtype,
          label: item.subtype,
        }))
    : [];

  // Khi chọn type, tự động chọn subtype đầu tiên hợp lệ
  const handleTypeChange = (e) => {
    const type = e.target.value;
    const firstSubtype = data
      ? (
          data
            .filter(
              item =>
                item.type === type &&
                item.applicable_levels.includes(filters.level)
            )[0]?.subtype || ""
        )
      : "";
    setFilters(f => ({
      ...f,
      type,
      subtype: firstSubtype,
    }));
  };

  // Khi chọn level, tự động chọn subtype đầu tiên hợp lệ
  const handleLevelChange = (e) => {
    const level = e.target.value;
    const firstSubtype = data
      ? (
          data
            .filter(
              item =>
                item.type === filters.type &&
                item.applicable_levels.includes(level)
            )[0]?.subtype || ""
        )
      : "";
    setFilters(f => ({
      ...f,
      level,
      subtype: firstSubtype,
    }));
  };

  const handleSubtypeChange = (e) => {
    setFilters(f => ({
      ...f,
      subtype: e.target.value,
    }));
    setTimeout(() => {
      topicInputRef.current?.focus();
    }, 0);
  };

  const handleTopicChange = (e) => {
    let value = e.target.value;
    if (value.length > 12) value = value.slice(0, 12);
    setFilters(f => ({
      ...f,
      topic: value,
    }));
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-8 mb-10 flex flex-col gap-6 border border-orange-100"
    >
      <div className="flex flex-wrap gap-6">
        {/* Level */}
        <div className="flex flex-col min-w-[140px]">
          <label className="font-semibold mb-2 text-gray-700">난이도</label>
          <select
            className="border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
            value={filters.level}
            onChange={handleLevelChange}
            disabled={loadingTypes}
          >
            {LEVELS.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
        {/* Type */}
        <div className="flex flex-col min-w-[180px]">
          <label className="font-semibold mb-2 text-gray-700">유형</label>
          <select
            className="border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
            value={filters.type}
            onChange={handleTypeChange}
            disabled={loadingTypes || !data}
          >
            {typeOptions.length === 0 && <option value="">--</option>}
            {typeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        {/* Subtype */}
        <div className="flex flex-col min-w-[220px]">
          <label className="font-semibold mb-2 text-gray-700">세부 유형</label>
          <select
            className="border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
            value={filters.subtype}
            onChange={handleSubtypeChange}
            disabled={loadingTypes || !data}
          >
            {subtypeOptions.length === 0 && <option value="">--</option>}
            {subtypeOptions.map(st => (
              <option key={st.value} value={st.value}>{st.label}</option>
            ))}
          </select>
          {/* Hiển thị mô tả subtype */}
          {filters.subtype && (
            <div className="text-sm text-gray-600 mt-1 min-h-[32px]">
              {
                data?.find(
                  item =>
                    item.type === filters.type &&
                    item.subtype === filters.subtype &&
                    item.applicable_levels.includes(filters.level)
                )?.description || ""
              }
            </div>
          )}
        </div>
        {/* Language */}
        <div className="flex flex-col min-w-[120px]">
          <label className="font-semibold mb-2 text-gray-700">언어 선택</label>
          <select
            className="border border-orange-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
            value={filters.language}
            onChange={e => handleFilter("language", e.target.value)}
          >
            <option value="Korean">한국어</option>
            <option value="English">English</option>
            <option value="Vietnamese">Tiếng Việt</option>
          </select>
        </div>
      </div>
      {/* Topic */}
      <div>
        <label className="font-semibold mb-2 text-gray-700 block">주제 (최대 12자)</label>
        <input
          ref={topicInputRef}
          type="text"
          value={filters.topic}
          onChange={handleTopicChange}
          maxLength={12}
          placeholder="예: 재택근무, 반려동물..."
          className="border border-orange-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent transition"
        />
      </div>
      <div>
        <button
          className="mt-2 px-8 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-xl shadow font-semibold hover:from-orange-500 hover:to-yellow-500 transition-all disabled:opacity-60"
          onClick={onGenerate}
          disabled={loading || !filters.topic || loadingTypes || !data}
        >
          {loading ? "Đang tạo..." : "문제 생성"}
        </button>
      </div>
      {(error || errorTypes) && <div className="text-red-600 mt-2">{error || errorTypes}</div>}
      {/* Spinner loading */}
      {loadingTypes && (
        <div className="flex items-center gap-2 text-gray-500 mt-2">
          <span className="animate-spin text-xl">⏳</span>
          <span>Đang tải lựa chọn...</span>
        </div>
      )}
      {/* Overlay khi tạo đề */}
      {loading && (
          <div className="flex flex-col items-center py-8">
            <Loader2 className="w-10 h-10 animate-spin text-orange-400 mb-2" />
            <div className="text-gray-500">{t("vocab.loading")}</div>
          </div>
      )}
    </div>
  );
};

export default TopikFilter;