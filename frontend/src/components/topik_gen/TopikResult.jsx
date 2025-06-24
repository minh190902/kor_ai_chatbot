import React from "react";

const TopikResult = ({ result }) => {
  if (!result) return null;
  return (
    <div className="bg-purple-50 rounded-2xl p-8 shadow-lg mb-8 border border-purple-100">
      <div className="flex flex-wrap gap-2 mb-4">
        {result.info?.type && (
          <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs">{result.info.type}</span>
        )}
        {result.info?.subtype && (
          <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs">{result.info.subtype}</span>
        )}
        {result.info?.level && (
          <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs">{result.info.level}</span>
        )}
        {result.info?.topic && (
          <span className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-xs">{result.info.topic}</span>
        )}
        {result.info?.skill && (
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs">{result.info.skill}</span>
        )}
      </div>
      {result.passage && (
        <div className="mb-4">
          <div className="font-bold mb-1">지문</div>
          <div
            className="bg-white rounded-lg p-4 border border-gray-100"
            dangerouslySetInnerHTML={{ __html: result.passage }}
          />
        </div>
      )}
      {result.question && (
        <div className="mb-4">
          <div className="font-bold mb-1">문제</div>
          <div
            className="bg-white rounded-lg p-4 border border-gray-100"
            dangerouslySetInnerHTML={{ __html: result.question }}
          />
        </div>
      )}
      {result.choices && result.choices.length > 0 && (
        <div className="mb-4">
          <div className="font-bold mb-1">선택지</div>
          <div className="space-y-2">
            {result.choices.map((choice) => (
              <div
                key={choice.id}
                className={`p-2 rounded-lg border transition ${
                  choice.id === result.answer
                    ? "bg-green-100 border-green-400 font-semibold"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                {choice.text}
              </div>
            ))}
          </div>
        </div>
      )}
      {result.explanation && (
        <div className="mb-4">
          <div className="font-bold mb-1 text-green-700">정답 및 해설</div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            {result.explanation}
          </div>
        </div>
      )}
      {result.wrong && result.wrong.length > 0 && (
        <div>
          <div className="font-bold mb-1 text-red-700">오답 해설</div>
          <ul className="list-disc pl-5">
            {result.wrong.map((w) => (
              <li key={w.id} className="mb-1">
                <span className="font-semibold">
                  {result.choices?.find(c => c.id === w.id)?.text}:
                </span>{" "}
                {w.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TopikResult;