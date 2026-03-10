"use client";
import React, { useState } from "react";
import { updateUser } from "../actions";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import { Icon } from "@iconify/react";

interface Address {
	id: string;
	value: string;
}

interface UserData {
	firstName: string;
	lastName: string;
	middleName: string;
	phoneNumber: string;
	email: string;
	addresses: {
		address: string;
		id: string;
	}[];
}

const phonePattern = /^\+?[0-9\-\s]{7,20}$/;

const Form: React.FC<{ initialData: UserData }> = ({ initialData }) => {
	const [firstName, setFirstName] = useState(initialData.firstName);
	const [lastName, setLastName] = useState(initialData.lastName);
	const [middleName, setMiddleName] = useState(initialData.middleName);
	const [phone, setPhone] = useState(initialData.phoneNumber);
	const [email] = useState(initialData.email);
	const [password, setPassword] = useState("");
	const [addresses, setAddresses] = useState<Address[]>(
		initialData.addresses.map((a, idx) => ({ id: a.id, value: a.address })),
	);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleAddAddress = () => {
		setAddresses((prev) => [
			...prev,
			{ id: Date.now().toString(), value: "" },
		]);
	};

	const handleRemoveAddress = (id: string) => {
		setAddresses((prev) => prev.filter((a) => a.id !== id));
	};

	const handleAddressChange = (id: string, text: string) => {
		setAddresses((prev) =>
			prev.map((a) => (a.id === id ? { ...a, value: text } : a)),
		);
	};

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

		if (!firstName?.trim()) {
			setError("Имя не должно быть пустым");
			return;
		}
		if (!lastName?.trim()) {
			setError("Фамилия не должна быть пустой");
			return;
		}
		if (!phone || !phonePattern.test(phone)) {
			setError("Введите корректный номер телефона");
			return;
		}
		if (password && password.trim().length < 6) {
			setError("Пароль должен содержать минимум 6 символов");
			return;
		}

		const nonEmptyAddresses = addresses.filter((a) => a.value?.trim());
		if (nonEmptyAddresses.length === 0) {
			setError("Добавьте хотя бы один адрес");
			return;
		}

		setLoading(true);
		try {
			const formData = new FormData(e.currentTarget);
			await updateUser(formData);
		} catch (err: unknown) {
			const message =
				err instanceof Error ? err.message : "Update failed";
			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-xl mx-auto mt-4">
			<h2 className="text-2xl font-semibold mb-4">Изменение данных</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				{error && (
					<div className="rounded-md bg-red-50 p-4">
						<p className="text-sm font-medium text-red-800">
							{error}
						</p>
					</div>
				)}

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Имя
						</label>
						<Input
							name="firstName"
							type="text"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							className="mt-1"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Фамилия
						</label>
						<Input
							name="lastName"
							type="text"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							className="mt-1"
							required
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Отчество
					</label>
					<Input
						name="middleName"
						type="text"
						value={middleName}
						onChange={(e) => setMiddleName(e.target.value)}
						className="mt-1"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Номер телефона
					</label>
					<Input
						name="phone"
						type="tel"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						pattern="\+?[0-9\-\s]{7,20}"
						required
						className="mt-1"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Почта
					</label>
					<Input
						type="email"
						value={email}
						readOnly
						className="mt-1"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Пароль
					</label>
					<Input
						name="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="mt-1"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Адреса
					</label>
					{addresses.map((addr) => (
						<div key={addr.id} className="flex items-center mt-1">
							<Input
								name="addresses"
								type="text"
								value={addr.value}
								onChange={(e) =>
									handleAddressChange(addr.id, e.target.value)
								}
								className="flex-1"
							/>
							<button
								type="button"
								onClick={() => handleRemoveAddress(addr.id)}
								className="ml-2 text-red-600 hover:text-red-800"
							>
								<Icon icon="gg:trash" className="text-3xl" />
							</button>
						</div>
					))}
					<Button
						size="small"
						variant="secondary"
						type="button"
						onClick={handleAddAddress}
						className="mt-2 px-1 py-1"
					>
						+ Добавить адрес
					</Button>
				</div>

				<Button type="submit" disabled={loading} className="w-full">
					{loading ? "Сохранение..." : "Сохранить"}
				</Button>
			</form>
		</div>
	);
};

export default Form;
