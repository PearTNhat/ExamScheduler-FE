import { useState } from "react";
// Thêm import cho date-fns và các icon mới
import { startOfWeek, addDays, format, subDays, isSameDay } from "date-fns";
import { vi } from "date-fns/locale"; // Thêm tiếng Việt
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  MapPin,
  FileText,
  Sparkles,
  ChevronLeft, // Icon mới
  ChevronRight, // Icon mới
} from "lucide-react";
// Bỏ import Table...
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import ExamCard from "./components/ExamCard"; // Component con (cũng được cập nhật)
import { Button } from "~/components/ui/button"; // Dùng cho nút Next/Prev
import { Textarea } from "~/components/ui/textarea"; // Dùng cho ô nhập JSON

// Dữ liệu JSON mẫu với cấu trúc mới (để demo)
// const initialJsonData = `{
//   "startDate": "2025-05-01",
//   "endDate": "2025-05-31",
//   "holidays": [
//     "2025-05-01",
//     "2025-05-15"
//   ],
//   "examGroups": [
//     {
//       "examGroupId": "GT1-G1",
//       "courseCode": "GT1",
//       "studentCount": 100,
//       "duration": 90
//     },
//     {
//       "examGroupId": "GT1-G2",
//       "courseCode": "GT1",
//       "studentCount": 80,
//       "duration": 90
//     },
//     {
//       "examGroupId": "VL1-G1",
//       "courseCode": "VL1",
//       "studentCount": 50,
//       "duration": 60
//     }
//   ],
//   "rooms": [
//     { "roomId": "P101", "capacity": 100, "location": "D9" },
//     { "roomId": "P102", "capacity": 80, "location": "D9" },
//     { "roomId": "P201", "capacity": 50, "location": "D7" }
//   ],
//   "proctors": [
//     { "proctorId": "GV001" },
//     { "proctorId": "GV002" },
//     { "proctorId": "GV003" }
//   ],
//   "students": [
//     { "studentId": "SV001", "examGroups": ["GT1-G1", "VL1-G1"] },
//     { "studentId": "SV002", "examGroups": ["GT1-G1"] },
//     { "studentId": "SV003", "examGroups": ["GT1-G2", "VL1-G1"] },
//     { "studentId": "SV004", "examGroups": ["GT1-G2"] }
//   ],
//   "constraints": {
//     "maxExamsPerStudentPerDay": 2,
//     "avoidInterLocationTravel": true
//   }
// }`;
const initialJsonData = `{ 
  
    "examGroups": [
      {
        "examGroupId": "MH005-G1",
        "courseCode": "MH005",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH005-G2",
        "courseCode": "MH005",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH005-G3",
        "courseCode": "MH005",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH005-G4",
        "courseCode": "MH005",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH005-G5",
        "courseCode": "MH005",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH005-G6",
        "courseCode": "MH005",
        "studentCount": 12,
        "duration": 120
      },
      {
        "examGroupId": "MH008-G1",
        "courseCode": "MH008",
        "studentCount": 60,
        "duration": 60
      },
      {
        "examGroupId": "MH008-G2",
        "courseCode": "MH008",
        "studentCount": 60,
        "duration": 60
      },
      {
        "examGroupId": "MH008-G3",
        "courseCode": "MH008",
        "studentCount": 60,
        "duration": 60
      },
      {
        "examGroupId": "MH008-G4",
        "courseCode": "MH008",
        "studentCount": 60,
        "duration": 60
      },
      {
        "examGroupId": "MH008-G5",
        "courseCode": "MH008",
        "studentCount": 60,
        "duration": 60
      },
      {
        "examGroupId": "MH008-G6",
        "courseCode": "MH008",
        "studentCount": 11,
        "duration": 60
      },
      {
        "examGroupId": "MH002-G1",
        "courseCode": "MH002",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH002-G2",
        "courseCode": "MH002",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH002-G3",
        "courseCode": "MH002",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH002-G4",
        "courseCode": "MH002",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH002-G5",
        "courseCode": "MH002",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH002-G6",
        "courseCode": "MH002",
        "studentCount": 14,
        "duration": 120
      },
      {
        "examGroupId": "MH010-G1",
        "courseCode": "MH010",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH010-G2",
        "courseCode": "MH010",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH010-G3",
        "courseCode": "MH010",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH010-G4",
        "courseCode": "MH010",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH010-G5",
        "courseCode": "MH010",
        "studentCount": 13,
        "duration": 90
      },
      {
        "examGroupId": "MH001-G1",
        "courseCode": "MH001",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH001-G2",
        "courseCode": "MH001",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH001-G3",
        "courseCode": "MH001",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH001-G4",
        "courseCode": "MH001",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH001-G5",
        "courseCode": "MH001",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH001-G6",
        "courseCode": "MH001",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH001-G7",
        "courseCode": "MH001",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH001-G8",
        "courseCode": "MH001",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH001-G9",
        "courseCode": "MH001",
        "studentCount": 18,
        "duration": 90
      },
      {
        "examGroupId": "MH007-G1",
        "courseCode": "MH007",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH007-G2",
        "courseCode": "MH007",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH007-G3",
        "courseCode": "MH007",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH007-G4",
        "courseCode": "MH007",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH007-G5",
        "courseCode": "MH007",
        "studentCount": 44,
        "duration": 90
      },
      {
        "examGroupId": "MH006-G1",
        "courseCode": "MH006",
        "studentCount": 60,
        "duration": 180
      },
      {
        "examGroupId": "MH006-G2",
        "courseCode": "MH006",
        "studentCount": 60,
        "duration": 180
      },
      {
        "examGroupId": "MH006-G3",
        "courseCode": "MH006",
        "studentCount": 60,
        "duration": 180
      },
      {
        "examGroupId": "MH006-G4",
        "courseCode": "MH006",
        "studentCount": 60,
        "duration": 180
      },
      {
        "examGroupId": "MH006-G5",
        "courseCode": "MH006",
        "studentCount": 60,
        "duration": 180
      },
      {
        "examGroupId": "MH006-G6",
        "courseCode": "MH006",
        "studentCount": 42,
        "duration": 180
      },
      {
        "examGroupId": "MH003-G1",
        "courseCode": "MH003",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH003-G2",
        "courseCode": "MH003",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH003-G3",
        "courseCode": "MH003",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH003-G4",
        "courseCode": "MH003",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH003-G5",
        "courseCode": "MH003",
        "studentCount": 60,
        "duration": 90
      },
      {
        "examGroupId": "MH003-G6",
        "courseCode": "MH003",
        "studentCount": 11,
        "duration": 90
      },
      {
        "examGroupId": "MH009-G1",
        "courseCode": "MH009",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH009-G2",
        "courseCode": "MH009",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH009-G3",
        "courseCode": "MH009",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH009-G4",
        "courseCode": "MH009",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH009-G5",
        "courseCode": "MH009",
        "studentCount": 60,
        "duration": 120
      },
      {
        "examGroupId": "MH009-G6",
        "courseCode": "MH009",
        "studentCount": 12,
        "duration": 120
      },
      {
        "examGroupId": "MH004-G1",
        "courseCode": "MH004",
        "studentCount": 60,
        "duration": 60
      },
      {
        "examGroupId": "MH004-G2",
        "courseCode": "MH004",
        "studentCount": 60,
        "duration": 60
      },
      {
        "examGroupId": "MH004-G3",
        "courseCode": "MH004",
        "studentCount": 60,
        "duration": 60
      },
      {
        "examGroupId": "MH004-G4",
        "courseCode": "MH004",
        "studentCount": 60,
        "duration": 60
      },
      {
        "examGroupId": "MH004-G5",
        "courseCode": "MH004",
        "studentCount": 60,
        "duration": 60
      },
      {
        "examGroupId": "MH004-G6",
        "courseCode": "MH004",
        "studentCount": 11,
        "duration": 60
      }
    ],
    "students": [
      {
        "studentId": "SV001",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1"
        ]
      },
      {
        "studentId": "SV002",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV004",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH010-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV006",
        "examGroups": [
          "MH005-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV007",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH010-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV010",
        "examGroups": [
          "MH005-G1",
          "MH002-G1",
          "MH010-G1",
          "MH007-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV012",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH010-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV013",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G1",
          "MH007-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV015",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G1",
          "MH007-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV018",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV019",
        "examGroups": [
          "MH005-G1",
          "MH002-G1",
          "MH001-G1",
          "MH007-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV020",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV021",
        "examGroups": [
          "MH005-G1",
          "MH002-G1",
          "MH010-G1",
          "MH007-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV022",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV024",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV025",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV027",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH010-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV028",
        "examGroups": [
          "MH005-G1",
          "MH002-G1",
          "MH001-G1",
          "MH007-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV030",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV032",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G1",
          "MH007-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV033",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH010-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV035",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV037",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV038",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV040",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV041",
        "examGroups": [
          "MH005-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV043",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV045",
        "examGroups": [
          "MH005-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV046",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV048",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G1",
          "MH007-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV049",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH010-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV051",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV053",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV054",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV056",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV057",
        "examGroups": [
          "MH005-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV059",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV061",
        "examGroups": [
          "MH005-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV062",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV064",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G2",
          "MH007-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV065",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH010-G1",
          "MH001-G2",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV067",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G2",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV069",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV070",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH001-G2",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV072",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G2",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV073",
        "examGroups": [
          "MH005-G1",
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV075",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV077",
        "examGroups": [
          "MH005-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV078",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G2",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV080",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G2",
          "MH007-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV081",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH010-G1",
          "MH001-G2",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV083",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G2",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV085",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV086",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH001-G2",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV088",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH001-G2",
          "MH006-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV089",
        "examGroups": [
          "MH005-G1",
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV091",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV093",
        "examGroups": [
          "MH005-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV094",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G2",
          "MH001-G2",
          "MH006-G2",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV096",
        "examGroups": [
          "MH005-G1",
          "MH008-G1",
          "MH002-G2",
          "MH001-G2",
          "MH007-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV097",
        "examGroups": [
          "MH005-G2",
          "MH008-G1",
          "MH010-G1",
          "MH001-G2",
          "MH006-G2",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV099",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G1",
          "MH001-G2",
          "MH006-G2",
          "MH003-G1"
        ]
      },
      {
        "studentId": "SV101",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV102",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH001-G2",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2"
        ]
      },
      {
        "studentId": "SV104",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G2",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV105",
        "examGroups": [
          "MH005-G2",
          "MH010-G1",
          "MH001-G2",
          "MH007-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV107",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G1",
          "MH001-G2",
          "MH007-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV109",
        "examGroups": [
          "MH005-G2",
          "MH002-G2",
          "MH010-G1",
          "MH001-G2",
          "MH007-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV110",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G2",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV112",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G2",
          "MH007-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV113",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH010-G1",
          "MH001-G2",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2"
        ]
      },
      {
        "studentId": "SV115",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G2",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV117",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G2",
          "MH007-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV118",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH001-G2",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2"
        ]
      },
      {
        "studentId": "SV120",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G2",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV121",
        "examGroups": [
          "MH005-G2",
          "MH010-G2",
          "MH001-G2",
          "MH007-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV123",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV125",
        "examGroups": [
          "MH005-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV126",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV128",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH007-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV129",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH010-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2"
        ]
      },
      {
        "studentId": "SV131",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV133",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV134",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2"
        ]
      },
      {
        "studentId": "SV136",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV137",
        "examGroups": [
          "MH005-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV139",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV141",
        "examGroups": [
          "MH005-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV142",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV144",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH007-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV145",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH010-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2"
        ]
      },
      {
        "studentId": "SV147",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV149",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV150",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2"
        ]
      },
      {
        "studentId": "SV152",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV153",
        "examGroups": [
          "MH005-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV155",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV157",
        "examGroups": [
          "MH005-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV158",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV160",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH007-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV161",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH010-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2"
        ]
      },
      {
        "studentId": "SV163",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV165",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV166",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2"
        ]
      },
      {
        "studentId": "SV168",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV169",
        "examGroups": [
          "MH005-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV171",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV173",
        "examGroups": [
          "MH005-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV174",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV176",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH007-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV177",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH010-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2"
        ]
      },
      {
        "studentId": "SV179",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH006-G3",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV181",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV182",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH001-G3",
          "MH006-G3",
          "MH003-G2",
          "MH009-G2"
        ]
      },
      {
        "studentId": "SV184",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH001-G4",
          "MH006-G3",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV185",
        "examGroups": [
          "MH005-G2",
          "MH010-G2",
          "MH001-G4",
          "MH007-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV187",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G4",
          "MH007-G2",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV189",
        "examGroups": [
          "MH005-G2",
          "MH002-G2",
          "MH010-G2",
          "MH001-G4",
          "MH007-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV190",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV192",
        "examGroups": [
          "MH005-G2",
          "MH008-G2",
          "MH002-G3",
          "MH001-G4",
          "MH007-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV193",
        "examGroups": [
          "MH005-G3",
          "MH008-G2",
          "MH010-G2",
          "MH001-G4",
          "MH006-G3",
          "MH003-G2",
          "MH009-G2"
        ]
      },
      {
        "studentId": "SV195",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G2",
          "MH001-G4",
          "MH006-G3",
          "MH003-G2"
        ]
      },
      {
        "studentId": "SV197",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G2",
          "MH001-G4",
          "MH007-G2",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV198",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3"
        ]
      },
      {
        "studentId": "SV200",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV201",
        "examGroups": [
          "MH005-G3",
          "MH010-G2",
          "MH001-G4",
          "MH007-G2",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV203",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G2",
          "MH001-G4",
          "MH007-G2",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV205",
        "examGroups": [
          "MH005-G3",
          "MH002-G3",
          "MH010-G2",
          "MH001-G4",
          "MH007-G2",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV206",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV208",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G4",
          "MH007-G2",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV209",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH010-G2",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3"
        ]
      },
      {
        "studentId": "SV211",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G2",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV213",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G2",
          "MH001-G4",
          "MH007-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV214",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3"
        ]
      },
      {
        "studentId": "SV216",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV217",
        "examGroups": [
          "MH005-G3",
          "MH010-G2",
          "MH001-G4",
          "MH007-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV219",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G2",
          "MH001-G4",
          "MH007-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV221",
        "examGroups": [
          "MH005-G3",
          "MH002-G3",
          "MH010-G2",
          "MH001-G4",
          "MH007-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV222",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV224",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G4",
          "MH007-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV225",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH010-G2",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3"
        ]
      },
      {
        "studentId": "SV227",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G2",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV229",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G2",
          "MH001-G4",
          "MH007-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV230",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3"
        ]
      },
      {
        "studentId": "SV232",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV233",
        "examGroups": [
          "MH005-G3",
          "MH010-G2",
          "MH001-G4",
          "MH007-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV235",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G4",
          "MH007-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV237",
        "examGroups": [
          "MH005-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G4",
          "MH007-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV238",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV240",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G4",
          "MH007-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV241",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH010-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3"
        ]
      },
      {
        "studentId": "SV243",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH006-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV245",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV246",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH001-G5",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3"
        ]
      },
      {
        "studentId": "SV248",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G5",
          "MH006-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV249",
        "examGroups": [
          "MH005-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV251",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV253",
        "examGroups": [
          "MH005-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV254",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G5",
          "MH006-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV256",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G5",
          "MH007-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV257",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH010-G3",
          "MH001-G5",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3"
        ]
      },
      {
        "studentId": "SV259",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH006-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV261",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV262",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH001-G5",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3"
        ]
      },
      {
        "studentId": "SV264",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G5",
          "MH006-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV265",
        "examGroups": [
          "MH005-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV267",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV269",
        "examGroups": [
          "MH005-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV270",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G5",
          "MH006-G4",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV272",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G5",
          "MH007-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV273",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH010-G3",
          "MH001-G5",
          "MH006-G4",
          "MH003-G3",
          "MH009-G3"
        ]
      },
      {
        "studentId": "SV275",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH006-G4",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV277",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV278",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH001-G5",
          "MH006-G4",
          "MH003-G3",
          "MH009-G3"
        ]
      },
      {
        "studentId": "SV280",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH001-G5",
          "MH006-G4",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV281",
        "examGroups": [
          "MH005-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV283",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV285",
        "examGroups": [
          "MH005-G3",
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV286",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G4",
          "MH001-G5",
          "MH006-G4",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV288",
        "examGroups": [
          "MH005-G3",
          "MH008-G3",
          "MH002-G4",
          "MH001-G5",
          "MH007-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV289",
        "examGroups": [
          "MH005-G4",
          "MH008-G3",
          "MH010-G3",
          "MH001-G5",
          "MH006-G4",
          "MH003-G3",
          "MH009-G3"
        ]
      },
      {
        "studentId": "SV291",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G5",
          "MH006-G4",
          "MH003-G3"
        ]
      },
      {
        "studentId": "SV293",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV294",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH001-G5",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4"
        ]
      },
      {
        "studentId": "SV296",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G5",
          "MH006-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV297",
        "examGroups": [
          "MH005-G4",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV299",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV301",
        "examGroups": [
          "MH005-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV302",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G5",
          "MH006-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV304",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH007-G3",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV305",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH010-G3",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4"
        ]
      },
      {
        "studentId": "SV307",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV309",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G3",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV310",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4"
        ]
      },
      {
        "studentId": "SV312",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV313",
        "examGroups": [
          "MH005-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G3",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV315",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G3",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV317",
        "examGroups": [
          "MH005-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV318",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV320",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH007-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV321",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH010-G3",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4"
        ]
      },
      {
        "studentId": "SV323",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV325",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV326",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4"
        ]
      },
      {
        "studentId": "SV328",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV329",
        "examGroups": [
          "MH005-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV331",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV333",
        "examGroups": [
          "MH005-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV334",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV336",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH007-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV337",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH010-G3",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4"
        ]
      },
      {
        "studentId": "SV339",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV341",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV342",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4"
        ]
      },
      {
        "studentId": "SV344",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV345",
        "examGroups": [
          "MH005-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV347",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV349",
        "examGroups": [
          "MH005-G4",
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV350",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV352",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH007-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV353",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH010-G3",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4"
        ]
      },
      {
        "studentId": "SV355",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G4",
          "MH001-G6",
          "MH006-G5",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV357",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G4",
          "MH001-G6",
          "MH007-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV358",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH001-G6",
          "MH006-G5",
          "MH003-G4",
          "MH009-G4"
        ]
      },
      {
        "studentId": "SV360",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH006-G5",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV361",
        "examGroups": [
          "MH005-G4",
          "MH010-G4",
          "MH001-G6",
          "MH007-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV363",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV365",
        "examGroups": [
          "MH005-G4",
          "MH002-G4",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV366",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G7",
          "MH006-G5",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV368",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G7",
          "MH007-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV369",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH010-G4",
          "MH001-G7",
          "MH006-G5",
          "MH003-G4",
          "MH009-G4"
        ]
      },
      {
        "studentId": "SV371",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G4",
          "MH001-G7",
          "MH006-G5",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV373",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV374",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH001-G7",
          "MH006-G5",
          "MH003-G4",
          "MH009-G4"
        ]
      },
      {
        "studentId": "SV376",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH001-G7",
          "MH006-G5",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV377",
        "examGroups": [
          "MH005-G4",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV379",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G4",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV381",
        "examGroups": [
          "MH005-G4",
          "MH002-G4",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV382",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G5",
          "MH001-G7",
          "MH006-G5",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV384",
        "examGroups": [
          "MH005-G4",
          "MH008-G4",
          "MH002-G5",
          "MH001-G7",
          "MH007-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV385",
        "examGroups": [
          "MH005-G5",
          "MH008-G4",
          "MH010-G4",
          "MH001-G7",
          "MH006-G5",
          "MH003-G4",
          "MH009-G4"
        ]
      },
      {
        "studentId": "SV387",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G7",
          "MH006-G5",
          "MH003-G4"
        ]
      },
      {
        "studentId": "SV389",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV390",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH001-G7",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5"
        ]
      },
      {
        "studentId": "SV392",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G7",
          "MH006-G5",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV393",
        "examGroups": [
          "MH005-G5",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV395",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV397",
        "examGroups": [
          "MH005-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV398",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G7",
          "MH006-G5",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV400",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G7",
          "MH007-G4",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV401",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH010-G4",
          "MH001-G7",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5"
        ]
      },
      {
        "studentId": "SV403",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G7",
          "MH006-G5",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV405",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV406",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH001-G7",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5"
        ]
      },
      {
        "studentId": "SV408",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G7",
          "MH006-G5",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV409",
        "examGroups": [
          "MH005-G5",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV411",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV413",
        "examGroups": [
          "MH005-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV414",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G7",
          "MH006-G5",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV416",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G7",
          "MH007-G4",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV417",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH010-G4",
          "MH001-G7",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5"
        ]
      },
      {
        "studentId": "SV419",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G7",
          "MH006-G5",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV421",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV422",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH001-G7",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5"
        ]
      },
      {
        "studentId": "SV424",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH006-G5",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV425",
        "examGroups": [
          "MH005-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV427",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV429",
        "examGroups": [
          "MH005-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV430",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH006-G5",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV432",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH007-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV433",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH010-G4",
          "MH001-G8",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5"
        ]
      },
      {
        "studentId": "SV435",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH006-G5",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV437",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV438",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH001-G8",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5"
        ]
      },
      {
        "studentId": "SV440",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV441",
        "examGroups": [
          "MH005-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV443",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV445",
        "examGroups": [
          "MH005-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV446",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV448",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH007-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV449",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH010-G4",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5",
          "MH009-G5"
        ]
      },
      {
        "studentId": "SV451",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV453",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV454",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5",
          "MH009-G5"
        ]
      },
      {
        "studentId": "SV456",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV457",
        "examGroups": [
          "MH005-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV459",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV461",
        "examGroups": [
          "MH005-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV462",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV464",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH007-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV465",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH010-G4",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5",
          "MH009-G5"
        ]
      },
      {
        "studentId": "SV467",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV469",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV470",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5",
          "MH009-G5"
        ]
      },
      {
        "studentId": "SV472",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV473",
        "examGroups": [
          "MH005-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV475",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G5",
          "MH010-G5",
          "MH001-G8",
          "MH007-G5",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV477",
        "examGroups": [
          "MH005-G5",
          "MH002-G5",
          "MH010-G5",
          "MH001-G8",
          "MH007-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV478",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G6",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV480",
        "examGroups": [
          "MH005-G5",
          "MH008-G5",
          "MH002-G6",
          "MH001-G8",
          "MH007-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV481",
        "examGroups": [
          "MH005-G6",
          "MH008-G5",
          "MH010-G5",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5",
          "MH009-G5"
        ]
      },
      {
        "studentId": "SV483",
        "examGroups": [
          "MH005-G6",
          "MH008-G6",
          "MH002-G6",
          "MH010-G5",
          "MH001-G9",
          "MH006-G6",
          "MH003-G5"
        ]
      },
      {
        "studentId": "SV485",
        "examGroups": [
          "MH005-G6",
          "MH008-G6",
          "MH002-G6",
          "MH010-G5",
          "MH001-G9",
          "MH007-G5",
          "MH004-G6"
        ]
      },
      {
        "studentId": "SV486",
        "examGroups": [
          "MH005-G6",
          "MH008-G6",
          "MH001-G9",
          "MH006-G6",
          "MH003-G6",
          "MH009-G6"
        ]
      },
      {
        "studentId": "SV488",
        "examGroups": [
          "MH005-G6",
          "MH008-G6",
          "MH002-G6",
          "MH001-G9",
          "MH006-G6",
          "MH003-G6"
        ]
      },
      {
        "studentId": "SV489",
        "examGroups": [
          "MH005-G6",
          "MH010-G5",
          "MH001-G9",
          "MH007-G5",
          "MH003-G6",
          "MH009-G6",
          "MH004-G6"
        ]
      },
      {
        "studentId": "SV491",
        "examGroups": [
          "MH005-G6",
          "MH008-G6",
          "MH002-G6",
          "MH010-G5",
          "MH001-G9",
          "MH007-G5",
          "MH003-G6"
        ]
      },
      {
        "studentId": "SV493",
        "examGroups": [
          "MH005-G6",
          "MH002-G6",
          "MH010-G5",
          "MH001-G9",
          "MH007-G5",
          "MH009-G6",
          "MH004-G6"
        ]
      },
      {
        "studentId": "SV494",
        "examGroups": [
          "MH005-G6",
          "MH008-G6",
          "MH002-G6",
          "MH001-G9",
          "MH006-G6",
          "MH003-G6"
        ]
      },
      {
        "studentId": "SV496",
        "examGroups": [
          "MH005-G6",
          "MH008-G6",
          "MH002-G6",
          "MH001-G9",
          "MH007-G5",
          "MH004-G6"
        ]
      },
      {
        "studentId": "SV497",
        "examGroups": [
          "MH005-G6",
          "MH008-G6",
          "MH010-G5",
          "MH001-G9",
          "MH006-G6",
          "MH003-G6",
          "MH009-G6"
        ]
      },
      {
        "studentId": "SV499",
        "examGroups": [
          "MH005-G6",
          "MH008-G6",
          "MH002-G6",
          "MH010-G5",
          "MH001-G9",
          "MH006-G6",
          "MH003-G6"
        ]
      },
      {
        "studentId": "SV009",
        "examGroups": [
          "MH008-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH003-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV014",
        "examGroups": [
          "MH008-G1",
          "MH010-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV017",
        "examGroups": [
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV029",
        "examGroups": [
          "MH008-G1",
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV042",
        "examGroups": [
          "MH008-G1",
          "MH002-G1",
          "MH001-G1",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV044",
        "examGroups": [
          "MH008-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV058",
        "examGroups": [
          "MH008-G1",
          "MH002-G1",
          "MH001-G1",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV060",
        "examGroups": [
          "MH008-G1",
          "MH001-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV074",
        "examGroups": [
          "MH008-G1",
          "MH002-G1",
          "MH001-G2",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV076",
        "examGroups": [
          "MH008-G1",
          "MH001-G2",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV090",
        "examGroups": [
          "MH008-G1",
          "MH002-G1",
          "MH001-G2",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV092",
        "examGroups": [
          "MH008-G1",
          "MH001-G2",
          "MH006-G2",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV106",
        "examGroups": [
          "MH008-G2",
          "MH002-G2",
          "MH001-G2",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV108",
        "examGroups": [
          "MH008-G2",
          "MH001-G2",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV122",
        "examGroups": [
          "MH008-G2",
          "MH002-G2",
          "MH001-G2",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV124",
        "examGroups": [
          "MH008-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV138",
        "examGroups": [
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV140",
        "examGroups": [
          "MH008-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV154",
        "examGroups": [
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV156",
        "examGroups": [
          "MH008-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV170",
        "examGroups": [
          "MH008-G2",
          "MH002-G2",
          "MH001-G3",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV172",
        "examGroups": [
          "MH008-G2",
          "MH001-G3",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV186",
        "examGroups": [
          "MH008-G2",
          "MH002-G2",
          "MH001-G4",
          "MH006-G3",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV188",
        "examGroups": [
          "MH008-G2",
          "MH001-G4",
          "MH006-G3",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV202",
        "examGroups": [
          "MH008-G3",
          "MH002-G3",
          "MH001-G4",
          "MH006-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV204",
        "examGroups": [
          "MH008-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV218",
        "examGroups": [
          "MH008-G3",
          "MH002-G3",
          "MH001-G4",
          "MH006-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV220",
        "examGroups": [
          "MH008-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV234",
        "examGroups": [
          "MH008-G3",
          "MH002-G3",
          "MH001-G4",
          "MH006-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV236",
        "examGroups": [
          "MH008-G3",
          "MH001-G4",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV250",
        "examGroups": [
          "MH008-G3",
          "MH002-G3",
          "MH001-G5",
          "MH006-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV252",
        "examGroups": [
          "MH008-G3",
          "MH001-G5",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV266",
        "examGroups": [
          "MH008-G3",
          "MH002-G3",
          "MH001-G5",
          "MH006-G4",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV268",
        "examGroups": [
          "MH008-G3",
          "MH001-G5",
          "MH006-G4",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV282",
        "examGroups": [
          "MH008-G3",
          "MH002-G3",
          "MH001-G5",
          "MH006-G4",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV284",
        "examGroups": [
          "MH008-G3",
          "MH001-G5",
          "MH006-G4",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV298",
        "examGroups": [
          "MH008-G4",
          "MH002-G4",
          "MH001-G5",
          "MH006-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV300",
        "examGroups": [
          "MH008-G4",
          "MH001-G5",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV314",
        "examGroups": [
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH006-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV316",
        "examGroups": [
          "MH008-G4",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV330",
        "examGroups": [
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH006-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV332",
        "examGroups": [
          "MH008-G4",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV346",
        "examGroups": [
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH006-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV348",
        "examGroups": [
          "MH008-G4",
          "MH001-G6",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV362",
        "examGroups": [
          "MH008-G4",
          "MH002-G4",
          "MH001-G6",
          "MH006-G5",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV364",
        "examGroups": [
          "MH008-G4",
          "MH001-G7",
          "MH006-G5",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV378",
        "examGroups": [
          "MH008-G4",
          "MH002-G4",
          "MH001-G7",
          "MH006-G5",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV380",
        "examGroups": [
          "MH008-G4",
          "MH001-G7",
          "MH006-G5",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV394",
        "examGroups": [
          "MH008-G5",
          "MH002-G5",
          "MH001-G7",
          "MH006-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV396",
        "examGroups": [
          "MH008-G5",
          "MH001-G7",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV410",
        "examGroups": [
          "MH008-G5",
          "MH002-G5",
          "MH001-G7",
          "MH006-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV412",
        "examGroups": [
          "MH008-G5",
          "MH001-G7",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV426",
        "examGroups": [
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH006-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV428",
        "examGroups": [
          "MH008-G5",
          "MH001-G8",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV442",
        "examGroups": [
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH006-G6",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV444",
        "examGroups": [
          "MH008-G5",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV458",
        "examGroups": [
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH006-G6",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV460",
        "examGroups": [
          "MH008-G5",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV474",
        "examGroups": [
          "MH008-G5",
          "MH002-G5",
          "MH001-G8",
          "MH006-G6",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV476",
        "examGroups": [
          "MH008-G5",
          "MH001-G8",
          "MH006-G6",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV490",
        "examGroups": [
          "MH008-G6",
          "MH002-G6",
          "MH001-G9",
          "MH006-G6",
          "MH009-G6",
          "MH004-G6"
        ]
      },
      {
        "studentId": "SV492",
        "examGroups": [
          "MH008-G6",
          "MH001-G9",
          "MH006-G6",
          "MH003-G6",
          "MH009-G6",
          "MH004-G6"
        ]
      },
      {
        "studentId": "SV003",
        "examGroups": [
          "MH002-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV005",
        "examGroups": [
          "MH002-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV008",
        "examGroups": [
          "MH002-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV011",
        "examGroups": [
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV026",
        "examGroups": [
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV034",
        "examGroups": [
          "MH002-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV039",
        "examGroups": [
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV050",
        "examGroups": [
          "MH002-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV055",
        "examGroups": [
          "MH002-G1",
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV066",
        "examGroups": [
          "MH002-G1",
          "MH001-G2",
          "MH007-G1",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV071",
        "examGroups": [
          "MH002-G1",
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV082",
        "examGroups": [
          "MH002-G1",
          "MH001-G2",
          "MH007-G1",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV087",
        "examGroups": [
          "MH002-G1",
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH006-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV098",
        "examGroups": [
          "MH002-G2",
          "MH001-G2",
          "MH007-G1",
          "MH006-G2",
          "MH009-G2",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV103",
        "examGroups": [
          "MH002-G2",
          "MH010-G1",
          "MH001-G2",
          "MH007-G2",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV114",
        "examGroups": [
          "MH002-G2",
          "MH001-G2",
          "MH007-G2",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV119",
        "examGroups": [
          "MH002-G2",
          "MH010-G2",
          "MH001-G2",
          "MH007-G2",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV130",
        "examGroups": [
          "MH002-G2",
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV135",
        "examGroups": [
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV146",
        "examGroups": [
          "MH002-G2",
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV151",
        "examGroups": [
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV162",
        "examGroups": [
          "MH002-G2",
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV167",
        "examGroups": [
          "MH002-G2",
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV178",
        "examGroups": [
          "MH002-G2",
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV183",
        "examGroups": [
          "MH002-G2",
          "MH010-G2",
          "MH001-G4",
          "MH007-G2",
          "MH006-G3",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV194",
        "examGroups": [
          "MH002-G3",
          "MH001-G4",
          "MH007-G2",
          "MH006-G3",
          "MH009-G3",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV199",
        "examGroups": [
          "MH002-G3",
          "MH010-G2",
          "MH001-G4",
          "MH007-G2",
          "MH006-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV210",
        "examGroups": [
          "MH002-G3",
          "MH001-G4",
          "MH007-G3",
          "MH006-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV215",
        "examGroups": [
          "MH002-G3",
          "MH010-G2",
          "MH001-G4",
          "MH007-G3",
          "MH006-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV226",
        "examGroups": [
          "MH002-G3",
          "MH001-G4",
          "MH007-G3",
          "MH006-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV231",
        "examGroups": [
          "MH002-G3",
          "MH010-G2",
          "MH001-G4",
          "MH007-G3",
          "MH006-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV242",
        "examGroups": [
          "MH002-G3",
          "MH001-G4",
          "MH007-G3",
          "MH006-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV247",
        "examGroups": [
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH006-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV258",
        "examGroups": [
          "MH002-G3",
          "MH001-G5",
          "MH007-G3",
          "MH006-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV263",
        "examGroups": [
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH006-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV274",
        "examGroups": [
          "MH002-G3",
          "MH001-G5",
          "MH007-G3",
          "MH006-G4",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV279",
        "examGroups": [
          "MH002-G3",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH006-G4",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV290",
        "examGroups": [
          "MH002-G4",
          "MH001-G5",
          "MH007-G3",
          "MH006-G4",
          "MH009-G4",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV295",
        "examGroups": [
          "MH002-G4",
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH006-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV306",
        "examGroups": [
          "MH002-G4",
          "MH001-G6",
          "MH007-G3",
          "MH006-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV311",
        "examGroups": [
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G3",
          "MH006-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV322",
        "examGroups": [
          "MH002-G4",
          "MH001-G6",
          "MH007-G4",
          "MH006-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV327",
        "examGroups": [
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH006-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV338",
        "examGroups": [
          "MH002-G4",
          "MH001-G6",
          "MH007-G4",
          "MH006-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV343",
        "examGroups": [
          "MH002-G4",
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH006-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV354",
        "examGroups": [
          "MH002-G4",
          "MH001-G6",
          "MH007-G4",
          "MH006-G5",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV359",
        "examGroups": [
          "MH002-G4",
          "MH010-G4",
          "MH001-G6",
          "MH007-G4",
          "MH006-G5",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV370",
        "examGroups": [
          "MH002-G4",
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV375",
        "examGroups": [
          "MH002-G4",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV386",
        "examGroups": [
          "MH002-G5",
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH009-G5",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV391",
        "examGroups": [
          "MH002-G5",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV402",
        "examGroups": [
          "MH002-G5",
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV407",
        "examGroups": [
          "MH002-G5",
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV418",
        "examGroups": [
          "MH002-G5",
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV423",
        "examGroups": [
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH006-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV434",
        "examGroups": [
          "MH002-G5",
          "MH001-G8",
          "MH007-G5",
          "MH006-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV439",
        "examGroups": [
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH006-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV450",
        "examGroups": [
          "MH002-G5",
          "MH001-G8",
          "MH007-G5",
          "MH006-G6",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV455",
        "examGroups": [
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH006-G6",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV466",
        "examGroups": [
          "MH002-G5",
          "MH001-G8",
          "MH007-G5",
          "MH006-G6",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV471",
        "examGroups": [
          "MH002-G5",
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH006-G6",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV482",
        "examGroups": [
          "MH002-G6",
          "MH001-G8",
          "MH007-G5",
          "MH006-G6",
          "MH009-G6",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV487",
        "examGroups": [
          "MH002-G6",
          "MH010-G5",
          "MH001-G9",
          "MH007-G5",
          "MH006-G6",
          "MH009-G6",
          "MH004-G6"
        ]
      },
      {
        "studentId": "SV498",
        "examGroups": [
          "MH002-G6",
          "MH001-G9",
          "MH007-G5",
          "MH006-G6",
          "MH009-G6",
          "MH004-G6"
        ]
      },
      {
        "studentId": "SV016",
        "examGroups": [
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1"
        ]
      },
      {
        "studentId": "SV031",
        "examGroups": [
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV047",
        "examGroups": [
          "MH010-G1",
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV063",
        "examGroups": [
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV079",
        "examGroups": [
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV095",
        "examGroups": [
          "MH010-G1",
          "MH001-G2",
          "MH007-G1",
          "MH006-G2",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV111",
        "examGroups": [
          "MH010-G1",
          "MH001-G2",
          "MH007-G2",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV127",
        "examGroups": [
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV143",
        "examGroups": [
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV159",
        "examGroups": [
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV175",
        "examGroups": [
          "MH010-G2",
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV191",
        "examGroups": [
          "MH010-G2",
          "MH001-G4",
          "MH007-G2",
          "MH006-G3",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV207",
        "examGroups": [
          "MH010-G2",
          "MH001-G4",
          "MH007-G2",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV223",
        "examGroups": [
          "MH010-G2",
          "MH001-G4",
          "MH007-G3",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV239",
        "examGroups": [
          "MH010-G3",
          "MH001-G4",
          "MH007-G3",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV255",
        "examGroups": [
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV271",
        "examGroups": [
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH006-G4",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV287",
        "examGroups": [
          "MH010-G3",
          "MH001-G5",
          "MH007-G3",
          "MH006-G4",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV303",
        "examGroups": [
          "MH010-G3",
          "MH001-G6",
          "MH007-G3",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV319",
        "examGroups": [
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV335",
        "examGroups": [
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV351",
        "examGroups": [
          "MH010-G3",
          "MH001-G6",
          "MH007-G4",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV367",
        "examGroups": [
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV383",
        "examGroups": [
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV399",
        "examGroups": [
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV415",
        "examGroups": [
          "MH010-G4",
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV431",
        "examGroups": [
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV447",
        "examGroups": [
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH006-G6",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV463",
        "examGroups": [
          "MH010-G4",
          "MH001-G8",
          "MH007-G5",
          "MH006-G6",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV479",
        "examGroups": [
          "MH010-G5",
          "MH001-G8",
          "MH007-G5",
          "MH006-G6",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV495",
        "examGroups": [
          "MH010-G5",
          "MH001-G9",
          "MH007-G5",
          "MH006-G6",
          "MH003-G6",
          "MH009-G6",
          "MH004-G6"
        ]
      },
      {
        "studentId": "SV023",
        "examGroups": [
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV036",
        "examGroups": [
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV052",
        "examGroups": [
          "MH001-G1",
          "MH007-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV068",
        "examGroups": [
          "MH001-G2",
          "MH007-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV084",
        "examGroups": [
          "MH001-G2",
          "MH007-G1",
          "MH006-G1",
          "MH003-G1",
          "MH009-G1",
          "MH004-G1"
        ]
      },
      {
        "studentId": "SV100",
        "examGroups": [
          "MH001-G2",
          "MH007-G1",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV116",
        "examGroups": [
          "MH001-G2",
          "MH007-G2",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV132",
        "examGroups": [
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV148",
        "examGroups": [
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV164",
        "examGroups": [
          "MH001-G3",
          "MH007-G2",
          "MH006-G2",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV180",
        "examGroups": [
          "MH001-G3",
          "MH007-G2",
          "MH006-G3",
          "MH003-G2",
          "MH009-G2",
          "MH004-G2"
        ]
      },
      {
        "studentId": "SV196",
        "examGroups": [
          "MH001-G4",
          "MH007-G2",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV212",
        "examGroups": [
          "MH001-G4",
          "MH007-G3",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV228",
        "examGroups": [
          "MH001-G4",
          "MH007-G3",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV244",
        "examGroups": [
          "MH001-G5",
          "MH007-G3",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV260",
        "examGroups": [
          "MH001-G5",
          "MH007-G3",
          "MH006-G3",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV276",
        "examGroups": [
          "MH001-G5",
          "MH007-G3",
          "MH006-G4",
          "MH003-G3",
          "MH009-G3",
          "MH004-G3"
        ]
      },
      {
        "studentId": "SV292",
        "examGroups": [
          "MH001-G5",
          "MH007-G3",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV308",
        "examGroups": [
          "MH001-G6",
          "MH007-G3",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV324",
        "examGroups": [
          "MH001-G6",
          "MH007-G4",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV340",
        "examGroups": [
          "MH001-G6",
          "MH007-G4",
          "MH006-G4",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV356",
        "examGroups": [
          "MH001-G6",
          "MH007-G4",
          "MH006-G5",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV372",
        "examGroups": [
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH003-G4",
          "MH009-G4",
          "MH004-G4"
        ]
      },
      {
        "studentId": "SV388",
        "examGroups": [
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV404",
        "examGroups": [
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV420",
        "examGroups": [
          "MH001-G7",
          "MH007-G4",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV436",
        "examGroups": [
          "MH001-G8",
          "MH007-G5",
          "MH006-G5",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV452",
        "examGroups": [
          "MH001-G8",
          "MH007-G5",
          "MH006-G6",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV468",
        "examGroups": [
          "MH001-G8",
          "MH007-G5",
          "MH006-G6",
          "MH003-G5",
          "MH009-G5",
          "MH004-G5"
        ]
      },
      {
        "studentId": "SV484",
        "examGroups": [
          "MH001-G9",
          "MH007-G5",
          "MH006-G6",
          "MH003-G6",
          "MH009-G6",
          "MH004-G6"
        ]
      },
      {
        "studentId": "SV500",
        "examGroups": [
          "MH001-G9",
          "MH007-G5",
          "MH006-G6",
          "MH003-G6",
          "MH009-G6",
          "MH004-G6"
        ]
      }
    ],
    "proctors": [
    { "proctorId": "GV001" },
    { "proctorId": "GV002" },
    { "proctorId": "GV003" },
    { "proctorId": "GV004" },
    { "proctorId": "GV005" },
    { "proctorId": "GV006" },
    { "proctorId": "GV007" },
    { "proctorId": "GV008" }
  ],
   "rooms": [
    { "roomId": "P101", "capacity": 55, "location": "D9" },
    { "roomId": "P102", "capacity": 40, "location": "A3" },
    { "roomId": "P103", "capacity": 60, "location": "B1" },
    { "roomId": "P104", "capacity": 45, "location": "C5" }
  ],
    "startDate": "2025-05-01",
  "endDate": "2025-05-31",
  "holidays": [
    "2025-05-01",
    "2025-05-15"
  ],
  "constraints": {
    "maxExamsPerStudentPerDay": 2,
    "avoidInterLocationTravel": true,
    "idealMinDaysBetweenExams": 1,
    "idealMaxDaysBetweenExams": 5
  }
  }`;
