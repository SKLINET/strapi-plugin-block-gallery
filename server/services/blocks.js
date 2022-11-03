"use strict";

module.exports = ({ strapi }) => {
    return {
        async getBlocks() {
            let dbBlocks = await strapi.db
                .query("plugin::block-gallery.block")
                .findMany({ populate: { image: "*" } }); // Blocks fetched from Blocks content-type (database)
            const components = strapi.components; // All Strapi components
            const strapiComponentsArr = [];

            // Create array of Block components from Strapi
            for (const [key, value] of Object.entries(components)) {
                if (key.includes("block")) {
                    strapiComponentsArr.push({
                        displayName: value.info.displayName,
                        blockName: value.info.name || value.collectionName,
                    });
                }
            }

            // Delete Blocks that aren't found in strapi.components
            for (const block of dbBlocks) {
                const dbB = strapiComponentsArr.find(
                    (component) => component.displayName === block.displayName
                );
                if (!dbB) {
                    await strapi.db
                        .query("plugin::block-gallery.block")
                        .delete({
                            where: { id: block.id },
                        });
                    console.log(
                        `Block-Gallery: Deleting item: ${block.displayName}, this item isn't found in strapi.components.`
                    );

                    dbBlocks = await strapi.db
                        .query("plugin::block-gallery.block")
                        .findMany({ populate: { image: "*" } });
                }
            }

            // Create Blocks that are found in strapi.components
            for (const block of strapiComponentsArr) {
                const dbB = dbBlocks.find(
                    (dbBlock) => dbBlock.displayName === block.displayName
                );
                if (!dbB) {
                    await strapi.db
                        .query("plugin::block-gallery.block")
                        .create({
                            data: {
                                blockName: block.blockName,
                                displayName: block.displayName,
                            },
                        });
                    console.log(
                        `Block-Gallery: Creating item: ${block.displayName}`
                    );

                    dbBlocks = await strapi.db
                        .query("plugin::block-gallery.block")
                        .findMany({ populate: { image: "*" } });
                }
            }
            const strapiLength = strapiComponentsArr.length;
            let dbLength = dbBlocks.length;

            if (dbLength !== strapiLength) {
                const updatedDbBlocks = await strapi.db
                    .query("plugin::block-gallery.block")
                    .findMany();
                dbLength = updatedDbBlocks.length;
            }

            return {
                blocks: dbBlocks,
                strapiBlocks: strapiLength,
                databaseBlocks: dbLength,
            };
        },
    };
};
