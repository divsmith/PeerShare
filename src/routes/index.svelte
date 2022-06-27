<script lang="ts">
    import Crypto from 'crypto-js';
    import type { DataConnection } from 'peerjs';
import type Peer from 'peerjs';
    import { onMount } from 'svelte';

    let peer: Peer;
    let conn: DataConnection;
    let peerID: string = '';
    let serverPeerId: string = ''

    let input: string = '';
    let messages = ['first', 'second', 'third', 'fourth', 'fifth'];

    function sendMessage() {
        messages = [...messages, input];
        input = '';
    }

    function connectToPeer() {
        if (peer) {
            conn = peer.connect(serverPeerId);
            conn.on('open', () => {
                conn.send('hello!');
            });
        }
    }

    // let password: String = '';
    // let decrypt: String = '';
    // let decrypted: String = '';

    // $: ciphertext = Crypto.AES.encrypt(input, password).toString();
    // $: {
    //     try {
    //         decrypted = Crypto.AES.decrypt(ciphertext, decrypt).toString(Crypto.enc.Utf8);
    //     } catch(err) {
    //         decrypted = '';
    //     }
    // }

    onMount(async() => {
        const { Peer } = await import('peerjs');

        // const peer = new Peer();
        // peer.on('open', function(id) {
        //     peerID = id;
        // });
        peer = new Peer();
        peer.on('open', function(id) {
            peerID = id;
        });

        peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                messages = [...messages, data];
            });
        })
    });

</script>

<div class="container">
    <div class="feed mt-20">
        <ul class="list-group">
            {#each messages as message}
               <li class="list-group-item">{message}</li> 
            {/each}
        </ul>
    </div>

    <div class="input mt-20">
        <form class="row row-cols-lg-auto g-3">
            <div class="col-12">
                <label class="visually-hidden" for="input">Enter text</label>
                <input bind:value={input} type="text" class="form-control" id="input" placeholder="Enter text"/>
            </div>

            <div class="col-12">
                <button on:click|preventDefault={sendMessage} class="btn btn-primary">Send</button>
            </div>
        </form>
    </div>

    <div class="input mt-20">
        <form class="row row-cols-lg-auto g-3">
            <p>{peerID}</p>
            <div class="col-12">
                <label class="visually-hidden" for="peer-id">Peer ID</label>
                <input bind:value={serverPeerId} type="text" class="form-control" id="peer-id" placeholder="Peer ID"/>
            </div>

            <div class="col-12">
                <button on:click|preventDefault={connectToPeer} class="btn btn-primary">Connect to Peer</button>
            </div>
        </form>
    </div>
</div>

<!-- <div class="container">
    <form class="mt-20">
        <p class="mb-3">Peer ID: {peerID}</p>
        <div>
            <label for="password" class="form-label">Password</label>
            <input bind:value={password} type="text" id="password" class="form-control"/>
        </div>
    </form>
</div> -->