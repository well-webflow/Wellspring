const b64 = (buf: ArrayBuffer): string => btoa(String.fromCharCode(...new Uint8Array(buf)));

const unb64 = (str: string): Uint8Array => Uint8Array.from(atob(str), (c) => c.charCodeAt(0));

const importKey = (base64Key: string): Promise<CryptoKey> =>
	crypto.subtle.importKey('raw', unb64(base64Key), 'AES-GCM', false, ['encrypt', 'decrypt']);

export async function encrypt(plaintext: string, base64Key: string): Promise<{ ciphertext: string; iv: string }> {
	const key = await importKey(base64Key);
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext));
	return { ciphertext: b64(ct), iv: b64(iv.buffer as ArrayBuffer) };
}

export async function decrypt(ciphertext: string, ivB64: string, base64Key: string): Promise<string> {
	const key = await importKey(base64Key);
	const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(ivB64) }, key, unb64(ciphertext));
	return new TextDecoder().decode(pt);
}
