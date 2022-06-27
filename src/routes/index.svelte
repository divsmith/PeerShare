<script lang="ts">
    import Crypto from 'crypto-js'

    let plaintext: String = '';
    let password: String = '';
    let decrypt: String = '';
    let decrypted: String = '';

    $: ciphertext = Crypto.AES.encrypt(plaintext, password).toString();
    $: {
        try {
            decrypted = Crypto.AES.decrypt(ciphertext, decrypt).toString(Crypto.enc.Utf8);
        } catch(err) {
            decrypted = '';
        }
    }

</script>

<div class="container">
    <form class="mt-20">
        <div>
            <label for="plaintext" class="form-label">Plaintext</label>
            <input bind:value={plaintext} type="text" id="plaintext-input" class="form-control"/>
        </div>
        <div>
            <label for="password" class="form-label">Password</label>
            <input bind:value={password} type="text" id="password" class="form-control"/>
        </div>
        <div class="mt-10">
            <p>Ciphertext</p> 
            <p>{ciphertext}</p>
        </div>
    </form>

    <form class="mt-20">
        <div>
            <label for="decrypt" class="form-label">Decrypt Password</label>
            <input bind:value={decrypt} type="text" id="decrypt" class="form-control"/>
        </div>
        <div class="mt-10">
            <p>Decrypted Plaintext</p> 
            <p>{decrypted}</p>
        </div>
    </form>
</div>