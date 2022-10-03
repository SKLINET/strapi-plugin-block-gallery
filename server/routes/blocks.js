module.exports = {
    type: "admin",
    routes: [
        {
            method: "GET",
            path: "/blocks",
            handler: "blocks.getBlocks",
            config: {
                policies: [],
                auth: false,
            },
        },
    ],
};
