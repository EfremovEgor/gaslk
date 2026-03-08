import React from "react";
import Navbar from "@components/Navbar";
import UpperNavbar from "../components/UpperNavbar";
const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="min-h-screen pb-20 flex flex-col">
			<UpperNavbar />
			<main className="grow px-2">{children}</main>
			<Navbar />
		</div>
	);
};

export default Layout;
