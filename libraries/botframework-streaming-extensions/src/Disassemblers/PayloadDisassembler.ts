/**
 * @module botframework-streaming-extensions
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { HttpContentStream } from '../HttpContentStream';
import { IHeader } from '../Models/Header';
import { PayloadTypes } from '../Models/PayloadTypes';
import { IStreamDescription } from '../Models/StreamDescription';
import { PayloadSender } from '../PayloadTransport/PayloadSender';
import { SubscribableStream } from '../SubscribableStream';
import { StreamWrapper } from './StreamWrapper';

export abstract class PayloadDisassembler {
    public abstract payloadType: PayloadTypes;
    private readonly sender: PayloadSender;
    private stream: SubscribableStream;
    private streamLength?: number;
    private readonly id: string;

    public constructor(sender: PayloadSender, id: string) {
        this.sender = sender;
        this.id = id;
    }

    protected static async getStreamDescription(stream: HttpContentStream): Promise<IStreamDescription> {
        let description: IStreamDescription = {id: stream.id};

        if (stream.content.headers) {
            description.contentType = stream.content.headers.contentType;
            description.length = stream.content.headers.contentLength;
        } else {
            description.contentType = 'unknown';
            description.length = 0;
        }

        return description;
    }

    protected static serialize<T>(item: T): StreamWrapper {
        let stream: SubscribableStream = new SubscribableStream();

        stream.write(JSON.stringify(item));
        stream.end();

        return new StreamWrapper(stream, stream.length);
    }

    public abstract async getStream(): Promise<StreamWrapper>;

    public async disassemble(): Promise<void> {
        let w: StreamWrapper = await this.getStream();

        this.stream = w.stream;
        this.streamLength = w.streamLength;

        return this.send();
    }

    private async send(): Promise<void> {
        let header: IHeader ={ PayloadType: this.payloadType, PayloadLength: this.streamLength, Id: this.id, End: true}
        this.sender.sendPayload(header, this.stream, undefined);
    }
}
