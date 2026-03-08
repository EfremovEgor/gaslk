import { getUserData } from "./actions";
import Form from "./components/Form";

export default async function AccountPage() {
	const userData = await getUserData();
	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-4">Аккаунт</h1>
			<Form initialData={userData} />
		</div>
	);
}
