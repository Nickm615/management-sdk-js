import { ContentTypeResponses } from '../../../lib';
import * as responseJson from '../fake-responses/content-types/fake-add-content-type.json';
import { cmLiveClient, getTestClientWithJson, testProjectId } from '../setup';

describe('Add content type', () => {
    let response: ContentTypeResponses.AddContentTypeResponse;

    beforeAll(async () => {
        response = await getTestClientWithJson(responseJson)
            .addContentType()
            .withData((builder) => {
                return {
                    external_id: 'exId',
                    name: 'name',
                    codename: 'codename',
                    elements: [
                        builder.assetElement({
                            name: 'image',
                            type: 'asset',
                        }),
                        builder.textElement({
                            name: 'title',
                            type: 'text',
                        }),
                    ]
                };
            })
            .toPromise();
    });

    it(`url should be correct`, () => {
        const url = cmLiveClient
            .addContentType()
            .withData({} as any)
            .getUrl();
        expect(url).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/types`);
    });

    it(`response should be instance of AddContentTypeResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentTypeResponses.AddContentTypeResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
    });

    it(`content type properties should be mapped`, () => {
        const originalItem = responseJson;
        const contentType = response.data;

        expect(contentType.codename).toEqual(originalItem.codename);
        expect(contentType.name).toEqual(originalItem.name);
        expect(contentType.lastModified).toEqual(new Date(originalItem.last_modified));
        expect(contentType.elements.length).toEqual(originalItem.elements.length);
        expect(Array.isArray(contentType.elements)).toBeTruthy();

        contentType.elements.forEach((element) => {
            const originalElement = originalItem.elements.find((m) => m.id === element.id);
            if (!originalElement) {
                throw Error(`Invalid element with id '${element.id}'`);
            }

            // all element properties should be identical
            for (const key of Object.keys(element)) {
                const mappedElementValue = (element as any)[key];
                const originalElementValue = (originalElement as any)[key];
                expect(mappedElementValue).toEqual(originalElementValue);
            }
        });
    });
});