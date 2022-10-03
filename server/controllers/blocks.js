"use strict";

module.exports = {
    getBlocks: async (ctx) => {
        const config = await strapi
            .plugin("block-gallery")
            .service("blocks")
            .getBlocks();
        ctx.send(config);
    },
};
