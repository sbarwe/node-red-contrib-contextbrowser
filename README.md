# node-red-contrib-contextbrowser
Browse the current global, flow and node context in the sidebar.
The addon is for node and function node developers to support debugging and runtime monitoring.

[![NodeRed](https://img.shields.io/badge/Node--Red-0.17-red.svg)](http://nodered.org)


![Contextbrowser in action](https://github.com/sbarwe/node-red-contrib-contextbrowser/blob/master/contextbrowser.gif?raw=true)

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

# Spying on msg

With the `spy`-node you can monitor and inspect `msg`-pass-through between two nodes. 
The spy node collects the following information and provide them on the local context for inspection with contextbrowser:
- msg per second
- msg size per second
- min/max/avg time between msg
- last msg and last msg timestamp
- msg count since reset

The rates are calculated on the counter diffs every 1s.
The node provides  the following settings:
- Pass Through: on / off  (incomming `msg` are passed to the output or not) 
- Statistics: on / off  (calculate statistics and save them to local context)

Note that the statistics will be reset on node's redeployment.
You can apply the settings without redeployment and reset the statistics from the contextbrowser sidebar when selecting a spy-node or by passing in a `mgs` with property `msg.spy.reset = true` once.

Related work:
http://flows.nodered.org/node/node-red-contrib-msg-speed
http://flows.nodered.org/node/node-red-contrib-rate



# Install

Follow the [node installation guide](https://nodered.org/docs/getting-started/adding-nodes) to the npm-package node-red-contrib-contextbrowser.

Note: This node requires a Node-RED version of at least 0.17.

```bash
npm install node-red-contrib-contextbrowser
```

# Usage

Select a node on a workspace and open the "Context Browser" sidebar via the sidebar menu
Now press the refresh button in the head of the sidebar pane to retrieve the current context data from  the runtime.
Each context for node, flow and the global context refresh individually.

[Peter Scargill made a blog post as well what you can to with the nodes config and contextbrowser](http://tech.scargill.net/node-red-global-flow-and-context/)

*Note: Context variables beginning with an underscore will be ignored (private variables)*

# Examples
You can load an example flow from the node-red examples menu, which will show you how you hide data from the contextbrowser by using the get/set operations of context and how to create intermediate debugging properties which are browsable.
	
# Permissions
* `contextbrowser.flow.read` for `./contextbrowser/flow/:id` 
* `contextbrowser.global.read` for `./contextbrowser/global` 
* `contextbrowser.node.read` for `./contextbrowser/node/:id`

# Changelog

[![NPM](https://nodei.co/npm/node-red-contrib-contextbrowser.png)](https://nodei.co/npm/node-red-contrib-contextbrowser/)

## Version 0.0.5

* added spy node to monitor `msg` flow between two nodes, see [Spying on msg](#spying_on_msg)

## Version 0.0.4
* Getting context keys is supported starting with Node-RED 0.17.
* ignoring keys starting with underscore (e.g. _myprivateVar)
* you can open the context in a dedicated browser window
* fix: correct size of tabs
* removed node-red-contrib-config from example

## Version 0.0.3
* changed timestamp of context refresh from ticks to locale string

## Version 0.0.2
* ignore function properties in the context (will skip them from jsonify)

## Version 0.0.1
First release for testing

# TODOs / Ideas
* get only a specific part of the context (like a filter). Helpful when you have bigger structures
* provide a list of Ids which will not be accessible by contextbrowser in settings.js
* test with alternative httpAdmin routes and authentication
* auto refresh the selected context tab in a given interval
* notify user that context data is old if the flow/affected node was deployed
* mark persisted context properties (if feature is available in node-red, extend node-red-contrib-config with this feature)
* spy-node: choose value from context to show per `status` on the node in a given interval or on change.
* spy-node: change color of the status according to rule (>,>=, ==,  <, <==)
* Add advanced examples: (use status node to watch for rule exceptions, live visualization of statistics)
