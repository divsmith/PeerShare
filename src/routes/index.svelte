<script lang="ts">
    import Crypto from 'crypto-js';
    import type { DataConnection } from 'peerjs';
    import type Peer from 'peerjs';
    import { onMount } from 'svelte';

    let peer: Peer;
    let conn: DataConnection;
    let myId: string = '';
    let peerId: string = ''
    let connected: boolean = false;

    let input: string = '';
    let messages = [];

    function sendMessage() {
        messages = [...messages, input];

        if (conn) {
            conn.send(input);
        } else {
            console.log('no peer connection');
        }

        input = '';
    }

    function connectToPeer() {
        if (peer) {
            conn = peer.connect(peerId);
            conn.on('open', () => {
                connected = true;
            });
            conn.on('close', () => {
                connected = false;
            });

            conn.on('data', accept);
        } else {
            console.error('Unable to load Peer');
        }
    }

    function accept(data) {
        messages = [...messages, data];
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
        peer = new Peer();
        peer.on('open', function(id) {
            myId = id;
        });

        peer.on('connection', (connection) => {
            conn = connection;
            connected = true;
            conn.on('data', accept);
            conn.on('close', () => {
                connected = false
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

    {#if !connected} 
        <div class="input mt-20">
            <form class="row row-cols-lg-auto g-3">
                <div class="col-12">
                    <p>{myId}</p>
                </div>
                <div class="col-12">
                    <label class="visually-hidden" for="peer-id">Peer ID</label>
                    <input bind:value={peerId} type="text" class="form-control" id="peer-id" placeholder="Peer ID"/>
                </div>

                <div class="col-12">
                    <button on:click|preventDefault={connectToPeer} class="btn btn-primary">Connect to Peer</button>
                </div>
            </form>
        </div>
    {/if}
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