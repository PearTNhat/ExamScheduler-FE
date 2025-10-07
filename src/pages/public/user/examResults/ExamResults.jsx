import React from "react";
import {
  Trophy,
  Star,
  TrendingUp,
  AlertCircle,
  Award,
  Target,
} from "lucide-react";

function ExamResults() {
  // Mock data - Replace with actual API data
  const examResults = [
    {
      id: 1,
      subject: "Lập trình Web",
      code: "IT4409",
      examType: "Giữa kỳ",
      score: 8.5,
      maxScore: 10,
      grade: "A",
      examDate: "2024-12-15",
      semester: "2024-2025 I",
    },
    {
      id: 2,
      subject: "Cơ sở dữ liệu",
      code: "IT3090",
      examType: "Cuối kỳ",
      score: 7.2,
      maxScore: 10,
      grade: "B+",
      examDate: "2024-12-18",
      semester: "2024-2025 I",
    },
    {
      id: 3,
      subject: "Mạng máy tính",
      code: "IT4060",
      examType: "Cuối kỳ",
      score: 9.0,
      maxScore: 10,
      grade: "A+",
      examDate: "2024-12-20",
      semester: "2024-2025 I",
    },
  ];

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A+":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "A":
        return "bg-green-100 text-green-800 border-green-200";
      case "B+":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "B":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "C+":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "C":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 9) return "text-emerald-600";
    if (score >= 8) return "text-green-600";
    if (score >= 7) return "text-blue-600";
    if (score >= 6) return "text-yellow-600";
    if (score >= 5) return "text-orange-600";
    return "text-red-600";
  };

  // Calculate statistics
  const averageScore =
    examResults.reduce((sum, result) => sum + result.score, 0) /
    examResults.length;
  const highestScore = Math.max(...examResults.map((result) => result.score));
  const totalExams = examResults.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Kết quả thi</h1>
          </div>
          <p className="text-indigo-100">Xem điểm số và kết quả các kỳ thi</p>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-amber-600" />
          <div>
            <h3 className="font-semibold text-amber-800">
              Tính năng đang phát triển
            </h3>
            <p className="text-amber-700 text-sm mt-1">
              Trang kết quả thi sẽ sớm được hoàn thiện với đầy đủ tính năng.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Điểm trung bình</p>
              <p
                className={`text-2xl font-bold ${getScoreColor(averageScore)}`}
              >
                {averageScore.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 rounded-full p-3">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Điểm cao nhất</p>
              <p
                className={`text-2xl font-bold ${getScoreColor(highestScore)}`}
              >
                {highestScore.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 rounded-full p-3">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng số bài thi</p>
              <p className="text-2xl font-bold text-gray-900">{totalExams}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Kết quả chi tiết
        </h2>

        <div className="space-y-4">
          {examResults.map((result) => (
            <div
              key={result.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {result.subject}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {result.code} • {result.examType} •{" "}
                    {new Date(result.examDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded-full border ${getGradeColor(
                      result.grade
                    )}`}
                  >
                    {result.grade}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Điểm số</p>
                    <p
                      className={`text-2xl font-bold ${getScoreColor(
                        result.score
                      )}`}
                    >
                      {result.score}/{result.maxScore}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Phần trăm</p>
                    <p
                      className={`text-xl font-semibold ${getScoreColor(
                        result.score
                      )}`}
                    >
                      {((result.score / result.maxScore) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-600">Học kỳ</p>
                  <p className="text-sm font-medium text-gray-900">
                    {result.semester}
                  </p>
                </div>
              </div>

              {/* Score Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      result.score >= 9
                        ? "bg-emerald-500"
                        : result.score >= 8
                        ? "bg-green-500"
                        : result.score >= 7
                        ? "bg-blue-500"
                        : result.score >= 6
                        ? "bg-yellow-500"
                        : result.score >= 5
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${(result.score / result.maxScore) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExamResults;
