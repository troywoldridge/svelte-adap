// src/lib/utils/slugify.ts
export function slugify(input: string): string {
	return input
		.toLowerCase()
		.replace(/\s+/g, '-')        // Replace spaces with dashes
		.replace(/[^a-z0-9\-]/g, '') // Remove special chars
		.replace(/\-+/g, '-')        // Remove consecutive dashes
		.replace(/^-|-$/g, '');      // Trim leading/trailing dashes
}
