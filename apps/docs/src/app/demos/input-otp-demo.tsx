"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "../../components/ui";

/** InputOTP demo: 6-digit verification code with a center separator. */
export function InputOTPDemo() {
	const [value, setValue] = useState("");

	return (
		<div className="space-y-2">
			<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={value} onChange={setValue}>
				<InputOTPGroup>
					<InputOTPSlot index={0} />
					<InputOTPSlot index={1} />
					<InputOTPSlot index={2} />
				</InputOTPGroup>
				<InputOTPSeparator />
				<InputOTPGroup>
					<InputOTPSlot index={3} />
					<InputOTPSlot index={4} />
					<InputOTPSlot index={5} />
				</InputOTPGroup>
			</InputOTP>
			<p className="text-center text-sm text-muted-foreground">
				{value === "" ? "Enter your one-time password." : `You entered: ${value}`}
			</p>
		</div>
	);
}
