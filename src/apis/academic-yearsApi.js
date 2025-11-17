import { http } from "~/utils/http";

const apiGetAcademicYears = async ({ accessToken, params }) => {
    try {
        const { data } = await http.get("/academic-years", {
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

const apiCreateAcademicYear = async ({ body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.post("/academic-years", body, config);
        return { code: 201, data: response.data };
    } catch (error) {
        if (error.response && error.response.data) {
            return { code: error.response.status, ...error.response.data };
        }
        throw new Error(error.message);
    }
};

const apiUpdateAcademicYear = async ({ id, body, accessToken }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const response = await http.put(`/academic-years/${id}`, body, config);
        return { code: 200, data: response.data };
    } catch (error) {
        if (error.response && error.response.data) {
            return { code: error.response.status, ...error.response.data };
        }
        throw new Error(error.message);
    }
};

const apiDeleteAcademicYear = async ({ accessToken, id }) => {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        const res = await http.delete(`/academic-years/${id}`, config);
        return { code: 200, data: res.data };
    } catch (error) {
        if (error.response && error.response.data) {
            return { code: error.response.status, ...error.response.data };
        }
        throw new Error(error.message);
    }
};

export {
    apiGetAcademicYears,
    apiCreateAcademicYear,
    apiUpdateAcademicYear,
    apiDeleteAcademicYear,
};
