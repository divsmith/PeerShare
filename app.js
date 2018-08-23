var peer;

(function() {
    var id = (Math.random() + 1).toString(36).substr(6);

    peer = new Peer(id);

    peer.on('open', function(id) {
        console.log('id: ' + id);
    });

    peer.on('connection', function(conn) {
        conn.on('open', function() {
            conn.send('Hello world!');
        })
    });

    console.log('working');

    server = confirm("Server?");

    if (!server) {
        dest_id = prompt("ID?");

        var conn = peer.connect(dest_id);

        conn.on('open', function() {
            console.log('client conn');
            conn.on('data', function(data) {
                console.log('client data');
                console.log(data);
            });
        });
    }
})();