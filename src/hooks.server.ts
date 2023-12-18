export async function handle({ event, resolve }) {
	// Check if user is trying to go to editor without a screen recording
	if (event.route.id === '/[id]') {
		return new Response('Redirect', {
			status: 302,
			headers: { location: '/' }
		});
	}

	return resolve(event);
}
