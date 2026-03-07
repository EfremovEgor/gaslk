import React from "react";
import Navbar from "@components/Navbar";
const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="min-h-screen pb-20 flex flex-col">
			<main className="flex-grow">{children}</main>
			<Navbar />
		</div>
	);
};

export default Layout;
