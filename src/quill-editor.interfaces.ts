export type QuillToolbarConfig = ((string | {
    indent?: string;
    list?: string;
    direction?: string;
    header?: number | (boolean | number)[];
    color?: string[];
    background?: string[];
    align?: string[];
    script?: string;
    font?: string[];
    size?: (boolean | string)[];
})[])[];

export type QuillModules = {
    toolbar: QuillToolbarConfig;
}

export interface QuillConfig {
    modules: QuillModules;
}