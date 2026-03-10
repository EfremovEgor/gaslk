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
}

export default function CreateOrderPage() {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		gasQuantity: "",
		addressId: "",
		deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0],
	});
	const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

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

		if (!formData.addressId) {
			setError("Пожалуйста, выберите адрес доставки");
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

		try {
			const response = await fetch("/api/orders/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					gasQuantity: parseFloat(formData.gasQuantity),
					addressId: formData.addressId,
					deliveryDate: formData.deliveryDate,
					totalPrice: calculatedPrice,
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
				});
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
						Количество газа (литры)
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
						Адрес доставки
					</label>
					<Select
						className="w-full"
						value={formData.addressId}
						onChange={(e) =>
							handleInputChange("addressId", e.target.value)
						}
						required
					>
						<option value="">Выберите адрес доставки</option>
						{addresses.map((addr) => (
							<option key={addr.id} value={addr.id}>
								{addr.value}
							</option>
						))}
					</Select>
				</div>

				<div className="mb-6">
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Желаемая дата доставки
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

				<Button type="submit" className="w-full">
					Создать заказ
				</Button>
			</form>
		</div>
	);
}
