import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { getCurrentUser } from "@lib/auth/auth";
import { logout } from "@lib/auth/actions";

const UpperNavbar = async () => {
	const user = await getCurrentUser();

	return (
		<div className="p-2 flex flex-row justify-between">
			<Link href={"/"} className="flex flex-row gap-1 items-center">
				<Image
					alt=""
					width="32"
					height="32"
					src={"/favicon.png"}
				></Image>
				<p className="text-xl text-accent-blue tracking-tight font-bold">
					РОСАВТОНОМГАЗ
				</p>
			</Link>
			{user && (
				<div className="flex flex-row gap-2 items-center">
					<p className="text-sm font-bold">
						{user.lastName} {user.firstName} <br />{" "}
						{user.middleName}
					</p>
					<form action={logout}>
						<button type="submit">
							<Icon
								className="text-2xl"
								icon="mingcute:exit-line"
							/>
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default UpperNavbar;
