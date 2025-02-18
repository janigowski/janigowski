import { RegularHeader } from "../components/regular-header";
import Controls from "./controls";

export default function Lamp() {
	return (
		<>
			<RegularHeader
				title="Background Lamp"
				description="You can control my background lamp here. If you want to see the effect just contact me to have a video call and see the colors flowing."
			/>
			<div className="container mx-auto px-4">
				<Controls />
			</div>
		</>
	);
}
