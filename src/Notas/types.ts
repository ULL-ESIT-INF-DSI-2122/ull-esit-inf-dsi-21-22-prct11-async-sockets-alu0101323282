/* eslint-disable no-unused-vars */

import {Note} from './Note';


/**
 * Chalk colors
 */
export enum Color {
    BLACK = 'black',
    RED = 'red',
    GREEN = 'green',
    YELLOW = 'yellow',
    BLUE = 'blue',
    MAGENTA = 'magenta',
    CYAN = 'cyan',
    WHITE = 'white',
    GRAY = 'gray'
};

export type RequestType = {
    type: 'add' | 'update' | 'remove' | 'read' | 'list';
    user: string;
    title?: string;
    newTitle?: string;
    body?: string;
    color?: string;
}

export type ResponseType = {
    type: 'connected' | 'add' | 'update' | 'remove' | 'read' | 'list';
    success: boolean;
    message: string;
    notes?: Note[];
}