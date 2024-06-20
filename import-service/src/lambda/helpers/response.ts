import {HTTPHeaderMethods} from "../../../types/methods";

export const success = (body: any, allowedMethods?: HTTPHeaderMethods[]) => {
    return buildResponse(200, body, allowedMethods);
};

export const failure = (body: any, allowedMethods?: HTTPHeaderMethods[]) => {
    return buildResponse(500, body, allowedMethods);
};

export const buildResponse = (statusCode: number, body: any, allowedMethods: HTTPHeaderMethods[] = ["GET"]) => ({
    statusCode: statusCode,
    headers: {
        "Access-Control-Allow-Origin": "*",
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': allowedMethods.join(","),
    },
    body: JSON.stringify(body),
});
