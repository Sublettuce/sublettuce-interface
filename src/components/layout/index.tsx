import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <>
      <header>
        <Navbar
          links={[
            { link: "/explore", label: "Explore" },
            { link: "/list", label: "List" },
          ]}
        />
      </header>
      <main>{children}</main>
    </>
  );
};

export default Layout;
