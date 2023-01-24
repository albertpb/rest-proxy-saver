import 'reflect-metadata';
import './env';
import Koa from 'koa';
import { koaBody } from 'koa-body';
import { Container } from 'typedi';
import SaverFactory from './saverFactory';
import { RequestRedirect } from './requestRedirect';
import ReaderFactory from './readerFactory';

const app = new Koa();

app.use(koaBody());

const targetURL = process.env.TARGET_URL;

app.use(async (ctx) => {
	try {
		const request = {
			path: ctx.path,
			method: ctx.method,
			headers: {
				'Content-Type': ctx.header['content-type'] || 'text/plain',
				Accept: ctx.header['accept'] || 'text/plain',
			},
			body: ctx.request.body,
		};

		if (targetURL) {
			const { response, body } = await Container.get(
				RequestRedirect
			).makeRequest(targetURL, request);

			if (response.statusCode === 200) {
				const hash = Container.get(SaverFactory)
					.getSaver()
					.saveRequest(targetURL, request);
				Container.get(SaverFactory).getSaver().saveResponse(hash, body);
			}

			ctx.status = response.statusCode;
			ctx.body = body;
		} else {
			const hash = Container.get(SaverFactory)
				.getSaver()
				.getHash(request);

			const response = Container.get(ReaderFactory)
				.getReader()
				.readResponse(hash);

			ctx.status = 200;
			ctx.body = response;
		}
	} catch (error) {
		console.error(error);
	}
});

app.listen(3030);
