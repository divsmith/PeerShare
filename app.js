var peer;

(function() {
    var id = (Math.random() + 1).toString(36).substr(6);

    peer = new Peer(id);

    peer.on('open', function(id) {
        console.log('id: ' + id);
    });
    console.log('working');
})();