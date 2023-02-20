import axios from 'axios';

class UploadService {
    /**
     * @private
     * @param {string} token
     */
    constructor(token) {
        this.axiosInstance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_FILE_UPLOAD_URL,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    }

    async upload(data) {
        const users = await this._base('post', '/upload', data);
        return users;
    }

    async _base(method, endPointPath, data) {
        try {
            const uri = endPointPath;
            const axiosPromise = this.axiosInstance[method](uri, data);
            const response = await axiosPromise;

            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default UploadService;
