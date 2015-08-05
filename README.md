## A node.js testbed
This is a project that serves s a testbed for my node.js demo applications. It currently contains two projects
1. a vary basic 'Hello World' node.js application server. 
2. a chat server that demonstrates basic express and socket.io usage.

#### Prerequisites
You must download and instal node.js

#### Hello World Project
This is my first node.js project. My first server exists in nodeserver and you can start it by issuing the `node helloWorldServer` command while in nodeserver directory

#### Chat Server Project
A chat-example based on node.js express and socket.io can be found in chat-example directory (based on [socket.io tutorial] (http://socket.io/get-started/chat))
From the chat-example directory, you can use:
```
npm install
```

to download all project dependencies into node_modules directory. The you can start ther server using:
```
node index.js
```


Navigate to http://localhost:3000/ from multiple browsers and/or tabs and check the applications functionality
 