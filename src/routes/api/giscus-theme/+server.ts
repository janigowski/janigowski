import css from '../../../../static/giscus-theme.css?raw';

export function GET() {
	return new Response(css, {
		headers: {
			'Content-Type': 'text/css'
		}
	});
}
