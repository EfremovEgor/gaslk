"use client";

import React, { useState, useEffect } from "react";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import { getUserData } from "../../account/actions";
import Select from "@components/ui/Select";

const GAS_PRICE_PER_LITER = 50;

interface Address {
	id: string;
	value: string;
}

interface FormData {
	gasQuantity: string;
	addressId: string;
	deliveryDate: string;
	contactFirstName: string;
	contactPhone: string;
	newAddress: string;
}

interface Address {
	id: string;
	value: string;
}

export default function CreateOrderPage() {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [useNewAddress, setUseNewAddress] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		gasQuantity: "",
		addressId: "",
		deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0],
		contactFirstName: "",
		contactPhone: "",
		newAddress: "",
	});
	const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
	const [userData, setUserData] = useState<{
		firstName: string;
		phoneNumber: string;
	} | null>(null);

	useEffect(() => {
		const fetchAddresses = async () => {
			try {
				const data = await getUserData();
				setAddresses(
					data.addresses.map((a) => ({
						id: a.id,
						value: a.address,
					})),
				);
				setUserData({
					firstName: data.firstName,
					phoneNumber: data.phoneNumber,
				});
				setFormData((prev) => ({
					...prev,
					contactFirstName: data.firstName,
					contactPhone: data.phoneNumber,
				}));
			} catch (err: unknown) {
				setError(
					"Ошибка при загрузке данных. Пожалуйста, войдите в систему.",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchAddresses();
	}, []);

	useEffect(() => {
		const quantity = parseFloat(formData.gasQuantity);
		if (!isNaN(quantity) && quantity > 0) {
			setCalculatedPrice(quantity * GAS_PRICE_PER_LITER);
		} else {
			setCalculatedPrice(0);
		}
	}, [formData.gasQuantity]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess(false);

		if (!formData.addressId && !formData.newAddress) {
			setError("Пожалуйста, выберите адрес доставки или введите новый");
			return;
		}

		if (useNewAddress && !formData.newAddress.trim()) {
			setError("Пожалуйста, введите новый адрес доставки");
			return;
		}

		if (!formData.deliveryDate) {
			setError("Пожалуйста, выберите дату доставки");
			return;
		}

		if (!formData.gasQuantity || parseFloat(formData.gasQuantity) <= 0) {
			setError("Пожалуйста, укажите количество газа");
			return;
		}

		if (!formData.contactFirstName?.trim()) {
			setError("Пожалуйста, укажите имя контактного лица");
			return;
		}

		if (!formData.contactPhone?.trim()) {
			setError("Пожалуйста, укажите номер телефона контактного лица");
			return;
		}

		try {
			const response = await fetch("/api/orders/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					gasQuantity: parseFloat(formData.gasQuantity),
					addressId: useNewAddress ? undefined : formData.addressId,
					newAddress: useNewAddress ? formData.newAddress : undefined,
					deliveryDate: formData.deliveryDate,
					totalPrice: calculatedPrice,
					contactFirstName: formData.contactFirstName,
					contactPhone: formData.contactPhone,
				}),
			});

			if (response.ok) {
				setSuccess(true);
				setFormData({
					gasQuantity: "",
					addressId: "",
					deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
						.toISOString()
						.split("T")[0],
					contactFirstName: userData?.firstName || "",
					contactPhone: userData?.phoneNumber || "",
					newAddress: "",
				});
				setUseNewAddress(false);
				setCalculatedPrice(0);
			} else {
				const data = await response.json();
				setError(data.error || "Ошибка при создании заказа");
			}
		} catch (err: unknown) {
			setError("Ошибка при отправке запроса");
		}
	};

	const handleInputChange = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	if (loading) {
		return (
			<div className="container mx-auto">
				<h1 className="text-3xl font-bold">Новый заказ</h1>
				<p className="mt-4">Загрузка...</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto">
			<h1 className="text-3xl font-bold">Новый заказ</h1>
			<form onSubmit={handleSubmit} className="mt-6 max-w-md">
				{error && (
					<div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
						{error}
					</div>
				)}
				{success && (
					<div className="mb-4 rounded-md bg-green-50 p-4 text-green-700">
						Заказ успешно создан!
					</div>
				)}

				<div className="mb-4">
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Количество газа (литры)*
					</label>
					<Input
						type="number"
						min="0.1"
						step="0.1"
						value={formData.gasQuantity}
						onChange={(e) =>
							handleInputChange("gasQuantity", e.target.value)
						}
						placeholder="Введите количество в литрах"
						required
					/>
					<div className="mt-2 rounded-md bg-accent-blue/5 p-3 text-accent-blue">
						<strong>Итого: {calculatedPrice.toFixed(2)} ₽</strong>
					</div>
				</div>

				<div className="mb-4">
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Адрес доставки*
					</label>
					<div className="flex items-center gap-2 mb-3">
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="radio"
								name="addressType"
								checked={!useNewAddress}
								onChange={() => {
									setUseNewAddress(false);
									setFormData((prev) => ({
										...prev,
										newAddress: "",
									}));
								}}
								className="h-4 w-4 text-accent-blue"
							/>
							<span className="text-sm">Выбрать из списка</span>
						</label>
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="radio"
								name="addressType"
								checked={useNewAddress}
								onChange={() => setUseNewAddress(true)}
								className="h-4 w-4 text-accent-blue"
							/>
							<span className="text-sm">Ввести новый</span>
						</label>
					</div>
					{useNewAddress ? (
						<Input
							type="text"
							value={formData.newAddress}
							onChange={(e) =>
								handleInputChange("newAddress", e.target.value)
							}
							placeholder="Введите новый адрес доставки"
							required={useNewAddress}
							className="w-full"
						/>
					) : (
						<Select
							className="w-full"
							value={formData.addressId}
							onChange={(e) =>
								handleInputChange("addressId", e.target.value)
							}
							required={!useNewAddress}
						>
							<option value="">Выберите адрес доставки</option>
							{addresses.map((addr) => (
								<option key={addr.id} value={addr.id}>
									{addr.value}
								</option>
							))}
						</Select>
					)}
				</div>

				<div className="mb-6">
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Желаемая дата доставки*
					</label>
					<Input
						type="date"
						min={
							new Date(Date.now() + 24 * 60 * 60 * 1000)
								.toISOString()
								.split("T")[0]
						}
						value={formData.deliveryDate}
						onChange={(e) =>
							handleInputChange("deliveryDate", e.target.value)
						}
						required
					/>
					<p className="mt-1 text-xs text-gray-500">
						Доступны даты начиная с завтрашнего дня
					</p>
				</div>

				<div className="mb-4 border-t pt-4">
					<h2 className="mb-4 text-lg font-semibold text-gray-800">
						Контактное лицо
					</h2>
					<div className="grid grid-cols-2 gap-4">
						<div className="mb-4">
							<label className="mb-2 block text-sm font-medium text-gray-700">
								Имя*
							</label>
							<Input
								type="text"
								value={formData.contactFirstName}
								onChange={(e) =>
									handleInputChange(
										"contactFirstName",
										e.target.value,
									)
								}
								placeholder="Введите имя"
								required
							/>
							{userData && (
								<button
									type="button"
									onClick={() =>
										handleInputChange(
											"contactFirstName",
											userData.firstName,
										)
									}
									className="mt-1 text-xs text-accent-blue hover:underline"
								>
									Подставить из профиля
								</button>
							)}
						</div>
						<div className="mb-4">
							<label className="mb-2 block text-sm font-medium text-gray-700">
								Номер телефона*
							</label>
							<Input
								type="tel"
								value={formData.contactPhone}
								onChange={(e) =>
									handleInputChange(
										"contactPhone",
										e.target.value,
									)
								}
								placeholder="+7 (999) 000-00-00"
								required
							/>
							{userData && (
								<button
									type="button"
									onClick={() =>
										handleInputChange(
											"contactPhone",
											userData.phoneNumber,
										)
									}
									className="mt-1 text-xs text-accent-blue hover:underline"
								>
									Подставить из профиля
								</button>
							)}
						</div>
					</div>
					<p className="mt-2 text-xs text-gray-500">
						* Обязательные поля для заполнения
					</p>
				</div>

				<Button type="submit" className="w-full">
					Создать заказ
				</Button>
			</form>
		</div>
	);
}
