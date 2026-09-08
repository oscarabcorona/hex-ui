import { View } from "react-native";
import { Message } from "../message/message.js";
import { Markdown } from "./markdown.js";

const SAMPLE = `## Deploying

Run the build, then push the tag:

1. \`pnpm build\`
2. \`git tag v1.2.0\`
3. Push with **--follow-tags**

- [x] Tests pass
- [ ] Changelog written

> Tags are immutable once pushed.

See the [release guide](https://hex-core.dev/docs) for the rest.
`;

/**
 * Markdown inside an assistant bubble, which is where it usually lives.
 * @returns The rendered demo
 */
export function MarkdownDemo() {
	return (
		<View className="w-full max-w-md">
			<Message role="assistant" className="max-w-full">
				<Markdown>{SAMPLE}</Markdown>
			</Message>
		</View>
	);
}
