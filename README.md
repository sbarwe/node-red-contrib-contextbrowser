# node-red-contrib-contextbrowser
Browse the current global, flow and node context in the sidebar.
The addon is for node and function node developers to support debugging and runtime monitoring.

# Features

Sometimes it is not appropriate to print a debug message, write to console and to flood it.
The status information attached to nodes in the editor is limited in its size and shall concentrate
on real state information to the working/task of the node. 

On the other hand you may want to look into a long running system and monitor it. 
The context variables in node-red are a good space to share information like settings 
and states between different nodes and flows and they can be prefilled via functionGlobalContext 
in the [node-red settings file](https://nodered.org/docs/configuration) 
or with [node-red-contrib-config](http://flows.nodered.org/node/node-red-contrib-config).
With the feature of persistence on the roadmap of node-red context is getting more interesting as well to
speed up initialization and continue working on error or to use it as a cache.

This node is a special node-red sidebar addon for debugging and runtime inspect the context variables 
on request for debugging purposes. It will give you the following benefits

* provide information from the node runtime context to the editor/user 
* high performant as information is only transmitted to the editor on request
* the context data is available on a API endpoints (e.g. /contextbrowser/node/:id)  which allows further
  automated longterm monitoring of node runtime variables and integration into other monitoring solutions
  (like nagios or iacinga)


# Install

*The node is currently in alpha-phase*

Follow the [node installation guide](https://nodered.org/docs/getting-started/adding-nodes) to the npm-package node-red-contrib-contextbrowser.

[Currently node-red does not support to get the used keys of a context](https://groups.google.com/forum/#!topic/node-red/H8-sSkBNyUM), so you have to patch node-red first.
You need to patch [./red/runtime/nodes/context.js near line 30](https://github.com/node-red/node-red/blob/master/red/runtime/nodes/context.js#L30) and extend obj with:
```
obj.getKeys = function() { return Object.getOwnPropertyNames(data); }
```

# Usage

Select a node on a workspace and open the "Context Browser" sidebar via the sidebar menu
Now press the refresh button in the head of the sidebar pane to retrieve the current context data from  the runtime.
Ey context for node, flow and the global context refresh individually.

# Examples
You can load an example flow from the node-red examples menu, which will show you how you hide data from the contextbrowser by using the get/set operations of context and how to create intermediate debugging properties which are browsable.

![Contextbrowser in action](https://github.com/sbarwe/node-red-contrib-contextbrowser/blob/master/contextbrowser.gif?raw=true)
	
# Permissions
* ```contextbrowser.flow.read``` for ```/contextbrowser/flow/:id``` 
* ```contextbrowser.global.read``` for ```/contextbrowser/global``` 
* ```contextbrowser.node.read``` for ```/contextbrowser/node/:id```

# Changelog

[![NPM](https://nodei.co/npm/node-red-contrib-contextbrowser.png)](https://nodei.co/npm/node-red-contrib-contextbrowser/)

## Version 0.0.1
First release for testing

# Feature Requests

* auto refresh the selected context tab in a given interval
* notify user that context data is old if the flow/affected node was deployed
* use a list of property names for a node-id, flow-id and global contet to access data handled with context.get/set methods
* make the context property editable from the context browser 
* mark persisted context properties (if feature is available in node-red, extend node-red-contrib-config with this feature)
