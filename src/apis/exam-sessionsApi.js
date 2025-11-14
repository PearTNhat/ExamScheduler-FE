import { http } from "~/utils/http";

const apiGetExamSessions = async ({ accessToken }) => {
    try {
        const { data } = await http.get("/exam-sessions", {
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

const apiCreateExamSession = async ({ body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.post("/exam-sessions", body, config);
        return { code: 201, data: response.data };
    } catch (error) {
        if (error.response && error.response.data) {
            return { code: error.response.status, ...error.response.data };
        }
        throw new Error(error.message);
    }
};

const apiUpdateExamSession = async ({ id, body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.put(`/exam-sessions/${id}`, body, config);
        return { code: 200, data: response.data };
    } catch (error) {
        if (error.response && error.response.data) {
            return { code: error.response.status, ...error.response.data };
        }
        throw new Error(error.message);
    }
};

const apiDeleteExamSession = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const res = await http.delete(`/exam-sessions/${id}`, config);
        return { code: 200, data: res.data };
    } catch (error) {
        if (error.response && error.response.data) {
            return { code: error.response.status, ...error.response.data };
        }
        throw new Error(error.message);
    }
};

export {
    apiGetExamSessions,
    apiCreateExamSession,
    apiUpdateExamSession,
    apiDeleteExamSession,
};
