---
permalink: /ops
title: "Operations"
---

<p>Here's some operational metrics and system health overview, mostly useful for checking how the bots are doing.</p>

<h2>General</h2>

<table>
<tr>
<td>Last updated</td>
    <td>{{ site.data.snapshot.updated                                                         | date: "%Y-%m-%d %H:%M:%S" }} </td>
    </tr>
<tr>
<td>Videos archived</td>
    <td>{{ site.data.snapshot.archivedVideosCount }}                                          </td>
    </tr>
<tr>
<td>Videos waiting</td>
    <td>{{ site.data.snapshot.waitingVideosCount }}                                          </td>
    </tr>
<tr>
<td>Last archived</td>
    <td><a href="{{ site.data.snapshot.lastArchived.url }}" target=_blank>{{ site.data.snapshot.lastArchived.url }} </a> at {{site.data.snapshot.lastArchived.lockExpiry | date: "%Y-%m-%d %H:%M:%S" }} </td>
    </tr>
<tr>
<td>Stuck videos</td>
    <td>{{ site.data.snapshot.stuckVideos }}                                                  </td>
    </tr>

<h2>Bots</h2>

| Bot Name | Last Seen |
| -------- | --------- |

{% for entry in site.data.snapshots.workersHealthCheck %}
|{{entry.worker}}|{{entry.last_seen}}|
{% endfor %}
