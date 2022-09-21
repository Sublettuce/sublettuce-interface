import {
    createStyles,
    Menu,
    Center,
    Header,
    Container,
    Group,
    Button,
    Burger,
    Divider,
    Autocomplete,
    Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IconChevronDown, IconSearch } from "@tabler/icons";
import Link from "next/link";
import { useState } from "react";

const HEADER_HEIGHT = 70;

const useStyles = createStyles((theme) => ({
    inner: {
        height: HEADER_HEIGHT,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    links: {
        [theme.fn.smallerThan("sm")]: {
            display: "none",
        },
    },

    burger: {
        [theme.fn.largerThan("sm")]: {
            display: "none",
        },
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: "8px 16px",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        fontSize: theme.fontSizes.md,
        fontWeight: 500,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
        },
    },
    linkLabel: {
        marginRight: 5,
    },
}));

interface HeaderActionProps {
    links: {
        link: string;
        label: string;
        links?: { link: string; label: string }[];
    }[];
}

export default function HeaderAction({ links }: HeaderActionProps) {
    const [value, setValue] = useState("");
    const data =
        value.trim().length > 0 &&
        !(value.endsWith(".") || value.endsWith(".eth"))
            ? ["eth"].map((provider) => `${value}.${provider}`)
            : [value];

    const { classes } = useStyles();
    const [opened, { toggle }] = useDisclosure(false);
    const items = links.map((link) => {
        const menuItems = link.links?.map((item) => (
            <Menu.Item key={item.link}>{item.label}</Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu
                    key={link.label}
                    trigger="hover"
                    exitTransitionDuration={0}
                >
                    <Menu.Target>
                        <Link href={link.link} className={classes.link}>
                            <Center>
                                <span className={classes.linkLabel}>
                                    {link.label}
                                </span>
                                <IconChevronDown size={12} stroke={1.5} />
                            </Center>
                        </Link>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <Link key={link.label} href={link.link}>
                <a className={classes.link}>{link.label}</a>
            </Link>
        );
    });

    return (
        <Header height={HEADER_HEIGHT} sx={{ borderBottom: 0 }}>
            <Container className={classes.inner} fluid>
                <Group className="mr-4">
                    <Burger
                        opened={opened}
                        onClick={toggle}
                        className={classes.burger}
                        size="sm"
                    />
                    <Link href="/">
                        <a className="no-underline text-inherit">
                            <Title order={1}>Sublet</Title>
                        </a>
                    </Link>
                </Group>
                <Autocomplete
                    value={value}
                    onChange={setValue}
                    placeholder="Search for domains"
                    data={data}
                    className="w-4/5 pl-10 pr-10"
                    icon={<IconSearch size={20} />}
                />
                <Group spacing={5} className={classes.links + " min-w-max"}>
                    {items}
                    <Divider
                        size="sm"
                        orientation="vertical"
                        className="mr-2 ml-2"
                    />
                    <ConnectButton chainStatus="icon" accountStatus="address" />
                </Group>
            </Container>
        </Header>
    );
}
