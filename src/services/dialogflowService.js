// This service will handle all interactions with Dialogflow
import { SessionsClient } from '@google-cloud/dialogflow';  // Using 'import' instead of 'require'

export async function detectIntent(text, sessionId) {
    try {
        const projectId = process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID;
        const sessionClient = new SessionsClient({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
        });

        const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: 'en-US',
                },
            },
        };

        const [response] = await sessionClient.detectIntent(request);
        return {
            intent: response.queryResult.intent.displayName,
            parameters: response.queryResult.parameters,
            fulfillmentText: response.queryResult.fulfillmentText,
        };
    } catch (error) {
        console.error('Error detecting intent:', error);
        throw error;
    }
}
