import React from "react";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
    return (
        <>
            <header></header>
            <main>{children}</main>
        </>
    );
};

export default Layout;
