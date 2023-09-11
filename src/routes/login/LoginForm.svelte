<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    const signUp = async () => {
        dispatch("switchForm");
    }
</script>


<span class="text-2xl font-semibold text-slate-700">Login</span>
<span>
    No account?     
    <button class="font-semibold cursor-pointer" on:click={signUp}>
        Sign Up
    </button>
</span>
<form method="POST" action="?/login" class="flex flex-col items-center gap-4 w-72">
    <label>
        <input required name="email" type="email" placeholder="Email">
    </label>
    <label>
        <input required name="password" type="password" placeholder="Password">
    </label>
    <button class="btn variant-filled w-full">Log in</button>
</form>

<style>
    label {
        @apply w-full border-none rounded-lg;
    }
    label input {
        @apply shadow rounded-lg w-full border-slate-300 p-2;
    }
</style>