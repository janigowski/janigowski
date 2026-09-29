export type ContentKind = 'post' | 'project' | 'book';

export type ContentBase = {
	slug: string;
	path: string;
	title: string;
	description?: string;
	date?: string;
	published?: boolean;
	body: string;
	html: string;
	kind: ContentKind;
};

export type Post = ContentBase & {
	kind: 'post';
	description: string;
};

export type Project = ContentBase & {
	kind: 'project';
	description: string;
	url?: string;
	repository?: string;
};

export type BookStatus = 'read' | 'reading' | 'waiting' | 'paused' | 'listened' | 'listening';
export type BookType = 'paper' | 'audiobook' | 'ebook';

export type Book = ContentBase & {
	kind: 'book';
	author: string;
	status: BookStatus;
	bookType: BookType;
	tag: string;
	cover: string;
};

export type Profile = {
	network: string;
	username?: string;
	url: string;
};

export type Work = {
	name: string;
	position: string;
	startDate: string;
	endDate?: string;
	summary?: string;
	highlights?: string[];
	skills?: string[];
	product_engineering?: unknown;
	company_wide?: unknown;
	leadership?: unknown;
	teaching?: unknown;
	product_design?: unknown;
	projects?: {
		name: string;
		summary?: string;
		highlights?: string[];
		anchor?: string;
	}[];
	other_achievements?: unknown;
	projectsStyles?: unknown;
};

export type Education = {
	institution: string;
	area: string;
	year?: string;
	location: string;
};

export type Talk = {
	date: string;
	conference: string;
	place: string;
	title: string;
};

export type Hackathon = {
	name: string;
	achievement?: string;
};

export type Resume = {
	slug?: string;
	label?: string;
	name: string;
	role: string;
	experience_years?: string;
	products_contributed?: string;
	email: string;
	url: string;
	summary: string;
	locationCity: string;
	locationCountryCode: string;
	profiles: Profile[];
	highlights?: {
		technical?: string[];
		numbers?: {
			experience_years?: string;
			products_contributed?: string;
		};
	};
	clifton_strengths: string[];
	mentoring?: unknown;
	work: Work[];
	education: Education[];
	interests?: string[];
	courses?: string[];
	talks: Talk[];
	hackathons: Hackathon[];
};

export type ResumeInput = Partial<Resume> & {
	slug?: string;
};

export type ResumeVariant = {
	slug: string;
	resolvedResume: Resume;
};
