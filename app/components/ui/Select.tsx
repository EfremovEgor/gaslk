import React, { SelectHTMLAttributes } from "react";
import clsx from "clsx";

const Select = (props: SelectHTMLAttributes<HTMLSelectElement>) => {
	const { className, ...rest } = props;
	return (
		<select
			className={clsx(
				"block px-2 py-2 w-full rounded-md shadow-sm border-accent-blue border focus:ring-border-focus-blue active:ring-border-focus-blue",
				className,
			)}
			{...rest}
		/>
	);
};

export default Select;
