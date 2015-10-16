# dAc-ajax-node
Ajax access to server side node.js proxied through PHP with built-in support to pass content via STDIN or on the command line.

Be sure to change `$ot->cmd =` in ajax-node.php to point to the desired node command. 

#### Notes

````
// NODE INSTALL - home directory
// -----------------------------
// mkdir srcnode
// cd srcnode
// curl -LO https://nodejs.org/dist/v4.2.1/node-v4.2.1.tar.gz
// follow instructions at: http://tnovelli.net/blog/blog.2011-08-27.node-npm-user-install.html
// -- which are:
// tar xf node-v4.2.1.tar.gz
// cd node-v4.2.1
// ./configure --prefix=$HOME/.local
// make
// make install
// cd
// ln -s .local/lib/node_modules .node_modules
// export PATH=$HOME/.local/bin:$PATH
// -- also add the above to ~.profile
````
Alternativly use [nave](https://github.com/isaacs/nave) which simply and easily installs and uses any node.js version.

QUnit based tests are automatically compiled using google closure with -advanced option
to veryify that the libaray is fully closure compilable.
