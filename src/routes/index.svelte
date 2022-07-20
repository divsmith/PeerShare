<script lang="ts">
	import Crypto from 'crypto-js';
	import type { DataConnection } from 'peerjs';
	import type Peer from 'peerjs';
	import { onMount } from 'svelte';

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

	let peer: Peer;
	let conn: DataConnection;
	let myId: string = '';
	let peerId: string = '';
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
		
		peerId = '';
	}

	function accept(data) {
		messages = [...messages, data];
	}

	onMount(async () => {
		const { Peer } = await import('peerjs');
		peer = new Peer();
		peer.on('open', function (id) {
			myId = id;
		});

		peer.on('connection', (connection) => {
			conn = connection;
			connected = true;
			conn.on('data', accept);
			conn.on('close', () => {
				connected = false;
			});
		});
	});
</script>

<div class="container mx-auto max-w-xl">
	{#if !connected}
	<div class="rounded-lg bg-slate-300 p-6 mt-20 shadow-sm">
		<p class="m-5">{myId}</p>
		<form on:submit|preventDefault={connectToPeer}>
			<input
				class="mx-5 p-2 rounded-lg outline-none"
				type="text"
				bind:value={peerId}
			/>
			<button
				class="bg-sky-400 text-white py-2 px-5 rounded-lg
						hover:bg-sky-600 active:bg-sky-900
						transition duration-150"
			>Connect</button>
		</form>
	</div>
	{:else}
	<div class="rounded-lg bg-slate-300 p-6 mt-20 shadow-sm">
		{#each messages as message}
			<p class="mx-5">{message}</p>
		{/each}
		<form on:submit|preventDefault={sendMessage}>
			<input
				class="m-5 p-2 rounded-lg outline-none"
				type="text"
				bind:value={input}
			/>
			<button
				class="bg-sky-400 text-white py-2 px-5 rounded-lg
						hover:bg-sky-600 active:bg-sky-900
						transition duration-150"
			>Send</button>
		</form>
	</div>
	{/if}
</div>
