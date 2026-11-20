// A public guide cannot know which independently hosted Villow someone owns.
// Build only an HTTPS navigation URL; never store or fetch the supplied address.
export function adminDestination(value) {
 const url = new URL(value.trim());
 if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid Villow address');
 return new URL('/admin', url.origin).href;
}
