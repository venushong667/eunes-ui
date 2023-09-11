<script lang="ts">
    import LoginForm from "./LoginForm.svelte";
    import SignUpForm from "./SignUpForm.svelte";

    let login = true;

    const toggleForm = () => {
        login = !login;
    }

</script>

<div class="flex justify-center items-center h-full w-full">
    <div class="grid grid-cols-2 h-[750px] w-full min-w-[1000px] max-w-[1350px] bg-slate-800 rounded-3xl overflow-hidden">
        <div class="design">
            design
        </div>

        <div class="flex flex-col w-full h-full justify-center items-center bg-white text-slate-800 gap-4">
            <svelte:component this={login ? LoginForm : SignUpForm} on:switchForm={toggleForm}/>
        </div>
    </div>
</div>