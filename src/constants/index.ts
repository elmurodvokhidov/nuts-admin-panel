export const LOCAL_SERVER_URL = "http://localhost:5000/api";
export const GLOBAL_SERVER_URL = "https://nuts-server-ipwp.onrender.com/api";
export const PASSCODE = import.meta.env.VITE_PASSCODE;

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    SKELETON = 'skeleton',
    SELECT = 'select',
};

export const VIDEO_TYPES = ["home", "about"];