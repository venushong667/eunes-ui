export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    password: string;
    roles: Role[];
}

export interface UserDto {
    name: string;
    username: string;
    email: string;
    password: string;
    roleIds: string[];
}

export interface Role {
    id: string;
    name: string;
}