import clsx from "clsx";
import React, { HTMLAttributes } from "react";

const Card = (props: HTMLAttributes<HTMLInputElement>) => {
	const { className, ...rest } = props;
	return (
		<div
			className={clsx(
				"rounded-md border border-gray-200 bg-white p-4 shadow-sm",
				className,
			)}
			{...rest}
		/>
	);
};

export default Card;
