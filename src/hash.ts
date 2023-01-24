import crypto from 'crypto';

export const getSHA256ofJSON = (input: unknown) => {
	return crypto
		.createHash('sha256')
		.update(JSON.stringify(input))
		.digest('hex');
};
