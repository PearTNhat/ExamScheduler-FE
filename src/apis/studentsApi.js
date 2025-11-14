import { http } from "~/utils/http";

const apiGetStudents = async ({ accessToken, params }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params,
        };
        const { data } = await http.get("/students", config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};


const apiExamStudent = async ({ accessToken, examSessionId }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const { data } = await http.get(`/students/student/${examSessionId}`, config);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiCreateStudent = async ({ body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        console.log(body)
        const response = await http.post("/students", body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiUpdateStudent = async ({ id, body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.put(`/students/${id}`, body, config);
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

const apiDeleteStudent = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const res = await http.delete(`/students/${id}`, config);
        return res.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
        throw new Error(error.message);
    }
};

export { apiGetStudents, apiCreateStudent, apiUpdateStudent, apiDeleteStudent, apiExamStudent };
