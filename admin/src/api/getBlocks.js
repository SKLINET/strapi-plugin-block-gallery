import { axiosInstance } from "../utils";

const getBlocks = async () => {
    const data = await axiosInstance.get(`/block-gallery/blocks`);
    return data.data;
};

export default getBlocks;
