import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "../../components/ui";

/** HoverCard demo: user profile preview on hovering a username button. */
export function HoverCardDemo() {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<Button variant="link">@shadcn</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-80">
				<div className="flex gap-4">
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
						<AvatarFallback>VC</AvatarFallback>
					</Avatar>
					<div className="space-y-1">
						<h4 className="text-sm font-semibold">@shadcn</h4>
						<p className="text-sm">Building UI components everyone can copy.</p>
						<div className="text-xs text-muted-foreground">Joined December 2021</div>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
