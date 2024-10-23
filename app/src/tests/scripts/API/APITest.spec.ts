// API.spec.ts
import { beforeEach, beforeAll, describe, expect, it, vi } from 'vitest';
import AuthModel from '../../../scripts/Models/AuthModel';
import {api} from "../../../scripts/API/API.ts";
import {HTTPMethod} from "../../../scripts/API/Enums/HTTPMethod.ts";
import {ContentType} from "../../../scripts/API/Enums/ContentType.ts";
import CorrectResponse from "../../../scripts/API/Responses/CorrectResponse.ts";
import ErrorResponse from "../../../scripts/API/Responses/ErrorResponse.ts";
import Storage from "../../../scripts/API/Storage.ts";


globalThis.fetch = vi.fn();

vi.mock('./Storage', () => ({
    default: {
        getAccessTokenFromStorage: vi.fn(),
    },
}));

vi.mock('../Models/AuthModel', () => ({
    default: {
        refreshTokens: vi.fn(),
    },
}));

beforeEach(() => {
    vi.clearAllMocks();
});

beforeAll(() => {
    // Mock the window object
    globalThis.window = {
        location: {
            origin: 'http://localhost',
        },
    } as unknown as Window & typeof globalThis; // Cast it to the correct type
});

type successResponseType = {
    data: string
}

describe('[TEST] - API class', () => {
    describe('[TEST] - request() method tests', () => {
        it('[TEST] - Should make a fetch call with correct parameters and handle a successful response', async () => {
            // Arrange
            const method = HTTPMethod.GET;
            const url = '/test';
            const body = undefined;
            const content_type = ContentType.JSON;
            const headers = undefined;
            const mockResponse = { data: 'test' };
            const mockedResponse = new Response(
                JSON.stringify(mockResponse),
                {status : 200}
            );

            // Mock fetch to resolve with a successful response
            vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockedResponse);

            // Act
            const response = await api.request(method, url, body, content_type, headers);

            // Assert
            expect(fetch).toHaveBeenCalledWith(`${api.API_URL}${url}`, {
                method,
                headers: {
                    'Access-Control-Allow-Origin': api.API_URL,
                    Accept: ContentType.JSON,
                    'Content-Type': content_type,
                    Origin: window.location.origin,
                },
                mode: 'cors',
                body,
            });
            expect(response).toBeInstanceOf(CorrectResponse);
            expect((response as CorrectResponse<successResponseType>).responseObject()).toEqual(mockResponse);
        });


        it('[TEST] - Should handle error responses correctly', async () => {
            // Arrange
            const method = HTTPMethod.GET;
            const url = '/test';
            const body = undefined;
            const content_type = ContentType.JSON;
            const headers = undefined;
            const mockErrorResponse = { detail: 'Not found' };
            const mockedResponse = new Response(
                JSON.stringify(mockErrorResponse),
                {status : 404}
            );
            type errorExpected = {
                errorCode: number,
                errorMessage: string;
            }

            // Mock fetch to resolve with an error response
            vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockedResponse);

            // Act
            const response = await api.request(method, url, body, content_type, headers);

            // Assert
            expect(response).toBeInstanceOf(ErrorResponse);
            expect((response as ErrorResponse<errorExpected>).errorCode()).toBe(404);
            expect((response as ErrorResponse<errorExpected>).errorMessage()).toBe('Not found');
        });
    });

    describe('[TEST] - requestLogged() method tests', () => {
        it('[TEST] - Should make an authenticated request', async () => {
            // Arrange
            const method = HTTPMethod.GET;
            const url = '/protected';
            const body = undefined;
            const content_type = ContentType.JSON;

            const mockAccessToken = 'mockAccessToken';
            vi.spyOn(Storage, 'getAccessTokenFromStorage').mockReturnValue(mockAccessToken);

            const mockResponseData = { data: 'protected data' };

            // Mock the fetch response, ensuring `json()` is mocked
            const mockedResponse = {
                status: 200,
                json: vi.fn().mockResolvedValue(mockResponseData),
            };

            vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockedResponse as unknown as Response);

            // Act
            const response = await api.requestLogged(method, url, body, content_type);

            // Assert
            expect(fetch).toHaveBeenCalledWith(`${api.API_URL}${url}`, {
                method,
                headers: {
                    'Access-Control-Allow-Origin': api.API_URL,
                    Accept: ContentType.JSON,
                    'Content-Type': content_type,
                    Origin: window.location.origin,
                    Authorization: `Bearer ${mockAccessToken}`,
                },
                mode: 'cors',
                body,
            });

            expect(response).toBeInstanceOf(CorrectResponse);
            expect((response as CorrectResponse<successResponseType>).responseObject()).toEqual(mockResponseData);
        });


        it('[TEST] - Should refresh tokens and retry if 401 error occurs', async () => {
            // Arrange
            const method = HTTPMethod.GET;
            const url = '/protected';
            const body = undefined;
            const content_type = ContentType.JSON;

            const mockOldAccessToken = 'oldAccessToken';
            const mockNewAccessToken = 'newAccessToken';
            vi.spyOn(Storage, 'getAccessTokenFromStorage')
                .mockReturnValueOnce(mockOldAccessToken) // Before refresh
                .mockReturnValueOnce(mockNewAccessToken); // After refresh

            const mockErrorResponse   = { detail: 'Unauthorized' };
            const mockSuccessResponse = { data: 'protected data' };
            const mockedErrorResponse = new Response(
                JSON.stringify(mockErrorResponse),
                {status : 401}
            );
            const mockedSuccessResponse = new Response(
                JSON.stringify(mockSuccessResponse),
                {status : 200}
            );

            // Mock fetch to first return 401, then 200
            vi.spyOn(globalThis, 'fetch')
                .mockResolvedValueOnce(mockedErrorResponse)
                .mockResolvedValueOnce(mockedSuccessResponse);

            // Mock AuthModel.refreshTokens to resolve
            vi.spyOn(AuthModel, 'refreshTokens').mockResolvedValue(undefined);

            // Act
            const response = await api.requestLogged(method, url, body, content_type);

            // Assert
            expect(AuthModel.refreshTokens).toHaveBeenCalled();
            expect(fetch).toHaveBeenCalledTimes(2);
            expect(fetch).toHaveBeenNthCalledWith(1, `${api.API_URL}${url}`, expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockOldAccessToken}`,
                }),
            }));
            expect(fetch).toHaveBeenNthCalledWith(2, `${api.API_URL}${url}`, expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `Bearer ${mockNewAccessToken}`,
                }),
            }));
            expect(response).toBeInstanceOf(CorrectResponse);
            expect((response as CorrectResponse<successResponseType>).responseObject()).toEqual(mockSuccessResponse);
        });
    });
});