export function ScheduleGenerator() {
  const [jsonData, setJsonData] = useState(initialJsonData);
  const [scheduleData, setScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State mới để quản lý tuần hiện tại
  // `weekStartsOn: 1` nghĩa là tuần bắt đầu vào Thứ 2
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const handleGenerateSchedule = async () => {
    setIsLoading(true);
    setError(null);
    setScheduleData(null);
    try {
      const parsedData = JSON.parse(jsonData);

      // Tự động nhảy đến tuần đầu tiên của kỳ thi
      if (parsedData.startDate) {
        setCurrentWeekStart(
          startOfWeek(new Date(parsedData.startDate), { weekStartsOn: 1 })
        );
      }

      const response = await fetch(
        "http://localhost:3000/scheduling/generate-advanced",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedData),
        }
      );

      const result = await response.json(); // API mới trả về { data: {...} }

      if (!response.ok) {
        throw new Error(
          result.message ||
            `Lỗi từ server: ${response.status} ${response.statusText}`
        );
      }

      const data = result.data ? result.data : result; // Hỗ trợ cả 2 kiểu response

      if (!data.timetable) {
        throw new Error("Định dạng dữ liệu trả về không hợp lệ.");
      }

      setScheduleData(data);
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Dữ liệu JSON đầu vào không hợp lệ. Vui lòng kiểm tra lại.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm điều hướng tuần
  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  };
  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => subDays(prev, 7));
  };

  // Tạo mảng 6 ngày (T2-T7) cho tuần hiện tại
  const weekDays = Array.from({ length: 6 }).map((_, i) =>
    addDays(currentWeekStart, i)
  );

  // Lấy thông tin từ JSON đầu vào (để hiển thị stats)
  const allExamGroups = scheduleData ? JSON.parse(jsonData).examGroups : [];
  const allRooms = scheduleData ? JSON.parse(jsonData).rooms : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Xếp Lịch Thi Tự Động
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Hệ thống xếp lịch thi thông minh với thuật toán tối ưu
            </p>
          </div>
        </div>
      </div>

      {/* Input Card */}
      <Card className="mb-6 shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-purple-600" />
            Dữ liệu đầu vào
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <label
              htmlFor="jsonData"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3"
            >
              <Sparkles className="h-4 w-4 text-purple-500" />
              Nhập dữ liệu JSON (Ngày thi, Nhóm thi, Phòng, Giám thị...)
            </label>
            <Textarea
              id="jsonData"
              rows={15}
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-mono
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                transition-all duration-200 shadow-sm hover:shadow-md"
              placeholder="Dán dữ liệu JSON của bạn vào đây..."
            />
          </div>
          <Button
            onClick={handleGenerateSchedule}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 
              hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg
              shadow-lg hover:shadow-xl transition-all duration-200 
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Đang xử lý thuật toán...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Tạo Lịch Thi Tự Động</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Thông báo lỗi */}
      {error && (
        <div className="relative w-full rounded-lg border-2 border-red-200 bg-red-50 px-5 py-4 text-sm mb-6 shadow-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="font-semibold text-red-900 mb-1">
                Có lỗi xảy ra!
              </h5>
              <div className="text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* --- Phần Kết Quả --- */}
      {scheduleData && scheduleData.timetable && (
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <span className="text-xl">Kết quả Lịch thi</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={scheduleData.isOptimal ? "default" : "secondary"}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-800 border-blue-200"
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Fitness: {scheduleData.fitness}
                </Badge>
                {scheduleData.isOptimal ? (
                  <Badge className="px-3 py-1 text-sm bg-green-100 text-green-800 border-green-200">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Tối ưu
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="px-3 py-1 text-sm">
                    Chưa tối ưu
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-700 font-medium mb-1">
                  Số ngày có thi
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {scheduleData.timetable.length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <p className="text-sm text-purple-700 font-medium mb-1">
                  Số phòng thi
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {allRooms.length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-700 font-medium mb-1">
                  Tổng số lịch thi
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {scheduleData.timetable.reduce(
                    (acc, day) =>
                      acc + day.morning.length + day.afternoon.length,
                    0
                  )}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <p className="text-sm text-orange-700 font-medium mb-1">
                  Nhóm thi
                </p>
                <p className="text-2xl font-bold text-orange-900">
                  {allExamGroups.length}
                </p>
              </div>
            </div>

            {/* Thanh điều hướng tuần */}
            <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg border">
              <Button variant="outline" onClick={handlePrevWeek}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Tuần trước
              </Button>
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                Tuần: {format(weekDays[0], "dd/MM")} -{" "}
                {format(weekDays[5], "dd/MM/yyyy")}
              </h3>
              <Button variant="outline" onClick={handleNextWeek}>
                Tuần sau
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Giao diện Lịch Tuần */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 lg:gap-4">
              {weekDays.map((date) => {
                // Tìm dữ liệu lịch thi cho ngày này
                const dateString = format(date, "yyyy-MM-dd");
                const dayData = scheduleData.timetable.find(
                  (d) => d.date === dateString
                );

                const isToday = isSameDay(date, new Date());

                return (
                  <div
                    key={date.toISOString()}
                    className={`rounded-lg bg-white border border-gray-200 min-h-[300px] shadow-sm ${
                      isToday ? "border-2 border-blue-500" : ""
                    }`}
                  >
                    {/* Header của cột ngày */}
                    <div
                      className={`p-3 text-center border-b ${
                        isToday ? "bg-blue-50" : "bg-gray-50"
                      }`}
                    >
                      <p
                        className={`font-bold ${
                          isToday ? "text-blue-700" : "text-gray-800"
                        }`}
                      >
                        {format(date, "EEEE", { locale: vi })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(date, "dd/MM")}
                      </p>
                    </div>

                    {/* Nội dung các ca thi */}
                    <div className="p-2 space-y-3">
                      {/* Ca Sáng */}
                      <div>
                        <h4 className="text-xs font-semibold text-orange-600 mb-2 pl-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> SÁNG
                        </h4>
                        <div className="space-y-2">
                          {dayData && dayData.morning.length > 0 ? (
                            dayData.morning.map((exam) => (
                              <ExamCard key={exam.examGroup} exam={exam} />
                            ))
                          ) : (
                            <p className="text-xs text-gray-400 px-1 pt-2 italic text-center">
                              -- Trống --
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Ca Chiều */}
                      <div className="pt-2 border-t border-gray-100">
                        <h4 className="text-xs font-semibold text-indigo-600 mb-2 pl-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> CHIỀU
                        </h4>
                        <div className="space-y-2">
                          {dayData && dayData.afternoon.length > 0 ? (
                            dayData.afternoon.map((exam) => (
                              <ExamCard key={exam.examGroup} exam={exam} />
                            ))
                          ) : (
                            <p className="text-xs text-gray-400 px-1 pt-2 italic text-center">
                              -- Trống --
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
