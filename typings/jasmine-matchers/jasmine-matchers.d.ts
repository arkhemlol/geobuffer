// Type definitions for jasmine-matchers v0.2.1
// Project: https://github.com/uxebu/jasmine-matchers
// Definitions by: Bart van der Schoor <https://github.com/Bartvds>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/*
Typings 2013 Bart van der Schoor

TypeScript tests auto-extracted from jasmine-matchers unit test.

Original jasmine-matchers license applies:

Copyright (C) 2013, uxebu Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/// <reference path="../jasmine/jasmine.d.ts" />

declare module jasmine {
    interface Matchers {
        // toBe
        toBeAfter(date: Date): boolean;
        toBeArray(): boolean;
        toBeArrayOfBooleans(): boolean;
        toBeArrayOfNumbers(): boolean;
        toBeArrayOfObjects(): boolean;
        toBeArrayOfSize(): boolean;
        toBeArrayOfStrings(): boolean;
        toBeBefore(date: Date): boolean;
        toBeBoolean(): boolean;
        toBeCalculable(): boolean;
        toBeDate(): boolean;
        toBeEmptyArray(): boolean;
        toBeEmptyObject(): boolean;
        toBeEmptyString(): boolean;
        toBeEvenNumber(): boolean;
        toBeFalse(): boolean;
        toBeFunction(): boolean;
        toBeHtmlString(): boolean;
        toBeIso8601(): boolean;
        toBeJsonString(): boolean;
        toBeLongerThan(String: string): boolean;
        toBeNonEmptyArray(): boolean;
        toBeNonEmptyObject(): boolean;
        toBeNonEmptyString(): boolean;
        toBeNumber(): boolean;
        toBeObject(): boolean;
        toBeOddNumber(): boolean;
        toBeSameLengthAs(String: string): boolean;
        toBeShorterThan(String: string): boolean;
        toBeString(): boolean;
        toBeTrue(): boolean;
        toBeWhitespace(): boolean;
        toBeWholeNumber(): boolean;
        toBeWithinRange(floor: number, ceiling: number): boolean;

        // toHave
        toHaveArray(arr: Array<any>): boolean;
        toHaveArrayOfBooleans(arr: Array<boolean>): boolean;
        toHaveArrayOfNumbers(arr: Array<number>): boolean;
        toHaveArrayOfObjects(arr: Array<any>): boolean;
        toHaveArrayOfSize(arr: Array<any>, size: number): boolean;
        toHaveArrayOfStrings(arr: Array<string>): boolean;
        toHaveBoolean(key: any): boolean;
        toHaveCalculable(key: any): boolean;
        toHaveDate(key: any): boolean;
        toHaveDateAfter(key: any, date: Date): boolean;
        toHaveDateBefore(key: any, date: Date): boolean;
        toHaveEmptyArray(key: any): boolean;
        toHaveEmptyObject(key: any): boolean;
        toHaveEmptyString(key: any): boolean;
        toHaveEvenNumber(key: any): boolean;
        toHaveFalse(key: any): boolean;
        toHaveHtmlString(key: any): boolean;
        toHaveIso8601(key: any): boolean;
        toHaveJsonString(key: any): boolean;
        toHaveMember(key: string): boolean;
        toHaveMethod(key: any): boolean;
        toHaveNonEmptyArray(key: any): boolean;
        toHaveNonEmptyObject(key: any): boolean;
        toHaveNonEmptyString(key: any): boolean;
        toHaveNumber(key: any): boolean;
        toHaveNumberWithinRange(key: any, floor: number, ceiling: number): boolean;
        toHaveObject(key: any): boolean;
        toHaveOddNumber(key: any): boolean;
        toHaveString(key: any): boolean;
        toHaveStringLongerThan(key: any, String: string): boolean;
        toHaveStringSameLengthAs(key: any, String: string): boolean;
        toHaveStringShorterThan(key: any, String: string): boolean;
        toHaveTrue(key: any): boolean;
        toHaveWhitespaceString(key: any): boolean;
        toHaveWholeNumber(key: any): boolean;

        toEndWith(subString: string): boolean;
        toImplement(api: any): boolean;
        toStartWith(subString: string): boolean;
        // toThrow
        toThrowAnyError(): boolean;
        toThrowErrorOfType(type: string): boolean;
    }
}

