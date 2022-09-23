import { createStyles } from "@mantine/core";

export default createStyles((theme, _params, getRef) => {
  const scaled: any = getRef("scaled");

  return {
    card: {
      position: "relative",
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
      border: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.gray[2]
      }`,

      [`&:hover .${scaled}`]: {
        transform: "scale(1.04)",
      },
    },
    scaled: {
      ref: scaled,
      flexGrow: 1,
      transition: "transform 500ms ease",
    },
  };
});
