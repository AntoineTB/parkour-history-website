---
permalink: /ops
title: "Operations"
---

Here's some operational metrics and system health overview, mostly useful for checking how the bots are doing.

## General

|What|Details|
|-|-|
| Last updated    | {{ site.data.snapshot.updated                                                         | date: "%Y-%m-%d %H:%M:%S" }} |
| Videos archived | {{ site.data.snapshot.archivedVideosCount }}                                          |
| Videos waiting | {{ site.data.snapshot.waitingVideosCount }}                                          |
| Last archived   | <a href="{{ site.data.snapshot.lastArchived.url }}" target=_blank>{{ site.data.snapshot.lastArchived.url }} </a> at {{site.data.snapshot.lastArchived.lockExpiry | date: "%Y-%m-%d %H:%M:%S" }} |
| Stuck videos    | {{ site.data.snapshot.stuckVideos }}                                                  |

## Bots

| Bot Name | Last Seen |
| -------- | --------- |
{% for entry in site.data.snapshots.workersHealthCheck %}
|{{entry.worker}}|{{entry.last_seen}}|
{% endfor %}

