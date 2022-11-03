import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { LoadingIndicatorPage } from "@strapi/helper-plugin";
import { Stack } from "@strapi/design-system/Stack";
import { Grid } from "@strapi/design-system/Grid";
import { Flex } from "@strapi/design-system/Flex";
import { Box } from "@strapi/design-system/Box";
import {
    ModalLayout,
    ModalBody,
    ModalHeader,
} from "@strapi/design-system/ModalLayout";
import { Badge } from "@strapi/design-system/Badge";
import { Typography } from "@strapi/design-system/Typography";
import { Link } from "@strapi/design-system/Link";
import { useIntl } from "react-intl";
import { getTrad, axiosInstance } from "../../utils";

const ImageWrapper = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const Image = styled.image`
    height: 250px;
    width: 100%;
    background-image: url(${(props) => props.src});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
`;
const HomePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [blocks, setBlocks] = useState(null);
    const [strapiBlocks, setStrapiBlocks] = useState(null);
    const [databaseBlocks, setDatabaseBlocks] = useState(null);
    const [activeId, setActiveId] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const { formatMessage } = useIntl();

    useEffect(() => {
        const data = axiosInstance.get(`/block-gallery/blocks`);
        if (data) {
            data.then((res) => {
                setStrapiBlocks(res.data.strapiBlocks);
                setDatabaseBlocks(res.data.databaseBlocks);
                setBlocks(res.data.blocks);
            });
            if (blocks && strapiBlocks === databaseBlocks) {
                setIsLoading(false);
            } else {
                setIsLoading(true);
                const secondaryData = axiosInstance.get(
                    `/block-gallery/blocks`
                );
                secondaryData.then((res) => {
                    setStrapiBlocks(res.data.strapiBlocks);
                    setDatabaseBlocks(res.data.databaseBlocks);
                    setBlocks(res.data.blocks);
                });
                setIsLoading(false);
            }
        }
    }, [strapiBlocks, databaseBlocks]);

    return isLoading ? (
        <LoadingIndicatorPage />
    ) : (
        <Stack spacing={4} padding={3}>
            <Box paddingTop={4} paddingLeft={4}>
                <Typography variant={"alpha"}>
                    {formatMessage({
                        id: getTrad("Homepage.title"),
                        defaultMessage: "Blocks Gallery",
                    })}
                </Typography>
            </Box>
            <Box paddingTop={0} paddingLeft={4}>
                <Typography variant={"epsilon"}>
                    {formatMessage({
                        id: getTrad("Homepage.subTitle"),
                        defaultMessage: "Image preview of blocks.",
                    })}
                </Typography>
            </Box>
            {blocks && blocks.length > 0 && (
                <Grid gridCols={3} gap={6} padding={3}>
                    {blocks.map((item, i) => (
                        <Box
                            shadow={"filterShadow"}
                            background={"neutral0"}
                            padding={6}
                            hasRadius
                            key={`block-item-${i}`}
                        >
                            <Flex
                                direction={"column"}
                                alignItems={"start"}
                                shrink={10}
                            >
                                <Box>
                                    <Box paddingBottom={1}>
                                        <Badge marginRight={2}>
                                            {formatMessage({
                                                id: getTrad(
                                                    "Homepage.blockName"
                                                ),
                                                defaultMessage: "Block",
                                            })}
                                        </Badge>
                                        <Typography variant={"epsilon"}>
                                            {item.blockName}
                                        </Typography>
                                    </Box>
                                    <Box
                                        paddingBottom={item.externalUrl ? 1 : 4}
                                    >
                                        <Badge marginRight={2}>
                                            {formatMessage({
                                                id: getTrad(
                                                    "Homepage.blockDisplayName"
                                                ),
                                                defaultMessage: "Block name",
                                            })}
                                        </Badge>
                                        <Typography variant={"epsilon"}>
                                            {item.displayName}
                                        </Typography>
                                    </Box>
                                    {item.externalUrl && (
                                        <Box paddingBottom={4}>
                                            <Link
                                                href={item.externalUrl}
                                                isExternal
                                            >
                                                {formatMessage({
                                                    id: getTrad(
                                                        "Homepage.linkText"
                                                    ),
                                                    defaultMessage:
                                                        "External link: ",
                                                })}
                                            </Link>
                                        </Box>
                                    )}
                                </Box>
                                {item.image && item.image.url && (
                                    <>
                                        <ImageWrapper>
                                            <Image
                                                src={item.image.url}
                                                onClick={() => {
                                                    setActiveId(i);
                                                    setModalOpen(true);
                                                }}
                                            />
                                        </ImageWrapper>
                                        {modalOpen && activeId === i && (
                                            <ModalLayout
                                                onClose={() =>
                                                    setModalOpen(false)
                                                }
                                                labelledBy='title'
                                            >
                                                <ModalHeader>
                                                    <Typography
                                                        fontWeight='bold'
                                                        textColor='neutral800'
                                                        as='h2'
                                                        id='title'
                                                    >
                                                        {item.displayName}
                                                    </Typography>
                                                </ModalHeader>
                                                <ModalBody>
                                                    <img
                                                        src={item.image.url}
                                                        width={"100%"}
                                                        height={"100%"}
                                                    />
                                                </ModalBody>
                                            </ModalLayout>
                                        )}
                                    </>
                                )}
                            </Flex>
                        </Box>
                    ))}
                </Grid>
            )}
        </Stack>
    );
};

export default HomePage;
