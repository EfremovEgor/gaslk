import React, { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

const Variants = {
	primary:
		"inline-block cursor-pointer items-center justify-center rounded-xl border-[1.58px] border-accent-blue/20 bg-accent-blue font-medium text-white shadow-md transition-all",
	secondary:
		"inline-block cursor-pointer items-center justify-center rounded-xl border-[1.58px] border-accent-blue bg-transparent font-medium shadow-md transition-all",
};
const Sizes = {
	small: "px-3 py-2",
	base: "px-5 py-3",
	large: "px-6 py-4",
};
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: keyof typeof Variants;
	size?: keyof typeof Sizes;
}
const Button = ({
	variant = "primary",
	size = "base",
	className,
	...rest
}: ButtonProps) => {
	return (
		<button
			className={clsx(Variants[variant], Sizes[size], className)}
			{...rest}
		/>
	);
};

export default Button;
