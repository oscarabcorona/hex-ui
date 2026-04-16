"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui";

export function TabsDemo() {
	return (
		<Tabs defaultValue="account" className="w-full max-w-md">
			<TabsList>
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="password">Password</TabsTrigger>
				<TabsTrigger value="notifications">Notifications</TabsTrigger>
			</TabsList>
			<TabsContent value="account" className="p-4 text-sm">
				<p>Manage your account settings and preferences.</p>
			</TabsContent>
			<TabsContent value="password" className="p-4 text-sm">
				<p>Change your password and security settings.</p>
			</TabsContent>
			<TabsContent value="notifications" className="p-4 text-sm">
				<p>Configure notification preferences.</p>
			</TabsContent>
		</Tabs>
	);
}
