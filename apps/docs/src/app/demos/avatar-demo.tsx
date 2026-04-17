import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui";

/** Avatar demo: image with initials fallback + fallback-only avatar. */
export function AvatarDemo() {
	return (
		<div className="flex items-center gap-4">
			<Avatar>
				<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarFallback>OC</AvatarFallback>
			</Avatar>
			<Avatar className="h-14 w-14">
				<AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
				<AvatarFallback>V</AvatarFallback>
			</Avatar>
		</div>
	);
}
