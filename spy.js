/**
 * Copyright 
 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

// If you use this as a template, update the copyright with your own name.

// Sample Node-RED node file

module.exports = function(RED) {
  "use strict";
  function SpyNode(n) {
    const sizeof = require("object-sizeof");

    this.blockmessages = n.blockmessages;
    this.dostats = n.dostats;

    RED.nodes.createNode(this, n);
    var node = this;

    function resetStats() {
      let c = node.context();
      c.set("lastmsg", null);
      c.set("lastmsgts", Date.now());
      c.set("msgcount", 0);
      c.set("bytestotal", 0);

      c.set("msgpersec", 0);
      c.set("bytespersec", 0);
      c.set("mintbm", Infinity);
      c.set("maxtbm", 0);
      c.set("avgtbm", 0);
    }

    node.lmc = 0; // last message count
    node.lmv = 0; // last message volume

    function updateStats() {
        // TODO: do this over a sliding window of about 10secs
        
      try {
        let c = node.context();
        let cmc = c.get("msgcount");
        let cmv = c.get("bytestotal");
        if (node.lmc < cmc) c.set("msgpersec", cmc - node.lmc);
        if (node.lmv < cmv) c.set("bytespersec", cmv - node.lmv);
        node.lmc = cmc;
        node.lmv = cmv;
      } catch (err) {
        //TODO: log error
      }
    }

    resetStats();

    if (node.dostats) {
      node.statTimer = setInterval(updateStats, 1000);
    }

    this.on("input", function(msg) {
      let unblocked = true;
      let dostats = true;
      try {
        // utils verwenden if (msg.spy.blockmessages)
        if (dostats) {
          let c = node.context();
          let msgcount = c.get("msgcount") || 0;
          let msgts = Date.now();

          // do tbm calculation only after we received the first msg
          if (msgcount > 0) {
            let lastmsgts = c.get("lastmsgts");
            let tbm = (msgts - lastmsgts) / 1000.0; // ms to seconds
            let mintbm = c.get("mintbm");
            let maxtbm = c.get("maxtbm");
            if (tbm > maxtbm) c.set("maxtbm", tbm);
            if (tbm < mintbm) c.set("mintbm", tbm);
            //TODO: calculate avg on window
            c.set("avgtbm", 0);
          }

          c.set("lastmsg", msg);
          c.set("msgcount", msgcount + 1);
          c.set("lastmsgts", msgts);
          let volume = c.get("bytestotal") || 0;
          c.set("bytestotal", sizeof(msg) + volume);
        }
      } catch (err) {
      } finally {
        if (unblocked) node.send(msg);
      }
    });

    this.on("close", function() {
      clearInterval(node.statTimer);
    });
  }
  RED.nodes.registerType("spy", SpyNode);
};
