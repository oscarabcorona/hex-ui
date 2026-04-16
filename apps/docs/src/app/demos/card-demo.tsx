import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../../components/ui";

export function CardDemo() {
	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle>Create project</CardTitle>
				<CardDescription>Deploy your new project in one click.</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-sm">Configure your project settings and deploy instantly.</p>
			</CardContent>
			<CardFooter>
				<Button>Deploy</Button>
			</CardFooter>
		</Card>
	);
}
