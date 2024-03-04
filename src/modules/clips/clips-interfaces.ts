export interface IPostClipRequest {
	title: string;
	tags?: string;
	file: Express.Multer.File;
	creatorId: string;
}

export interface IGetOneClipResponse {
	id: string;
	creatorId: string;
	creatorName: string;
	title: string;
	tags?: string[];
	isCreatorCurrentUser?: boolean;
	createdAt: string;
	url: string;
}
