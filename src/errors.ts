/**
 * Created by LobanovI on 16.11.2015.
 */

"use strict";
export class BufferError extends Error {
    public debug:any;

    constructor(message?:string, ...debug:Array<any>) {
        this.name = "BufferError";
        this.debug = debug;
        this.message = message;
        console.log(`Debug: ${debug}`);
        super(message);
    }
}


