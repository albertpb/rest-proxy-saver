import { Saver } from './saver.interface';
import { RestClientSaver } from './restClientSaver';
import { Service } from 'typedi';

@Service()
export default class SaverFactory {
	getSaver(): Saver {
		switch (process.env.FORMAT) {
			default:
			case 'http': {
				return new RestClientSaver();
			}
		}
	}
}
