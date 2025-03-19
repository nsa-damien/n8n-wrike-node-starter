declare module 'n8n-workflow' {
  export interface IAuthenticateGeneric {
    type: string;
    properties: {
      auth?: {
        username?: string;
        password?: string;
      };
      qs?: {
        [key: string]: string;
      };
      headers?: {
        [key: string]: string;
      };
    };
  }

  export interface ICredentialTestRequest {
    request: {
      baseURL?: string;
      url?: string;
      method?: string;
    };
  }

  export interface INodeProperties {
    displayName: string;
    name: string;
    type: string;
    default?: any;
    description?: string;
    placeholder?: string;
    required?: boolean;
    typeOptions?: {
      [key: string]: any;
    };
    options?: Array<{
      name: string;
      value: any;
      description?: string;
      action?: string;
    }>;
    displayOptions?: {
      show?: {
        [key: string]: any[];
      };
      hide?: {
        [key: string]: any[];
      };
    };
    noDataExpression?: boolean;
  }

  export interface ICredentialType {
    name: string;
    displayName: string;
    documentationUrl?: string;
    properties: INodeProperties[];
    authenticate?: IAuthenticateGeneric;
    test?: ICredentialTestRequest;
  }

  export interface INodeTypeDescription {
    displayName: string;
    name: string;
    group: string[];
    version: number;
    description: string;
    defaults: {
      name: string;
    };
    inputs: string[];
    outputs: string[];
    credentials?: Array<{
      name: string;
      required?: boolean;
    }>;
    properties: INodeProperties[];
    subtitle?: string;
    icon?: string;
  }

  export interface INodeType {
    description: INodeTypeDescription;
    execute?(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
  }

  export interface IExecuteFunctions {
    getInputData(): INodeExecutionData[];
    getNodeParameter(parameterName: string, itemIndex: number, fallbackValue?: any): any;
    getCredentials(type: string): Promise<ICredentialDataDecryptedObject>;
    continueOnFail(): boolean;
    helpers: {
      returnJsonArray(jsonData: any): INodeExecutionData[];
      requestWithAuthentication(credentialsType: string, requestOptions: any): Promise<any>;
      constructExecutionMetaData(outputData: INodeExecutionData[], options?: any): INodeExecutionData[];
    };
  }

  export interface INodeExecutionData {
    json: {
      [key: string]: any;
    };
    binary?: {
      [key: string]: IBinaryData;
    };
  }

  export interface IBinaryData {
    data: Buffer;
    mimeType: string;
    fileName?: string;
    fileExtension?: string;
  }

  export interface IDataObject {
    [key: string]: any;
  }

  export interface ICredentialDataDecryptedObject {
    [key: string]: any;
  }
}
