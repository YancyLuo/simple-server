# simple-server

## install
```console
$ npm i simple-server-l -g
```

## usage

```console
$ cd [folder-path]
```

You can use flowing commands:

```console
$ simpleserver 
```

```console
$ simpleserver -p 3000 //Specify a port
```

```console
$ simpleserver -h 'localhost' // Specify a host
```
Note:If you want to use host except for "localhost" or "127.0.0.1",you need to configure the host file first.
Because essentially it's always accessing local server. 

##introduce
The main function is to open the server under a folder. We can access it and get the files marked with the file type and folders. The server also simply implemented some other functions: compression, range request and caching. My goal is practice, although they are not useful.（English practice day day 😂）