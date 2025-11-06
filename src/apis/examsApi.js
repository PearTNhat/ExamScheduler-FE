// src/api/exams.js
import { http } from "~/utils/http";

const apiGetExams = async ({ accessToken, params }) => {
    try {
        const { data } = await http.get("/exams", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params,
        });
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiViewTimetableExams = async ({ accessToken, params }) => {
    try {
        const { data } = await http.get("/exams/timetable/view", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params,
        });
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiGetExamById = async ({ accessToken, id }) => {
    try {
        const { data } = await http.get(`/exams/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiGetDetailExamById = async ({ accessToken, id }) => {
    try {
        const { data } = await http.get(`/exams/${id}/detail`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
}

const apiCreateExam = async ({ body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.post("/exams", body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiUpdateExam = async ({ id, body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.put(`/exams/${id}`, body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiDeleteExam = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const res = await http.delete(`/exams/${id}`, config);
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};
const apiGenerateExamSchedule = async ({ body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },

        };
        const res = await http.post(`/scheduling/generate-advanced`, body, config);
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
}

export {
    apiGetExams,
    apiGetExamById,
    apiCreateExam,
    apiUpdateExam,
    apiDeleteExam,
    apiGenerateExamSchedule,
    apiGetDetailExamById,
    apiViewTimetableExams,
};
