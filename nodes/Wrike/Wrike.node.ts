import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class Wrike implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wrike',
		name: 'wrike',
		icon: 'file:wrike.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Wrike API',
		defaults: {
			name: 'Wrike',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'wrikeApi',
				required: true,
			},
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Task',
						value: 'task',
					},
				],
				default: 'project',
			},
			// Operations for Projects
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'project',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a project',
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete a project',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a project',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many projects',
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update a project',
					},
				],
				default: 'get',
			},
			// Operations for Tasks
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'task',
						],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create a task',
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete a task',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a task',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many tasks',
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update a task',
					},
				],
				default: 'get',
			},

			// Project specific parameters
			// Project: Get operation parameters
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'project',
						],
						operation: [
							'get',
							'delete',
							'update',
						],
					},
				},
				default: '',
				description: 'The ID of the project (folder)',
			},
			// Project: Get All operation parameters
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'project',
						],
						operation: [
							'getAll',
						],
					},
				},
				options: [
					{
						displayName: 'Descendants',
						name: 'descendants',
						type: 'boolean',
						default: false,
						description: 'If true, include all descendant folders',
					},
					{
						displayName: 'Project Only',
						name: 'project',
						type: 'boolean',
						default: true,
						description: 'If true, include only projects (not regular folders)',
					},
					{
						displayName: 'Deleted',
						name: 'deleted',
						type: 'boolean',
						default: false,
						description: 'If true, include deleted folders',
					},
					{
						displayName: 'Fields',
						name: 'fields',
						type: 'multiOptions',
						options: [
							{
								name: 'Metadata',
								value: 'metadata',
							},
							{
								name: 'Has Attachments',
								value: 'hasAttachments',
							},
							{
								name: 'Attachment Count',
								value: 'attachmentCount',
							},
							{
								name: 'Description',
								value: 'description',
							},
							{
								name: 'Brief Description',
								value: 'briefDescription',
							},
							{
								name: 'Custom Fields',
								value: 'customFields',
							},
							{
								name: 'Custom Column IDs',
								value: 'customColumnIds',
							},
							{
								name: 'Super Parent IDs',
								value: 'superParentIds',
							},
							{
								name: 'Space',
								value: 'space',
							},
						],
						default: [],
						description: 'Fields to include in the response',
					},
				],
			},
			// Project: Create operation parameters
			{
				displayName: 'Parent Folder ID',
				name: 'parentFolderId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'project',
						],
						operation: [
							'create',
						],
					},
				},
				default: '',
				description: 'The ID of the parent folder',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'project',
						],
						operation: [
							'create',
						],
					},
				},
				default: '',
				description: 'The title of the project',
			},
			{
				displayName: 'Project Options',
				name: 'projectOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'project',
						],
						operation: [
							'create',
						],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'The description of the project',
					},
					{
						displayName: 'Project',
						name: 'project',
						type: 'boolean',
						default: true,
						description: 'If true, create as a project (not a regular folder)',
					},
					{
						displayName: 'Shareds',
						name: 'shareds',
						type: 'string',
						default: '',
						description: 'Comma-separated list of user IDs to share the project with',
					},
				],
			},
			// Project: Update operation parameters
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'project',
						],
						operation: [
							'update',
						],
					},
				},
				options: [
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'The new title of the project',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'The new description of the project',
					},
					{
						displayName: 'Add Shareds',
						name: 'addShareds',
						type: 'string',
						default: '',
						description: 'Comma-separated list of user IDs to share the project with',
					},
					{
						displayName: 'Remove Shareds',
						name: 'removeShareds',
						type: 'string',
						default: '',
						description: 'Comma-separated list of user IDs to remove sharing for',
					},
				],
			},

			// Task specific parameters
			// Task: Get operation parameters
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'get',
							'delete',
							'update',
						],
					},
				},
				default: '',
				description: 'The ID of the task',
			},
			// Task: Get All operation parameters
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'getAll',
						],
					},
				},
				options: [
					{
						displayName: 'Project ID',
						name: 'folderId',
						type: 'string',
						default: '',
						description: 'Filter tasks by project/folder ID',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Active',
								value: 'Active',
							},
							{
								name: 'Completed',
								value: 'Completed',
							},
							{
								name: 'Deferred',
								value: 'Deferred',
							},
							{
								name: 'Cancelled',
								value: 'Cancelled',
							},
						],
						default: 'Active',
						description: 'Filter tasks by status',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
						default: 50,
						description: 'Max number of results to return',
					},
					{
						displayName: 'Fields',
						name: 'fields',
						type: 'multiOptions',
						options: [
							{
								name: 'Attachments',
								value: 'attachments',
							},
							{
								name: 'Attachment Count',
								value: 'attachmentCount',
							},
							{
								name: 'Authors',
								value: 'authors',
							},
							{
								name: 'Description',
								value: 'description',
							},
							{
								name: 'Brief Description',
								value: 'briefDescription',
							},
							{
								name: 'Custom Fields',
								value: 'customFields',
							},
							{
								name: 'Recurrent',
								value: 'recurrent',
							},
							{
								name: 'Super Task IDs',
								value: 'superTaskIds',
							},
							{
								name: 'Sub Task IDs',
								value: 'subTaskIds',
							},
						],
						default: [],
						description: 'Fields to include in the response',
					},
				],
			},
			// Task: Create operation parameters
			{
				displayName: 'Project ID',
				name: 'folderId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'create',
						],
					},
				},
				default: '',
				description: 'The ID of the project/folder to create the task in',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'create',
						],
					},
				},
				default: '',
				description: 'The title of the task',
			},
			{
				displayName: 'Task Options',
				name: 'taskOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'create',
						],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'The description of the task',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Active',
								value: 'Active',
							},
							{
								name: 'Completed',
								value: 'Completed',
							},
							{
								name: 'Deferred',
								value: 'Deferred',
							},
							{
								name: 'Cancelled',
								value: 'Cancelled',
							},
						],
						default: 'Active',
						description: 'The status of the task',
					},
					{
						displayName: 'Importance',
						name: 'importance',
						type: 'options',
						options: [
							{
								name: 'High',
								value: 'High',
							},
							{
								name: 'Normal',
								value: 'Normal',
							},
							{
								name: 'Low',
								value: 'Low',
							},
						],
						default: 'Normal',
						description: 'The importance of the task',
					},
					{
						displayName: 'Start Date',
						name: 'startDate',
						type: 'dateTime',
						default: '',
						description: 'The start date of the task',
					},
					{
						displayName: 'Due Date',
						name: 'dueDate',
						type: 'dateTime',
						default: '',
						description: 'The due date of the task',
					},
					{
						displayName: 'Assignees',
						name: 'responsibles',
						type: 'string',
						default: '',
						description: 'Comma-separated list of user IDs to assign the task to',
					},
				],
			},
			// Task: Update operation parameters
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: [
							'task',
						],
						operation: [
							'update',
						],
					},
				},
				options: [
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'The new title of the task',
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'The new description of the task',
					},
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Active',
								value: 'Active',
							},
							{
								name: 'Completed',
								value: 'Completed',
							},
							{
								name: 'Deferred',
								value: 'Deferred',
							},
							{
								name: 'Cancelled',
								value: 'Cancelled',
							},
						],
						default: 'Active',
						description: 'The new status of the task',
					},
					{
						displayName: 'Importance',
						name: 'importance',
						type: 'options',
						options: [
							{
								name: 'High',
								value: 'High',
							},
							{
								name: 'Normal',
								value: 'Normal',
							},
							{
								name: 'Low',
								value: 'Low',
							},
						],
						default: 'Normal',
						description: 'The new importance of the task',
					},
					{
						displayName: 'Start Date',
						name: 'startDate',
						type: 'dateTime',
						default: '',
						description: 'The new start date of the task',
					},
					{
						displayName: 'Due Date',
						name: 'dueDate',
						type: 'dateTime',
						default: '',
						description: 'The new due date of the task',
					},
					{
						displayName: 'Add Assignees',
						name: 'addResponsibles',
						type: 'string',
						default: '',
						description: 'Comma-separated list of user IDs to assign the task to',
					},
					{
						displayName: 'Remove Assignees',
						name: 'removeResponsibles',
						type: 'string',
						default: '',
						description: 'Comma-separated list of user IDs to remove from task assignees',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		let responseData;

		for (let i = 0; i < items.length; i++) {
			try {
				// Get credentials for API
				const credentials = await this.getCredentials('wrikeApi');
				const baseUrl = credentials.apiUrl as string;

				// Handle different resources
				if (resource === 'project') {
					// Handle Project (Folder) operations
					if (operation === 'get') {
						// Get a single project
						const projectId = this.getNodeParameter('projectId', i) as string;
						const endpoint = `/folders/${projectId}`;
						
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'wrikeApi',
							{
								method: 'GET',
								url: endpoint,
								baseURL: baseUrl,
							},
						);
						responseData = responseData.data;
					} else if (operation === 'getAll') {
						// Get all projects
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const queryParameters: IDataObject = {};

						// Add query parameters based on additionalFields
						if (additionalFields.descendants === true) {
							queryParameters.descendants = true;
						}
						if (additionalFields.project === true) {
							queryParameters.project = true;
						}
						if (additionalFields.deleted === true) {
							queryParameters.deleted = true;
						}
						if (additionalFields.fields) {
							queryParameters.fields = (additionalFields.fields as string[]).join(',');
						}

						const endpoint = '/folders';
						
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'wrikeApi',
							{
								method: 'GET',
								url: endpoint,
								baseURL: baseUrl,
								qs: queryParameters,
							},
						);
						responseData = responseData.data;
					} else if (operation === 'create') {
						// Create a project
						const parentFolderId = this.getNodeParameter('parentFolderId', i) as string;
						const title = this.getNodeParameter('title', i) as string;
						const projectOptions = this.getNodeParameter('projectOptions', i) as IDataObject;
						
						const body: IDataObject = {
							title,
						};

						// Add optional fields
						if (projectOptions.description) {
							body.description = projectOptions.description;
						}
						if (projectOptions.project !== undefined) {
							body.project = projectOptions.project;
						}
						if (projectOptions.shareds) {
							body.shareds = (projectOptions.shareds as string).split(',');
						}

						const endpoint = `/folders/${parentFolderId}/folders`;
						
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'wrikeApi',
							{
								method: 'POST',
								url: endpoint,
								baseURL: baseUrl,
								body,
								json: true,
							},
						);
						responseData = responseData.data;
					} else if (operation === 'update') {
						// Update a project
						const projectId = this.getNodeParameter('projectId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						
						const body: IDataObject = {};

						// Add fields to update
						if (updateFields.title) {
							body.title = updateFields.title;
						}
						if (updateFields.description) {
							body.description = updateFields.description;
						}
						if (updateFields.addShareds) {
							body.addShareds = (updateFields.addShareds as string).split(',');
						}
						if (updateFields.removeShareds) {
							body.removeShareds = (updateFields.removeShareds as string).split(',');
						}

						const endpoint = `/folders/${projectId}`;
						
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'wrikeApi',
							{
								method: 'PUT',
								url: endpoint,
								baseURL: baseUrl,
								body,
								json: true,
							},
						);
						responseData = responseData.data;
					} else if (operation === 'delete') {
						// Delete a project
						const projectId = this.getNodeParameter('projectId', i) as string;
						const endpoint = `/folders/${projectId}`;
						
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'wrikeApi',
							{
								method: 'DELETE',
								url: endpoint,
								baseURL: baseUrl,
							},
						);
						responseData = responseData.data;
					}
				} else if (resource === 'task') {
					// Handle Task operations
					if (operation === 'get') {
						// Get a single task
						const taskId = this.getNodeParameter('taskId', i) as string;
						const endpoint = `/tasks/${taskId}`;
						
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'wrikeApi',
							{
								method: 'GET',
								url: endpoint,
								baseURL: baseUrl,
							},
						);
						responseData = responseData.data;
					} else if (operation === 'getAll') {
						// Get all tasks
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						const queryParameters: IDataObject = {};

						// Add query parameters based on additionalFields
						if (additionalFields.folderId) {
							queryParameters.folderId = additionalFields.folderId;
						}
						if (additionalFields.status) {
							queryParameters.status = additionalFields.status;
						}
						if (additionalFields.limit) {
							queryParameters.limit = additionalFields.limit;
						}
						if (additionalFields.fields) {
							queryParameters.fields = (additionalFields.fields as string[]).join(',');
						}

						const endpoint = '/tasks';
						
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'wrikeApi',
							{
								method: 'GET',
								url: endpoint,
								baseURL: baseUrl,
								qs: queryParameters,
							},
						);
						responseData = responseData.data;
					} else if (operation === 'create') {
						// Create a task
						const folderId = this.getNodeParameter('folderId', i) as string;
						const title = this.getNodeParameter('title', i) as string;
						const taskOptions = this.getNodeParameter('taskOptions', i) as IDataObject;
						
						const body: IDataObject = {
							title,
						};

						// Add optional fields
						if (taskOptions.description) {
							body.description = taskOptions.description;
						}
						if (taskOptions.status) {
							body.status = taskOptions.status;
						}
						if (taskOptions.importance) {
							body.importance = taskOptions.importance;
						}
						if (taskOptions.startDate) {
							body.dates = { start: taskOptions.startDate };
						}
						if (taskOptions.dueDate) {
							if (!body.dates) {
								body.dates = {};
							}
							(body.dates as IDataObject).due = taskOptions.dueDate;
						}
						if (taskOptions.responsibles) {
							body.responsibles = (taskOptions.responsibles as string).split(',');
						}

						const endpoint = `/folders/${folderId}/tasks`;
						
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'wrikeApi',
							{
								method: 'POST',
								url: endpoint,
								baseURL: baseUrl,
								body,
								json: true,
							},
						);
						responseData = responseData.data;
					} else if (operation === 'update') {
						// Update a task
						const taskId = this.getNodeParameter('taskId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
						
						const body: IDataObject = {};

						// Add fields to update
						if (updateFields.title) {
							body.title = updateFields.title;
						}
						if (updateFields.description) {
							body.description = updateFields.description;
						}
						if (updateFields.status) {
							body.status = updateFields.status;
						}
						if (updateFields.importance) {
							body.importance = updateFields.importance;
						}
						if (updateFields.startDate || updateFields.dueDate) {
							body.dates = {};
							if (updateFields.startDate) {
								(body.dates as IDataObject).start = updateFields.startDate;
							}
							if (updateFields.dueDate) {
								(body.dates as IDataObject).due = updateFields.dueDate;
							}
						}
						if (updateFields.addResponsibles) {
							body.addResponsibles = (updateFields.addResponsibles as string).split(',');
						}
						if (updateFields.removeResponsibles) {
							body.removeResponsibles = (updateFields.removeResponsibles as string).split(',');
						}

						const endpoint = `/tasks/${taskId}`;
						
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'wrikeApi',
							{
								method: 'PUT',
								url: endpoint,
								baseURL: baseUrl,
								body,
								json: true,
							},
						);
						responseData = responseData.data;
					} else if (operation === 'delete') {
						// Delete a task
						const taskId = this.getNodeParameter('taskId', i) as string;
						const endpoint = `/tasks/${taskId}`;
						
						responseData = await this.helpers.requestWithAuthentication.call(
							this,
							'wrikeApi',
							{
								method: 'DELETE',
								url: endpoint,
								baseURL: baseUrl,
							},
						);
						responseData = responseData.data;
					}
				}

				// Return the response data
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
