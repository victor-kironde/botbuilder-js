/*
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

import * as Models from "./model";
import { ConversationsApi } from './conversationsApi';
import { AttachmentsApi } from './attachmentsApi';

class CustomConnectorClient {
  // Operation groups
  attachments: AttachmentsApi;
  conversations: ConversationsApi;

  /**
   * Initializes a new instance of the ConnectorClient class.
   * @param credentials Subscription credentials which uniquely identify client subscription.
   * @param [options] The parameter options
   */
  constructor(credentials: { appId: string, appPassword: string}, options?: { baseUri: string }) {    
    this.attachments = new AttachmentsApi(credentials);
    this.conversations = new ConversationsApi(credentials);

    if (options){
      this.attachments.basePath = options.baseUri;
      this.conversations.basePath = options.baseUri; 
    }
  }
}

// Operation Specifications

export * from "./model";
export {
  CustomConnectorClient,
  ConversationsApi,
  AttachmentsApi,
  Models as CustomTokenApiModels,
};
