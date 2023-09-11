<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { User, UserDto } from "./interfaces";
    import { createUser, getRoles } from "./service";
    import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

    const toastStore = getToastStore();

    const dispatch = createEventDispatcher();

    const login = async () => {
        dispatch("switchForm");
    }

    const handleSignUp = async (event: { currentTarget: EventTarget & HTMLFormElement }) => {
        const data = new FormData(event.currentTarget);
        
        const roles = await getRoles();
        const userRole = roles.find(r => r.name === 'user');

        if (!userRole) throw new Error("User role not found. Data loss error");
        console.log(userRole)
        const newUser = {
            name: data.get('name'),
            username: data.get('username'),
            email: data.get('email'),
            password: data.get('password'),
            roleIds: [userRole.id]
        } as UserDto;
        const user = await createUser(newUser)
            .catch(err => {
                throw err;
            });
        console.log(user)

        const t: ToastSettings = {
            message: 'Successfully signed up for your new account! Login now!',
        };
        toastStore.trigger(t);

        return user;
    }
</script>

<span class="text-2xl font-semibold text-slate-700">Sign up for your account</span>
<form method="POST" on:submit|preventDefault={handleSignUp} class="flex flex-col items-center gap-4 w-72">
    <label>
        <input required name="name" type="text" placeholder="Your Name">
    </label>
    <label>
        <input required name="email" type="email" placeholder="Email">
    </label>
    <label>
        <input required name="username" type="text" placeholder="Username">
    </label>
    <label>
        <input required name="password" type="password" placeholder="Password">
    </label>
    <button class="btn variant-filled w-full">Sign Up</button>
</form>
<span>Already has an account? <button class="font-semibold cursor-pointer" on:click={login}>
    Log In
</button></span>

<style>
    label {
        @apply w-full border-none rounded-lg;
    }
    label input {
        @apply shadow rounded-lg w-full border-slate-300 p-2;
    }
</style>