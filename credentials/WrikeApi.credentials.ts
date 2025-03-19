import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WrikeApi implements ICredentialType {
	name = 'wrikeApi';
	displayName = 'Wrike API';
	documentationUrl = 'https://developers.wrike.com/overview/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The Wrike API token',
		},
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'https://www.wrike.com/api/v4',
			required: true,
			description: 'The Wrike API URL (e.g., https://www.wrike.com/api/v4 or https://eu-app.wrike.com/api/v4)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.apiUrl}}',
			url: '/contacts?me',
			method: 'GET',
		},
	};
}
