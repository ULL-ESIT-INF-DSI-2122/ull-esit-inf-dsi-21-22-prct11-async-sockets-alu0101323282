/* eslint-disable no-unused-vars */

import {Note, NoteInterface} from './Note';


/**
 * Chalk colors
 */
export enum Color {
    RED = 'red',
    GREEN = 'green',
    YELLOW = 'yellow',
    BLUE = 'blue',
};

/**
 * Type for client requests
 */
export type RequestType = {
    type: 'add' | 'update' | 'remove' | 'read' | 'list';
    user: string;
    title?: string;
    newTitle?: string;
    body?: string;
    color?: string;
}

/**
 * Type for server responses
 */
export type ResponseType = {
    type: 'add' | 'update' | 'remove' | 'read' | 'list';
    success: boolean;
    message: string;
    notes?: string[];
}