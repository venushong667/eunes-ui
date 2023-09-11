import type { Role, User, UserDto } from "./interfaces";


export const createUser = async (newUser: UserDto) => {
    
    const user = await fetch('/api/auth/users', {
        method: 'POST',
        body: JSON.stringify(newUser)
    })
        .then(response => response.json())
        .catch(err => console.error(err));
    
    return user as User;
}

export const getRoles = async () => {
    const roles = await fetch('/api/auth/roles')
        .then(response => response.json())
        .catch(err => console.error(err));

    return roles as Role[];
}

