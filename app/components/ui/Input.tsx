import React, { InputHTMLAttributes } from "react";
import clsx from "clsx";

const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
	const { className, ...rest } = props;
	return (
		<input
			className={clsx(
				"block px-2 py-2 w-full rounded-md shadow-sm border-accent-blue border focus:ring-border-focus-blue active:ring-border-focus-blue",
				className,
			)}
			{...rest}
		/>
	);
};

export default Input;
