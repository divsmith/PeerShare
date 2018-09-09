var peer;
var server_conn;
var server_conn_open = false;

(function() {
    var id = (Math.random() + 1).toString(36).substr(6);

    peer = new Peer(id);

    peer.on('open', function(id) {
        id_element = document.getElementById('peerID');
        id_element.innerHTML = id;
        console.log('id: ' + id);
    });

    peer.on('connection', function(conn) {
        server_conn = conn; 
        conn.on('open', function() {
            server_conn_open = true;
            conn.send({"type": "text", "data": "hello world!"});
        })
    });

    //console.log('working');

    
        
})();

function connect_to_peer()
{
    dest_id = document.getElementById('connect_to_id').value;

    var conn = peer.connect(dest_id);

    conn.on('open', function() {
        //console.log('client conn');
        conn.on('data', function(data) {
            //console.log('client data');
            // console.log(file.data);

            // var download_button = document.getElementById("download");
            // download_button.setAttribute('href', file.data);
            // download_button.setAttribute('download', file.name);
                console.log(data)
                node = document.createElement('li');
                text = document.createTextNode(data.data);
                node.classList.add('list-group-item');
                node.appendChild(text);
                document.getElementById('feed').appendChild(node);
            // 
            });
    });
}

function sendText()
{
    text = document.getElementById('text');
    server_conn.send({"type": "text", "data": text.value});
    text.value = '';
}

function sendFile(files) {
    var reader = new FileReader();

    reader.onloadend = function() {
        file = {
            name: files[0].name,
            data: reader.result
        }

        console.log(file);

        if (server_conn_open) {
            server_conn.send(file);
        }
    }

    reader.readAsDataURL(files[0]);
}