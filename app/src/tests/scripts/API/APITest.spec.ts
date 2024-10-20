// API.spec.ts
import { beforeEach, beforeAll, describe, expect, it, vi } from 'vitest';
import AuthModel from '../../../scripts/Models/AuthModel';
import {api} from "../../../scripts/API/API.ts";
import {HTTPMethod} from "../../../scripts/API/Enums/HTTPMethod.ts";
import {ContentType} from "../../../scripts/API/Enums/ContentType.ts";
import CorrectResponse from "../../../scripts/API/Responses/CorrectResponse.ts";
import ErrorResponse from "../../../scripts/API/Responses/ErrorResponse.ts";
import Storage from "../../../scripts/API/Storage.ts";


global.fetch = vi.fn();

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
    global.window = {
        location: {
            origin: 'http://localhost',
        },
    } as unknown as Window & typeof globalThis; // Cast it to the correct type
});

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

            type response = {
                data: string;
            }

            // Mock fetch to resolve with a successful response
            vi.spyOn(global, 'fetch').mockResolvedValue({
                status: 200,
                json: vi.fn().mockResolvedValue(mockResponse)
            });

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
            expect((response as CorrectResponse<response>).responseObject()).toEqual(mockResponse);
        });


        it('[TEST] - Should handle error responses correctly', async () => {
            // Arrange
            const method = HTTPMethod.GET;
            const url = '/test';
            const body = undefined;
            const content_type = ContentType.JSON;
            const headers = undefined;
            const mockErrorResponse = { detail: 'Not found' };

            type errorExpected = {
                errorCode: number,
                errorMessage: string;
            }

            // Mock fetch to resolve with an error response
            vi.spyOn(global, 'fetch').mockResolvedValue({
                status: 404,
                json: vi.fn().mockResolvedValue(mockErrorResponse),
            });

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
            (Storage.getAccessTokenFromStorage as vi.Mock).mockReturnValue(mockAccessToken);

            const mockResponse = { data: 'protected data' };
            vi.spyOn(global, 'fetch').mockResolvedValue({
                status: 200,
                json: vi.fn().mockResolvedValue(mockResponse),
            });

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
            expect((response as CorrectResponse<{data: string}>).responseObject()).toEqual(mockResponse);
        });

        it('[TEST] - Should refresh tokens and retry if 401 error occurs', async () => {
            // Arrange
            const method = HTTPMethod.GET;
            const url = '/protected';
            const body = undefined;
            const content_type = ContentType.JSON;

            const mockOldAccessToken = 'oldAccessToken';
            const mockNewAccessToken = 'newAccessToken';
            (Storage.getAccessTokenFromStorage as vi.Mock)
                .mockReturnValueOnce(mockOldAccessToken) // Before refresh
                .mockReturnValueOnce(mockNewAccessToken); // After refresh

            const mockErrorResponse = { detail: 'Unauthorized' };
            const mockSuccessResponse = { data: 'protected data' };

            // Mock fetch to first return 401, then 200
            vi.spyOn(global, 'fetch')
                .mockResolvedValueOnce({
                    status: 401,
                    json: vi.fn().mockResolvedValue(mockErrorResponse),
                })
                .mockResolvedValueOnce({
                    status: 200,
                    json: vi.fn().mockResolvedValue(mockSuccessResponse),
                });

            // Mock AuthModel.refreshTokens to resolve
            (AuthModel.refreshTokens as vi.Mock).mockResolvedValue(undefined);

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
            expect((response as CorrectResponse<any>).responseObject()).toEqual(mockSuccessResponse);
        });
    });
});
