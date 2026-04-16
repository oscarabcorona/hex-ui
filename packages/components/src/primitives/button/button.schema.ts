import type { ComponentSchemaDefinition } from "@hex-ui/registry";

export const buttonSchema: ComponentSchemaDefinition = {
	name: "button",
	displayName: "Button",
	description:
		"A versatile button component with multiple variants, sizes, and states. Supports icons, loading state, and composition via asChild.",
	category: "primitive",
	subcategory: "actions",
	props: [
		{
			name: "variant",
			type: "enum",
			required: false,
			default: "default",
			description: "The visual style of the button",
			enumValues: ["default", "destructive", "outline", "secondary", "ghost", "link"],
		},
		{
			name: "size",
			type: "enum",
			required: false,
			default: "default",
			description: "The size of the button",
			enumValues: ["default", "sm", "lg", "icon"],
		},
		{
			name: "asChild",
			type: "boolean",
			required: false,
			default: false,
			description:
				"Render as a Slot component, merging props with the child element. Use to render as a link or other element.",
		},
		{
			name: "loading",
			type: "boolean",
			required: false,
			default: false,
			description: "Show loading spinner and disable interaction",
		},
		{
			name: "disabled",
			type: "boolean",
			required: false,
			default: false,
			description: "Disable the button",
		},
		{
			name: "className",
			type: "string",
			required: false,
			description: "Additional CSS classes to merge with the component styles",
		},
	],
	variants: [
		{
			name: "variant",
			description: "Visual style variants",
			values: [
				{
					value: "default",
					description: "Primary filled button with subtle shadow for main actions",
				},
				{
					value: "destructive",
					description: "Red button with shadow for dangerous/irreversible actions",
				},
				{ value: "outline", description: "Bordered button with hover fill for secondary actions" },
				{ value: "secondary", description: "Muted filled button for less prominent actions" },
				{ value: "ghost", description: "Transparent button, background appears on hover" },
				{ value: "link", description: "Styled as a hyperlink with underline on hover, no padding" },
			],
			default: "default",
		},
		{
			name: "size",
			description: "Size variants",
			values: [
				{ value: "default", description: "Standard size (h-10, px-4)" },
				{ value: "sm", description: "Compact size (h-9, px-3)" },
				{ value: "lg", description: "Large size (h-11, px-8, text-base)" },
				{ value: "icon", description: "Square icon-only size (h-10, w-10)" },
			],
			default: "default",
		},
	],
	slots: [
		{
			name: "children",
			description: "Button label content",
			required: true,
			acceptedTypes: ["ReactNode"],
		},
	],
	dependencies: {
		npm: ["class-variance-authority", "@radix-ui/react-slot", "clsx", "tailwind-merge"],
		internal: [],
		peer: ["react", "react-dom"],
	},
	tokensUsed: [
		"primary",
		"primary-foreground",
		"destructive",
		"destructive-foreground",
		"secondary",
		"secondary-foreground",
		"accent",
		"accent-foreground",
		"background",
		"input",
		"ring",
	],
	examples: [
		{
			title: "Basic usage",
			description: "A simple primary button",
			code: "<Button>Click me</Button>",
		},
		{
			title: "Variants",
			description: "Different visual styles",
			code: '<>\n  <Button variant="default">Primary</Button>\n  <Button variant="outline">Outline</Button>\n  <Button variant="secondary">Secondary</Button>\n  <Button variant="ghost">Ghost</Button>\n  <Button variant="destructive">Delete</Button>\n  <Button variant="link">Link</Button>\n</>',
		},
		{
			title: "With loading state",
			description: "Button showing a spinner while loading",
			code: "<Button loading>Submitting...</Button>",
		},
		{
			title: "As link",
			description: "Button rendered as an anchor tag",
			code: '<Button asChild>\n  <a href="/login">Login</a>\n</Button>',
		},
		{
			title: "Icon button",
			description: "Square button with just an icon",
			code: '<Button variant="outline" size="icon" aria-label="Settings">\n  <SettingsIcon />\n</Button>',
		},
	],
	ai: {
		whenToUse:
			"Use for clickable actions: form submissions, confirmations, triggering operations. Use 'default' variant for primary CTAs, 'outline' or 'secondary' for less important actions, 'ghost' for toolbar-style actions.",
		whenNotToUse:
			"Don't use for navigation between pages (use Link or anchor with asChild). Don't use 'destructive' for non-dangerous actions. Don't use for toggling state (use Toggle or Switch).",
		commonMistakes: [
			"Using 'destructive' variant for non-destructive actions",
			"Nesting interactive elements inside asChild button",
			"Missing aria-label when using icon-only size='icon' variant",
			"Using onClick for navigation instead of asChild with a link",
		],
		relatedComponents: ["toggle", "toggle-group", "dropdown-menu"],
		accessibilityNotes:
			"Automatically handles focus ring, disabled state, and aria attributes. Icon-only buttons MUST have aria-label. Loading state automatically sets disabled.",
		tokenBudget: 500,
	},
	tags: ["button", "action", "cta", "form", "interactive", "click"],
};
