import { http } from "~/utils/http";

const apiGetExamSlots = async ({ accessToken, params }) => {
    try {
        const { data } = await http.get("/exam-slots", {
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

const apiGetExamSlotById = async ({ accessToken, id }) => {
    try {
        const { data } = await http.get(`/exam-slots/${id}`, {
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

const apiCreateExamSlot = async ({ body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.post("/exam-slots", body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiUpdateExamSlot = async ({ id, body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.put(`/exam-slots/${id}`, body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiDeleteExamSlot = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const res = await http.delete(`/exam-slots/${id}`, config);
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

export {
    apiGetExamSlots,
    apiGetExamSlotById,
    apiCreateExamSlot,
    apiUpdateExamSlot,
    apiDeleteExamSlot,
};
