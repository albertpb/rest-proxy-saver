import { Service } from 'typedi';
import { RestClientReader } from './restClientReader';

@Service()
export default class ReaderFactory {
	getReader() {
		switch (process.env.FORMAT) {
			default:
			case 'http': {
				return new RestClientReader();
			}
		}
	}
}
