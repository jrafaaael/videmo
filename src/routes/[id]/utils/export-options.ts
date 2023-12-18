export enum Status {
	AVAILABLE = 'available',
	WIP = 'wip',
	SOON = 'soon'
}

export const EXPORT_OPTIONS = [
	{
		label: '.png',
		value: '.png',
		status: Status.AVAILABLE
	},
	{
		label: '.mp4',
		value: '.mp4',
		status: Status.WIP
	},
	{
		label: '.webm',
		value: '.webm',
		status: Status.SOON
	}
] as const;
