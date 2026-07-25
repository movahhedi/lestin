export const children = (
	<>
		<span>first</span>
		<>
			<span>second</span>
			{false}
		</>
	</>
);

export const host = <div>{children}</div>;
