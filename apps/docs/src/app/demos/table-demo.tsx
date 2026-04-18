import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../components/ui";

const invoices = [
	{ invoice: "INV001", status: "Paid", method: "Credit Card", amount: "$250.00" },
	{ invoice: "INV002", status: "Pending", method: "PayPal", amount: "$150.00" },
	{ invoice: "INV003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
	{ invoice: "INV004", status: "Paid", method: "Credit Card", amount: "$450.00" },
];

/** Table demo: invoice list with caption and right-aligned amount column. */
export function TableDemo() {
	return (
		<Table>
			<TableCaption>A list of your recent invoices.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">Invoice</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Method</TableHead>
					<TableHead className="text-right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{invoices.map((invoice) => (
					<TableRow key={invoice.invoice}>
						<TableCell className="font-medium">{invoice.invoice}</TableCell>
						<TableCell>{invoice.status}</TableCell>
						<TableCell>{invoice.method}</TableCell>
						<TableCell className="text-right">{invoice.amount}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
